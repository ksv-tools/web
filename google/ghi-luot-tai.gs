/**
 * @OnlyCurrentDoc
 * (Dòng trên giới hạn quyền: script chỉ đọc/ghi được đúng bảng tính chứa nó, không đụng tới bảng tính khác.)
 *
 * KSV Tools – ghi lượt tải công cụ vào Google Sheet.
 *
 * Cách cài (một lần):
 *  1. Tạo một Google Sheet mới, đặt tên tùy ý (ví dụ "KSV Tools – lượt tải").
 *  2. Trong Sheet: Tiện ích mở rộng → Apps Script. Xóa mã có sẵn, dán toàn bộ file này vào.
 *  3. Sửa CLIENT_ID bên dưới cho đúng Client ID Google của web.
 *  4. Bấm Triển khai → Tùy chọn triển khai mới → loại "Ứng dụng web":
 *       - Thực thi dưới dạng: Tôi
 *       - Người có quyền truy cập: Bất kỳ ai
 *     → Triển khai → cấp quyền → chép "URL ứng dụng web" (dạng https://script.google.com/macros/s/.../exec).
 *  5. Dán URL đó vào biến NEXT_PUBLIC_LOG_URL của web (xem README).
 *
 * Mỗi lượt tải thêm một dòng ở trang "Lượt tải". Cột "Xác minh" = Có khi Google xác nhận
 * mã đăng nhập là thật và đúng của web này; = Không khi mã hết hạn hoặc bị làm giả.
 */

const CLIENT_ID = 'DIEN_CLIENT_ID_VAO_DAY.apps.googleusercontent.com';
const SHEET_NAME = 'Lượt tải';

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_('loi');
  }

  // Hỏi Google xem mã đăng nhập có thật không.
  let verified = false;
  let name = String(body.name || '');
  let email = String(body.email || '');
  try {
    const res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(body.credential || '')),
      { muteHttpExceptions: true }
    );
    if (res.getResponseCode() === 200) {
      const info = JSON.parse(res.getContentText());
      if (info.aud === CLIENT_ID && String(info.email_verified) === 'true') {
        verified = true;
        name = info.name || name;
        email = info.email || email;
      }
    }
  } catch (err) {
    // không gọi được Google: vẫn ghi, đánh dấu chưa xác minh
  }

  const sheet = sheet_();
  sheet.appendRow([
    new Date(),
    clean_(name),
    clean_(email),
    clean_(body.tool),
    clean_(body.version),
    verified ? 'Có' : 'Không',
  ]);
  return out_('ok');
}

/** Mở trang Web app bằng trình duyệt để kiểm tra đã triển khai đúng chưa. */
function doGet() {
  return out_('KSV Tools: ghi lượt tải đang chạy.');
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Thời gian', 'Họ tên', 'Email', 'Công cụ', 'Phiên bản', 'Xác minh']);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  }
  return sh;
}

/** Cắt ngắn và chặn công thức (ô bắt đầu bằng = + - @) để không ai chèn được công thức vào Sheet. */
function clean_(v) {
  const s = String(v == null ? '' : v).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out_(text) {
  return ContentService.createTextOutput(text);
}
