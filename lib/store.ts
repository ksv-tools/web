import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { hasSupabase } from "./config";
import { supabaseAdmin } from "./supabase";

/** "pending": chờ duyệt, "approved": được dùng, "locked": bị khóa. */
export type UserStatus = "pending" | "approved" | "locked";

export type Profile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  provider: string;
  status: UserStatus;
  /** null: dùng hạn mức mặc định. */
  dailyQuota: number | null;
  createdAt: string;
  lastSeenAt: string | null;
};

export type Download = {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  tool: string;
  version: string;
  createdAt: string;
};

type ProfilePatch = Partial<Pick<Profile, "status" | "dailyQuota" | "lastSeenAt" | "fullName" | "avatarUrl">>;

interface Store {
  getProfile(id: string): Promise<Profile | null>;
  createProfile(p: Omit<Profile, "createdAt" | "lastSeenAt" | "dailyQuota">): Promise<Profile>;
  listProfiles(): Promise<Profile[]>;
  updateProfile(id: string, patch: ProfilePatch): Promise<void>;
  countDownloadsSince(userId: string, sinceIso: string): Promise<number>;
  addDownload(userId: string, tool: string, version: string): Promise<void>;
  listDownloads(opts?: { userId?: string; limit?: number }): Promise<Download[]>;
}

// ---------- Supabase ----------

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  status: UserStatus;
  daily_quota: number | null;
  created_at: string;
  last_seen_at: string | null;
};

const fromRow = (r: ProfileRow): Profile => ({
  id: r.id,
  email: r.email ?? "",
  fullName: r.full_name ?? "",
  avatarUrl: r.avatar_url,
  provider: r.provider ?? "",
  status: r.status,
  dailyQuota: r.daily_quota,
  createdAt: r.created_at,
  lastSeenAt: r.last_seen_at,
});

function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

const supabaseStore: Store = {
  async getProfile(id) {
    const row = must(await supabaseAdmin().from("profiles").select("*").eq("id", id).maybeSingle());
    return row ? fromRow(row as ProfileRow) : null;
  },
  async createProfile(p) {
    const row = must(
      await supabaseAdmin()
        .from("profiles")
        .upsert({
          id: p.id,
          email: p.email,
          full_name: p.fullName,
          avatar_url: p.avatarUrl,
          provider: p.provider,
          status: p.status,
        })
        .select("*")
        .single(),
    );
    return fromRow(row as ProfileRow);
  },
  async listProfiles() {
    const rows = must(await supabaseAdmin().from("profiles").select("*").order("created_at", { ascending: false }));
    return (rows as ProfileRow[]).map(fromRow);
  },
  async updateProfile(id, patch) {
    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.dailyQuota !== undefined) row.daily_quota = patch.dailyQuota;
    if (patch.lastSeenAt !== undefined) row.last_seen_at = patch.lastSeenAt;
    if (patch.fullName !== undefined) row.full_name = patch.fullName;
    if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;
    must(await supabaseAdmin().from("profiles").update(row).eq("id", id));
  },
  async countDownloadsSince(userId, sinceIso) {
    const res = await supabaseAdmin()
      .from("downloads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", sinceIso);
    if (res.error) throw new Error(res.error.message);
    return res.count ?? 0;
  },
  async addDownload(userId, tool, version) {
    must(await supabaseAdmin().from("downloads").insert({ user_id: userId, tool, version }));
  },
  async listDownloads(opts = {}) {
    let q = supabaseAdmin()
      .from("downloads")
      .select("id, user_id, tool, version, created_at, profiles(email, full_name)")
      .order("created_at", { ascending: false })
      .limit(opts.limit ?? 200);
    if (opts.userId) q = q.eq("user_id", opts.userId);
    const rows = must(await q) as unknown as {
      id: number;
      user_id: string;
      tool: string;
      version: string;
      created_at: string;
      profiles: { email: string | null; full_name: string | null } | null;
    }[];
    return rows.map((r) => ({
      id: String(r.id),
      userId: r.user_id,
      email: r.profiles?.email ?? "",
      fullName: r.profiles?.full_name ?? "",
      tool: r.tool,
      version: r.version,
      createdAt: r.created_at,
    }));
  },
};

// ---------- Chế độ thử: file JSON trên máy ----------

type DemoData = { profiles: Profile[]; downloads: Omit<Download, "email" | "fullName">[] };
const DEMO_FILE = path.join(process.cwd(), ".data", "demo.json");

async function readDemo(): Promise<DemoData> {
  try {
    return JSON.parse(await fs.readFile(DEMO_FILE, "utf8")) as DemoData;
  } catch {
    return { profiles: [], downloads: [] };
  }
}

async function writeDemo(d: DemoData) {
  await fs.mkdir(path.dirname(DEMO_FILE), { recursive: true });
  await fs.writeFile(DEMO_FILE, JSON.stringify(d, null, 2), "utf8");
}

const demoStore: Store = {
  async getProfile(id) {
    return (await readDemo()).profiles.find((p) => p.id === id) ?? null;
  },
  async createProfile(p) {
    const d = await readDemo();
    const full: Profile = { ...p, dailyQuota: null, createdAt: new Date().toISOString(), lastSeenAt: null };
    d.profiles = [full, ...d.profiles.filter((x) => x.id !== p.id)];
    await writeDemo(d);
    return full;
  },
  async listProfiles() {
    return (await readDemo()).profiles;
  },
  async updateProfile(id, patch) {
    const d = await readDemo();
    d.profiles = d.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p));
    await writeDemo(d);
  },
  async countDownloadsSince(userId, sinceIso) {
    return (await readDemo()).downloads.filter((x) => x.userId === userId && x.createdAt >= sinceIso).length;
  },
  async addDownload(userId, tool, version) {
    const d = await readDemo();
    d.downloads.unshift({ id: crypto.randomUUID(), userId, tool, version, createdAt: new Date().toISOString() });
    await writeDemo(d);
  },
  async listDownloads(opts = {}) {
    const d = await readDemo();
    const byId = new Map(d.profiles.map((p) => [p.id, p]));
    return d.downloads
      .filter((x) => !opts.userId || x.userId === opts.userId)
      .slice(0, opts.limit ?? 200)
      .map((x) => ({ ...x, email: byId.get(x.userId)?.email ?? "", fullName: byId.get(x.userId)?.fullName ?? "" }));
  },
};

export const store: Store = hasSupabase ? supabaseStore : demoStore;

/** 0 giờ hôm nay theo giờ Việt Nam (UTC+7), dạng ISO. Hạn mức tải tính theo ngày này. */
export function startOfTodayVN(now = new Date()): string {
  const vn = new Date(now.getTime() + 7 * 3600_000);
  vn.setUTCHours(0, 0, 0, 0);
  return new Date(vn.getTime() - 7 * 3600_000).toISOString();
}
