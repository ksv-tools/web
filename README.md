# KSV Tools

Không gian tiện ích số dành cho Kiểm sát viên. Trang tĩnh trên GitHub Pages; muốn tải công cụ thì đăng nhập bằng
Google; mỗi lượt tải được ghi vào một Google Sheet của người quản trị.

Next.js 16 (xuất trang tĩnh) + Google Identity Services (đăng nhập) + Apps Script (ghi lượt tải).
Không có máy chủ, không có cơ sở dữ liệu.

## Chạy thử trên máy

```
npm install
npm run dev
```

Mở http://localhost:3100. Chưa có Client ID thì nút đăng nhập là nút **thử**, tạo tài khoản giả ngay trên trình duyệt.
Muốn thử đăng nhập Google thật trên máy: tạo file `.env.local` theo `.env.example`.

## Cấu trúc

- `lib/tools.ts`: danh mục công cụ và lĩnh vực. **Thêm công cụ mới bắt đầu từ đây.**
- `lib/release.ts`: kho GitHub chứa bản cài của từng app chạy trên máy. Nút tải luôn trỏ bản mới nhất.
- `app/cong-cu/<slug>/page.tsx`: trang từng công cụ.
- `components/Auth.tsx`: đăng nhập Google, ghi lượt tải.
- `app/globals.css`: toàn bộ giao diện (màu ở đầu file, có giao diện tối theo máy).
- `google/ghi-luot-tai.gs`: mã Apps Script ghi lượt tải vào Google Sheet.
- `.github/workflows/pages.yml`: mỗi lần đẩy lên nhánh `main` thì tự dựng web và đưa lên GitHub Pages.

## Đưa lên mạng (làm một lần)

### 1. Bật GitHub Pages

1. Kho `ksv-tools/web` → **Settings → General → Danger Zone → Change visibility → Public**
   (GitHub Pages miễn phí chỉ chạy với kho công khai; trong kho chỉ có mã giao diện, không có khóa bí mật).
2. **Settings → Pages → Source: GitHub Actions**.
3. Web sẽ ở `https://ksv-tools.github.io/web/`.

### 2. Tạo Client ID Google

1. https://console.cloud.google.com → tạo project (ví dụ `ksv-tools`).
2. **APIs & Services → OAuth consent screen**: loại *External*, tên app *KSV Tools*, email hỗ trợ, link chính sách
   `https://ksv-tools.github.io/web/chinh-sach/`. Chỉ cần các quyền mặc định (email, profile). Bấm **Publish app**
   để ai có tài khoản Google cũng đăng nhập được.
3. **Credentials → Create credentials → OAuth client ID** → *Web application*.
   *Authorized JavaScript origins*: `https://ksv-tools.github.io` và `http://localhost:3100`. Không cần redirect URI.
4. Chép **Client ID** (dạng `...apps.googleusercontent.com`). Không cần Client Secret.

### 3. Google Sheet ghi lượt tải

Làm theo hướng dẫn ở đầu file `google/ghi-luot-tai.gs` (dán Client ID vào đó), lấy **URL ứng dụng web**.

### 4. Khai báo cho web

Kho `ksv-tools/web` → **Settings → Secrets and variables → Actions → Variables → New repository variable**:

| Tên | Giá trị |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Client ID ở bước 2 |
| `LOG_URL` | URL ứng dụng web ở bước 3 |

Sau đó **Actions → Đưa web lên GitHub Pages → Run workflow** (hoặc đẩy một commit bất kỳ).

### Tên miền riêng (sau này)

**Settings → Pages → Custom domain**, thêm biến `BASE_PATH` = `/`, thêm tên miền vào *Authorized JavaScript origins*
của Client ID, rồi chạy lại workflow.

## Giới hạn

- Không duyệt từng người, không giới hạn lượt tải: ai có tài khoản Google cũng tải được.
- Việc kiểm tra đăng nhập diễn ra trong trình duyệt. File cài nằm ở kho công khai `ksv-tools/tach-ho-so-ban-cai`
  (chức năng tự cập nhật của app đọc từ đó), nên ai có đường link trực tiếp vẫn tải được. Cột *Xác minh* trong Sheet
  cho biết lượt tải nào có đăng nhập Google thật.
- Bản có duyệt người dùng và giới hạn lượt tải (Next.js + Supabase) vẫn còn trong lịch sử Git, commit `e5b91bf`.
