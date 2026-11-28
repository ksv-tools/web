"""Tạo chỉ mục tìm toàn văn cho mục Văn bản: public/tim-kiem/noi-dung.json = {id: "nội dung chữ"}.

Chạy lại mỗi khi thêm, sửa văn bản:  python scripts/build-search-index.py
- Lấy chữ từ public/van-ban-goc/<id>.pdf (cần PyMuPDF: pip install pymupdf) hoặc <id>.html.
- Văn bản scan không có lớp chữ: dùng bản chữ trong data/noi-dung-bo-sung/<id>.txt nếu có
  (chỉ để tìm kiếm; trên web vẫn hiển thị bản gốc).
"""
import html
import json
import os
import re

import fitz  # PyMuPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "van-ban-goc")
EXTRA = os.path.join(ROOT, "data", "noi-dung-bo-sung")
OUT = os.path.join(ROOT, "public", "tim-kiem", "noi-dung.json")
# Văn bản nội bộ không đưa nội dung vào chỉ mục công khai.
INTERNAL = set(json.load(open(os.path.join(ROOT, "data", "van-ban-noi-bo.json"), encoding="utf-8")))
MAX_CHARS = 250_000  # mỗi văn bản, đủ cho cả quy chế dài


def clean(t: str) -> str:
    t = re.sub(r'^\s*id="tab_noi_dung_vb">\s*', "", t)
    return " ".join(t.split())[:MAX_CHARS]


def pdf_text(path: str) -> str:
    with fitz.open(path) as d:
        return " ".join(p.get_text() for p in d)


def html_text(path: str) -> str:
    s = open(path, encoding="utf-8").read()
    s = s[s.find("<main>") :] if "<main>" in s else s
    s = re.sub(r'<div class="src">[\s\S]*?</div>', " ", s)
    return html.unescape(re.sub(r"<[^>]+>", " ", s))


index = {}
for name in sorted(os.listdir(SRC)):
    doc_id, ext = os.path.splitext(name)
    if doc_id in INTERNAL:
        continue
    path = os.path.join(SRC, name)
    text = pdf_text(path) if ext == ".pdf" else html_text(path) if ext == ".html" else ""
    text = clean(text)
    extra = os.path.join(EXTRA, doc_id + ".txt")
    if os.path.exists(extra):
        alt = clean(open(extra, encoding="utf-8").read())
        if len(alt) > len(text):
            text = alt
    if len(text) >= 300:
        index[doc_id] = text

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, separators=(",", ":"))
print(f"{len(index)} văn bản, {os.path.getsize(OUT) // 1024} KB -> {os.path.relpath(OUT, ROOT)}")
