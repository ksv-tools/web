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
 * Mỗi lượt tải thêm một dòng ở trang "Lượt tải". Mỗi đề xuất tài liệu của người đọc thêm một dòng ở trang "Đề xuất"
 * và gửi một email báo về chính tài khoản Google đang chạy script (không ghi địa chỉ email vào mã). Cột "Xác minh" = Có khi Google xác nhận
 * mã đăng nhập là thật và đúng của web này; = Không khi mã hết hạn hoặc bị làm giả.
 */

const CLIENT_ID = '872161885117-g8k2g3vleuqs2n3e84n4402m01co0gor.apps.googleusercontent.com';
const SHEET_NAME = 'Lượt tải';
const SUGGEST_SHEET = 'Đề xuất';

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out_('loi');
  }
  const who = verify_(body);

  // Người đọc đề xuất đăng tài liệu: ghi vào trang "Đề xuất" và gửi email báo cho chủ Sheet.
  if (body.type === 'de-xuat') {
    // Tệp đính kèm (chỉ nhận từ người đăng nhập Google đã xác minh, tối đa 10 MB): gửi kèm email, không lưu lên Drive.
    let blob = null;
    if (who.verified && body.file && body.file.data) {
      try {
        const bytes = Utilities.base64Decode(String(body.file.data));
        if (bytes.length <= 10 * 1024 * 1024) {
          blob = Utilities.newBlob(bytes, String(body.file.type || 'application/octet-stream'), clean_(body.file.name, 150));
        }
      } catch (err) {
        blob = null;
      }
    }
    const row = [
      new Date(),
      clean_(who.name),
      clean_(who.email),
      who.verified ? 'Có' : 'Không',
      clean_(body.docName, 500),
      clean_(body.number),
      clean_(body.field),
      clean_(body.link, 500),
      clean_(body.message, 2000),
      blob ? blob.getName() + ' (gửi kèm email)' : '',
    ];
    sheetOf_(SUGGEST_SHEET, ['Thời gian', 'Họ tên', 'Email', 'Xác minh', 'Tài liệu', 'Số hiệu', 'Lĩnh vực', 'Link', 'Ghi chú', 'Tệp đính kèm']).appendRow(row);
    try {
      MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        'KSV Tools: đề xuất đăng tài liệu – ' + String(body.docName || '').slice(0, 80),
        [
          'Người đề xuất: ' + who.name + ' <' + who.email + '>' + (who.verified ? '' : ' (chưa xác minh)'),
          'Tài liệu: ' + (body.docName || ''),
          'Số hiệu: ' + (body.number || ''),
          'Lĩnh vực: ' + (body.field || ''),
          'Link: ' + (body.link || ''),
          'Tệp đính kèm: ' + (blob ? blob.getName() : 'không có'),
          '',
          'Ghi chú:',
          String(body.message || ''),
          '',
          'Xem tất cả đề xuất ở trang "' + SUGGEST_SHEET + '" trong Google Sheet.',
        ].join('\n'),
        blob ? { attachments: [blob] } : {}
      );
    } catch (err) {
      // hết hạn mức gửi thư trong ngày: vẫn có dòng trong Sheet
    }
    return out_('ok');
  }

  sheetOf_(SHEET_NAME, ['Thời gian', 'Họ tên', 'Email', 'Công cụ', 'Phiên bản', 'Xác minh']).appendRow([
    new Date(),
    clean_(who.name),
    clean_(who.email),
    clean_(body.tool),
    clean_(body.version),
    who.verified ? 'Có' : 'Không',
  ]);
  return out_('ok');
}

/** Hỏi Google xem mã đăng nhập có thật và đúng của web này không. */
function verify_(body) {
  const who = { verified: false, name: String(body.name || ''), email: String(body.email || '') };
  try {
    const res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(body.credential || '')),
      { muteHttpExceptions: true }
    );
    if (res.getResponseCode() === 200) {
      const info = JSON.parse(res.getContentText());
      if (info.aud === CLIENT_ID && String(info.email_verified) === 'true') {
        who.verified = true;
        who.name = info.name || who.name;
        who.email = info.email || who.email;
      }
    }
  } catch (err) {
    // không gọi được Google: vẫn ghi, đánh dấu chưa xác minh
  }
  return who;
}

/** Mở trang Web app bằng trình duyệt để kiểm tra đã triển khai đúng chưa. */
function doGet() {
  return out_('KSV Tools: ghi lượt tải đang chạy.');
}

function sheetOf_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  }
  return sh;
}

/** Cắt ngắn và chặn công thức (ô bắt đầu bằng = + - @) để không ai chèn được công thức vào Sheet. */
function clean_(v, max) {
  const s = String(v == null ? '' : v).slice(0, max || 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out_(text) {
  return ContentService.createTextOutput(text);
}
