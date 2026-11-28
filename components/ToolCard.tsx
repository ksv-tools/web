import Link from "next/link";
import { withBase } from "@/lib/config";
import { areaName, toolImage, type Tool } from "@/lib/tools";
import { Icon } from "./Icon";

export function ToolCard({ tool }: { tool: Tool }) {
  const ready = tool.status === "ready";
  const body = (
    <>
      <div className="tool-thumb">
        <img src={withBase(toolImage(tool))} alt="" loading="lazy" width={800} height={500} />
        <span className={`tool-badge ${ready ? "is-ready" : ""}`}>
          {ready ? (tool.kind === "desktop" ? "Tải về máy" : "Dùng ngay") : "Sắp có"}
        </span>
      </div>
      <div className="tool-body">
        <h3 className="tool-name">{tool.name}</h3>
        <p className="tool-short">{tool.short}</p>
        <div className="tool-foot">
          <span className="tool-areas">{tool.areas.slice(0, 2).map(areaName).join(" · ")}</span>
          {ready && <Icon name="arrow" size={18} />}
        </div>
      </div>
    </>
  );
  if (!ready) return <div className="tool-card is-soon">{body}</div>;
  return (
    <Link href={`/cong-cu/${tool.slug}`} className="tool-card">
      {body}
    </Link>
  );
}
