"use client";

import { useEffect, useState } from "react";
import { EN } from "@/lib/i18n-en";
import { Icon } from "./Icon";

/**
 * Nút nền sáng/tối và nút ngôn ngữ ở góc phải đầu trang.
 * - Nền: lưu "ksv_theme" = light | dark (chưa chọn thì theo máy). Áp lên <html data-theme>.
 * - Ngôn ngữ: lưu "ksv_lang" = vi | en. Tiếng Anh dịch chữ giao diện theo từ điển lib/i18n-en.ts, ngay trên trang
 *   (chỉ đổi nội dung chữ, không thay phần tử nên không làm hỏng React). Tên, nội dung văn bản pháp luật giữ tiếng Việt.
 */

const THEME_KEY = "ksv_theme";
const LANG_KEY = "ksv_lang";

/** Chạy trong <head> trước khi vẽ trang để không nháy màu. */
export const PREFS_BOOT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;if(localStorage.getItem("${LANG_KEY}")==="en"){document.documentElement.lang="en";document.documentElement.classList.add("tr-wait");setTimeout(function(){document.documentElement.classList.remove("tr-wait")},2500)}}catch(e){}`;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v);
  } catch {
    /* trình duyệt chặn lưu: chỉ áp dụng trong lần mở trang này */
  }
}

/* ---------------- Dịch giao diện ---------------- */

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Tra từ điển; chuỗi ghép kiểu "Hình sự · Dân sự" thì dịch từng phần. */
function lookup(key: string): string | undefined {
  if (!key) return undefined;
  if (EN[key]) return EN[key];
  if (!key.includes(" · ")) return undefined;
  const parts = key.split(" · ").map((p) => EN[p]);
  return parts.every(Boolean) ? parts.join(" · ") : undefined;
}
const ATTRS = ["placeholder", "title", "aria-label"] as const;
const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE", "NOSCRIPT"]);

/** Nút đã dịch: chữ gốc và chữ dịch, để trả lại tiếng Việt. */
const textDone = new WeakMap<Text, { vi: string; en: string }>();
const attrDone = new WeakMap<Element, Record<string, { vi: string; en: string }>>();
let titleVi = "";

function translateText(n: Text, en: boolean) {
  const cur = n.nodeValue ?? "";
  const done = textDone.get(n);
  if (!en) {
    if (done && cur === done.en) n.nodeValue = done.vi;
    return;
  }
  if (done && cur === done.en) return;
  const t = lookup(norm(cur));
  if (!t) return;
  const out = (cur.match(/^\s*/)?.[0] ?? "") + t + (cur.match(/\s*$/)?.[0] ?? "");
  textDone.set(n, { vi: cur, en: out });
  n.nodeValue = out;
}

function translateAttrs(el: Element, en: boolean) {
  for (const a of ATTRS) {
    const cur = el.getAttribute(a);
    if (cur == null) continue;
    const rec = attrDone.get(el) ?? {};
    const done = rec[a];
    if (!en) {
      if (done && cur === done.en) el.setAttribute(a, done.vi);
      continue;
    }
    if (done && cur === done.en) continue;
    const t = lookup(norm(cur));
    if (!t) continue;
    rec[a] = { vi: cur, en: t };
    attrDone.set(el, rec);
    el.setAttribute(a, t);
  }
}

function walk(root: Node, en: boolean) {
  if (root.nodeType === Node.TEXT_NODE) {
    const p = root.parentElement;
    if (p && !SKIP.has(p.tagName) && !p.closest("[data-no-tr]")) translateText(root as Text, en);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
  const el = root as Element;
  if (el.nodeType === Node.ELEMENT_NODE) {
    if (SKIP.has(el.tagName) || el.hasAttribute("data-no-tr")) return;
    translateAttrs(el, en);
  }
  for (let c = root.firstChild; c; c = c.nextSibling) walk(c, en);
}

function translateTitle(en: boolean) {
  const cur = document.title;
  if (!en) {
    if (titleVi) document.title = titleVi;
    titleVi = "";
    return;
  }
  const [head, ...rest] = cur.split(" · ");
  const t = head && EN[head.trim()];
  if (!t) return;
  titleVi = cur;
  document.title = [t, ...rest].join(" · ");
}

let observer: MutationObserver | null = null;

function applyLang(lang: string) {
  const en = lang === "en";
  document.documentElement.lang = en ? "en" : "vi";
  observer?.disconnect();
  observer = null;
  walk(document.body, en);
  translateTitle(en);
  if (!en) return;
  observer = new MutationObserver((list) => {
    for (const m of list) {
      if (m.type === "characterData") walk(m.target, true);
      else if (m.type === "attributes") translateAttrs(m.target as Element, true);
      else m.addedNodes.forEach((n) => walk(n, true));
    }
    if (/[À-ỹđĐ]/.test(document.title)) translateTitle(true);
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: [...ATTRS],
  });
  const title = document.querySelector("title");
  if (title) observer.observe(title, { childList: true, characterData: true, subtree: true });
}

/* ---------------- Nút ---------------- */

export function Prefs() {
  const [dark, setDark] = useState<boolean | null>(null);
  const [lang, setLang] = useState<string | null>(null);

  useEffect(() => {
    const t = read(THEME_KEY);
    setDark(t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    const l = read(LANG_KEY) === "en" ? "en" : "vi";
    setLang(l);
    if (l !== "en") return;
    // Chờ React gắn xong toàn bộ trang (kể cả phần tải sau) rồi mới dịch, tránh lệch nội dung khi hydrate.
    let cancelled = false;
    const run = () =>
      setTimeout(() => {
        if (cancelled) return;
        applyLang("en");
        document.documentElement.classList.remove("tr-wait");
      }, 120);
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
    };
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    write(THEME_KEY, next ? "dark" : "light");
  };

  const toggleLang = () => {
    const next = lang === "en" ? "vi" : "en";
    setLang(next);
    write(LANG_KEY, next);
    applyLang(next);
  };

  return (
    <div className="prefs">
      <button
        type="button"
        className="pref-btn"
        onClick={toggleLang}
        title="Đổi ngôn ngữ"
        aria-label="Đổi ngôn ngữ"
      >
        {lang === "en" ? "VI" : "EN"}
      </button>
      <button type="button" className="pref-btn" onClick={toggleTheme} title="Đổi nền sáng / tối" aria-label="Đổi nền sáng / tối">
        <Icon name={dark ? "sun" : "moon"} size={18} />
      </button>
    </div>
  );
}
