import Link from "next/link";
import { areaName, type Tool } from "@/lib/tools";
import { Icon } from "./Icon";

export function ToolCard({ tool }: { tool: Tool }) {
  const body = (
    <>
      <span className="tool-icon">
        <Icon name={tool.icon} />
      </span>
      <h3 className="tool-name">{tool.name}</h3>
      <p className="tool-short">{tool.short}</p>
      <div className="tool-meta">
        {tool.status === "ready" ? (
          <span className="tag tag-ready">{tool.kind === "desktop" ? "Tải về máy" : "Dùng ngay"}</span>
        ) : (
          <span className="tag tag-soon">Sắp có</span>
        )}
        {tool.areas.slice(0, 2).map((a) => (
          <span key={a} className="tag">
            {areaName(a)}
          </span>
        ))}
      </div>
    </>
  );
  if (tool.status !== "ready") return <div className="tool-card is-soon">{body}</div>;
  return (
    <Link href={`/cong-cu/${tool.slug}`} className="tool-card">
      {body}
    </Link>
  );
}
