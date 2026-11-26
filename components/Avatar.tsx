/* eslint-disable @next/next/no-img-element */

export function Avatar({ name, src }: { name: string; src?: string | null }) {
  const initials =
    name
      .split(/\s+/)
      .filter((w) => /^\p{L}/u.test(w))
      .slice(-2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?";
  return (
    <span className="avatar" aria-hidden="true">
      {src ? <img src={src} alt="" referrerPolicy="no-referrer" /> : initials}
    </span>
  );
}
