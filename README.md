# KSV Tools

Không gian tiện ích số dành cho Kiểm sát viên. Đăng nhập bằng Google; tài khoản mới phải
được quản trị duyệt; mỗi lượt tải app được ghi lại và giới hạn theo ngày.

Next.js 16 (App Router) + Supabase (đăng nhập, cơ sở dữ liệu) + Vercel (đưa lên mạng).

## Chạy thử trên máy

```
npm install
npm run dev
```

Mở http://localhost:3100. Chưa có `.env.local` thì web chạy **chế độ thử**: nút đăng nhập tạo tài khoản giả, dữ liệu
lưu ở `.data/demo.json` (xóa file này để làm lại từ đầu). Có nút *Đăng nhập thử với quyền quản trị* để thử duyệt người dùng.
Chế độ thử không bao giờ bật khi đưa lên mạng.

## Cấu trúc

- `lib/tools.ts`: danh mục công cụ và lĩnh vực. **Thêm công cụ mới bắt đầu từ đây.**
- `lib/release.ts`: kho GitHub chứa bản cài của từng app chạy trên máy.
- `app/cong-cu/<slug>/page.tsx`: trang từng công cụ.
- `app/tai-ve/[slug]/route.ts`: tải app (kiểm tra duyệt, hạn mức, ghi lượt tải).
- `app/quan-tri/`: duyệt, khóa người dùng, đặt hạn mức, xem lượt tải.
- `app/globals.css`: toàn bộ giao diện (màu ở đầu file, có giao diện tối theo máy).
- `supabase/schema.sql`: bảng dữ liệu, chạy một lần trên Supabase.

## Đưa lên mạng

### 1. Supabase

1. Tạo project ở https://supabase.com (chọn vùng Singapore cho gần).
2. **SQL Editor** → dán `supabase/schema.sql` → **Run**.
3. **Project Settings → API**: chép *Project URL*, *anon/publishable key*, *service_role/secret key*.

### 2. Vercel

1. Đưa mã lên một kho GitHub **riêng tư**, rồi **Import** kho đó ở https://vercel.com.
2. **Environment Variables**: điền theo `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS` là email của bạn, `SITE_URL` là địa chỉ web).
3. Deploy. Gắn tên miền riêng ở **Settings → Domains** nếu có.

### 3. Bật đăng nhập Google

1. Supabase → **Authentication → URL Configuration**: *Site URL* = địa chỉ web; thêm `<địa chỉ web>/auth/callback`
   vào *Redirect URLs*.
2. https://console.cloud.google.com → tạo project → **APIs & Services → OAuth consent screen** (loại External, điền
   tên app KSV Tools, email hỗ trợ, link `<địa chỉ web>/chinh-sach`) → **Credentials → Create OAuth client ID**
   (Web application). Ở *Authorized redirect URIs* dán Callback URL lấy từ Supabase (**Sign In / Providers → Google**,
   dạng `https://<project>.supabase.co/auth/v1/callback`).
3. Chép Client ID và Client Secret vào Supabase → **Sign In / Providers → Google** → bật → Save.

Muốn thêm Facebook hoặc X sau này: thêm vào `PROVIDERS` trong `lib/config.ts` và bật mạng đó trong Supabase.

## Giới hạn hiện tại

- Lượt tải được ghi và giới hạn trên web, nhưng file cài vẫn nằm ở kho GitHub **công khai**
  (`ksv-tools/tach-ho-so-ban-cai`, vì chức năng tự cập nhật trong app đọc từ đó). Ai có đường link trực tiếp vẫn tải
  được mà không qua web. Muốn chặn hẳn thì phải chuyển file sang kho lưu trữ riêng tư và đổi cách cập nhật của app.
- Duyệt người dùng áp dụng chung cho mọi công cụ; chưa có phân quyền theo từng công cụ.
