/**
 * @OnlyCurrentDoc
 * (Dòng trên giới hạn quyền: script chỉ đọc/ghi được đúng bảng tính chứa nó, không đụng tới bảng tính khác hay Google Drive.)
 *
 * KSV Tools – máy chủ nhỏ chạy bằng Apps Script trong Google Sheet:
 *  - Tài khoản: đăng ký (email + mật khẩu hoặc Google), người quản trị duyệt trong trang "Tài khoản", đăng nhập, quên mật khẩu.
 *  - Ghi lượt tải công cụ (trang "Lượt tải"), nhận đề xuất tài liệu (trang "Đề xuất").
 *  - Lưu và phát văn bản nội bộ (trang "Văn bản nội bộ") — chỉ cho tài khoản đã duyệt.
 *
 * Cách cài / cập nhật:
 *  1. Mở Google Sheet → Tiện ích mở rộng → Apps Script. Xóa mã cũ, dán toàn bộ file này, bấm Lưu.
 *  2. Triển khai → Quản lý các bản triển khai → (bút chì) Sửa → Phiên bản: Phiên bản mới → Triển khai.
 *     (Giữ nguyên URL cũ. Lần đầu: Triển khai mới, loại Ứng dụng web, Thực thi dưới dạng: Tôi, Ai có quyền: Bất kỳ ai.)
 *  3. Cấp quyền khi được hỏi (gửi email, kết nối dịch vụ bên ngoài để hỏi Google xác minh đăng nhập).
 *  4. Mở lại Sheet: có thêm menu "KSV Tools".
 *
 * Duyệt tài khoản: ở trang "Tài khoản", sửa cột "Trạng thái" thành  Đã duyệt / Từ chối / Khóa,
 * rồi bấm menu KSV Tools → "Gửi email báo kết quả duyệt". Tài khoản của chính chủ Sheet được duyệt sẵn.
 *
 * Không ghi địa chỉ email của người quản trị vào mã: script dùng tài khoản Google đang chạy nó.
 */

const CLIENT_ID = '872161885117-g8k2g3vleuqs2n3e84n4402m01co0gor.apps.googleusercontent.com';
const SHEET_NAME = 'Lượt tải';
const SUGGEST_SHEET = 'Đề xuất';
const ACCOUNT_SHEET = 'Tài khoản';
const DOC_SHEET = 'Văn bản nội bộ';
const SITE_NAME = 'KSV Tools';
const SESSION_DAYS = 30; // tài khoản chờ duyệt; tài khoản đã duyệt đăng nhập không hết hạn (khóa trong Sheet là mất quyền ngay)

const ST_PENDING = 'Chờ duyệt';
const ST_OK = 'Đã duyệt';
const ST_NO = 'Từ chối';
const ST_LOCK = 'Khóa';

// Cột của trang "Tài khoản" (đếm từ 1).
const ACC_HEAD = ['Email', 'Họ tên', 'Đơn vị', 'Chức vụ', 'Điện thoại', 'Cách đăng nhập', 'Trạng thái', 'Ngày đăng ký',
  'Ngày duyệt', 'Ghi chú', 'Đã báo kết quả', 'Muối', 'Mã băm', 'Mã khôi phục', 'Hạn mã'];
const C = { email: 1, name: 2, unit: 3, role: 4, phone: 5, via: 6, status: 7, created: 8, approved: 9, note: 10,
  notified: 11, salt: 12, hash: 13, code: 14, codeExp: 15 };

/* ======================= Điểm vào ======================= */

function doPost(e) {
  let body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Dữ liệu gửi lên không hợp lệ.' });
  }
  try {
    switch (body.action) {
      case 'register': return json_(register_(body));
      case 'login': return json_(login_(body));
      case 'google': return json_(google_(body));
      case 'me': return json_(me_(body));
      case 'reset-request': return json_(resetRequest_(body));
      case 'reset-confirm': return json_(resetConfirm_(body));
      case 'doc': return json_(getDoc_(body));
      case 'doc-upload': return json_(uploadDoc_(body));
      case 'doc-list': return json_(listDocs_(body));
      default: break;
    }
    if (body.type === 'de-xuat') return json_(suggest_(body));
    return json_(logDownload_(body));
  } catch (err) {
    return json_({ ok: false, error: 'Máy chủ gặp lỗi, thử lại sau.' });
  }
}

/** Mở URL Web app bằng trình duyệt để kiểm tra đã triển khai đúng chưa. */
function doGet() {
  return ContentService.createTextOutput(SITE_NAME + ': máy chủ đang chạy.');
}

/** Menu trong Google Sheet. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(SITE_NAME)
    .addItem('Gửi email báo kết quả duyệt', 'notifyDecisions')
    .addItem('Tạo trang Tài khoản (nếu chưa có)', 'setupSheets')
    .addToUi();
}

function setupSheets() {
  accounts_();
  docsSheet_();
}

/* ======================= Tài khoản ======================= */

function register_(b) {
  const email = normEmail_(b.email);
  if (!validEmail_(email)) return { ok: false, error: 'Email không hợp lệ.' };
  if (String(b.password || '').length < 8) return { ok: false, error: 'Mật khẩu cần ít nhất 8 ký tự.' };
  if (!String(b.name || '').trim()) return { ok: false, error: 'Vui lòng nhập họ tên.' };
  if (!throttle_('reg:' + email, 5)) return { ok: false, error: 'Thao tác quá nhiều lần, thử lại sau ít phút.' };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const found = findAccount_(email);
    if (found && found.hash) return { ok: false, error: 'Email này đã đăng ký. Hãy đăng nhập hoặc dùng "Quên mật khẩu".' };
    const salt = Utilities.getUuid();
    const hash = hash_(String(b.password), salt);
    const owner = isOwner_(email);
    const values = {
      email: email, name: clean_(b.name, 100), unit: clean_(b.unit, 150), role: clean_(b.role, 100), phone: clean_(b.phone, 30),
      via: found ? found.via + ', mật khẩu' : 'Mật khẩu', status: found ? found.status : (owner ? ST_OK : ST_PENDING),
      created: found ? found.created : new Date(), approved: owner ? new Date() : '', salt: salt, hash: hash,
    };
    saveAccount_(found, values);
    if (!found && !owner) notifyOwnerNew_(values);
    return { ok: true, status: values.status };
  } finally {
    lock.releaseLock();
  }
}

function login_(b) {
  const email = normEmail_(b.email);
  if (!throttle_('login:' + email, 10)) return { ok: false, error: 'Đăng nhập sai quá nhiều lần, thử lại sau ít phút.' };
  const acc = findAccount_(email);
  if (!acc || !acc.hash || hash_(String(b.password || ''), acc.salt) !== acc.hash) {
    return { ok: false, error: 'Email hoặc mật khẩu không đúng.' };
  }
  return session_(acc);
}

/** Đăng nhập Google: lần đầu thì tạo tài khoản chờ duyệt (kèm thông tin đơn vị nếu người dùng điền). */
function google_(b) {
  const who = verifyGoogle_(b.credential);
  if (!who.verified) return { ok: false, error: 'Không xác minh được tài khoản Google. Thử đăng nhập lại.' };
  const email = normEmail_(who.email);
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    let acc = findAccount_(email);
    const owner = isOwner_(email);
    if (!acc) {
      const values = {
        email: email, name: clean_(b.name || who.name, 100), unit: clean_(b.unit, 150), role: clean_(b.role, 100),
        phone: clean_(b.phone, 30), via: 'Google', status: owner ? ST_OK : ST_PENDING, created: new Date(),
        approved: owner ? new Date() : '',
      };
      saveAccount_(null, values);
      if (!owner) notifyOwnerNew_(values);
      acc = findAccount_(email);
    } else {
      // Bổ sung thông tin đơn vị nếu trước đó còn trống.
      const patch = {};
      ['unit', 'role', 'phone'].forEach(function (k) {
        if (b[k] && !acc[k]) patch[k] = clean_(b[k], 150);
      });
      if (acc.via.indexOf('Google') < 0) patch.via = acc.via + ', Google';
      if (Object.keys(patch).length) {
        saveAccount_(acc, patch);
        acc = findAccount_(email);
      }
    }
    return session_(acc);
  } finally {
    lock.releaseLock();
  }
}

function me_(b) {
  const acc = accountFromToken_(b.token);
  if (!acc) return { ok: false, error: 'Phiên đăng nhập đã hết hạn.', expired: true };
  // Cấp vé mới: tài khoản vừa được duyệt sẽ nhận vé không hết hạn.
  return session_(acc);
}

function resetRequest_(b) {
  const email = normEmail_(b.email);
  if (!throttle_('reset:' + email, 3)) return { ok: false, error: 'Đã gửi mã nhiều lần, thử lại sau ít phút.' };
  const acc = findAccount_(email);
  // Trả lời như nhau dù email có hay không, để không ai dò được email nào đã đăng ký.
  if (acc && acc.hash) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    saveAccount_(acc, { code: hash_(code, acc.salt), codeExp: new Date(Date.now() + 15 * 60 * 1000) });
    mail_(email, SITE_NAME + ': mã đặt lại mật khẩu',
      'Mã đặt lại mật khẩu của bạn là: ' + code + '\n\nMã có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.');
  }
  return { ok: true };
}

function resetConfirm_(b) {
  const email = normEmail_(b.email);
  if (!throttle_('reset-confirm:' + email, 8)) return { ok: false, error: 'Nhập sai quá nhiều lần, thử lại sau ít phút.' };
  if (String(b.password || '').length < 8) return { ok: false, error: 'Mật khẩu cần ít nhất 8 ký tự.' };
  const acc = findAccount_(email);
  const exp = acc && acc.codeExp ? new Date(acc.codeExp).getTime() : 0;
  if (!acc || !acc.code || exp < Date.now() || hash_(String(b.code || ''), acc.salt) !== acc.code) {
    return { ok: false, error: 'Mã không đúng hoặc đã hết hạn.' };
  }
  const salt = Utilities.getUuid();
  saveAccount_(acc, { salt: salt, hash: hash_(String(b.password), salt), code: '', codeExp: '' });
  return { ok: true };
}

/** Menu: gửi email cho người đã được duyệt / từ chối mà chưa được báo. */
function notifyDecisions() {
  const sh = accounts_();
  const rows = sh.getDataRange().getValues();
  let sent = 0;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const status = String(r[C.status - 1]);
    if ((status !== ST_OK && status !== ST_NO) || r[C.notified - 1]) continue;
    const email = String(r[C.email - 1]);
    const ok = status === ST_OK;
    mail_(email, SITE_NAME + (ok ? ': tài khoản đã được duyệt' : ': yêu cầu đăng ký chưa được chấp nhận'),
      ok
        ? 'Tài khoản ' + email + ' đã được duyệt. Bạn có thể đăng nhập ' + SITE_NAME + ' để tải công cụ và xem văn bản nội bộ.'
        : 'Yêu cầu đăng ký tài khoản ' + email + ' chưa được chấp nhận. Liên hệ người quản trị nếu cần.');
    sh.getRange(i + 1, C.notified).setValue(new Date());
    if (ok && !r[C.approved - 1]) sh.getRange(i + 1, C.approved).setValue(new Date());
    sent++;
  }
  SpreadsheetApp.getActive().toast('Đã gửi ' + sent + ' email.', SITE_NAME);
}

/* ======================= Văn bản nội bộ ======================= */

const CHUNK = 45000; // mỗi ô Sheet chứa tối đa 50.000 ký tự

function getDoc_(b) {
  const acc = accountFromToken_(b.token);
  if (!acc) return { ok: false, error: 'Cần đăng nhập.', expired: true };
  if (acc.status !== ST_OK) return { ok: false, error: 'Tài khoản chưa được duyệt.' };
  const id = String(b.id || '');
  const rows = docsSheet_().getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      const parts = rows[i].slice(4).filter(String);
      return { ok: true, name: rows[i][1], type: rows[i][2] || 'application/pdf', data: parts.join('') };
    }
  }
  return { ok: false, error: 'Văn bản chưa được tải lên máy chủ.' };
}

/** Chỉ chủ Sheet (người quản trị) được tải văn bản nội bộ lên. */
function uploadDoc_(b) {
  const acc = accountFromToken_(b.token);
  if (!acc || !isOwner_(acc.email)) return { ok: false, error: 'Chỉ người quản trị được tải văn bản nội bộ lên.' };
  const id = String(b.id || '').replace(/[^a-z0-9-]/g, '');
  const data = String(b.data || '');
  if (!id || !data) return { ok: false, error: 'Thiếu mã văn bản hoặc tệp.' };
  if (data.length > 20 * 1024 * 1024) return { ok: false, error: 'Tệp quá lớn (tối đa khoảng 15 MB).' };
  const parts = [];
  for (let i = 0; i < data.length; i += CHUNK) parts.push(data.slice(i, i + CHUNK));
  const sh = docsSheet_();
  const rows = sh.getDataRange().getValues();
  let row = 0;
  for (let i = 1; i < rows.length; i++) if (rows[i][0] === id) row = i + 1;
  const values = [id, clean_(b.name, 200), clean_(b.type || 'application/pdf', 60), new Date()].concat(parts);
  if (row) sh.getRange(row, 1, 1, sh.getMaxColumns()).clearContent();
  else row = sh.getLastRow() + 1;
  if (sh.getMaxColumns() < values.length) sh.insertColumnsAfter(sh.getMaxColumns(), values.length - sh.getMaxColumns());
  sh.getRange(row, 1, 1, values.length).setValues([values]);
  return { ok: true, parts: parts.length };
}

function listDocs_(b) {
  const acc = accountFromToken_(b.token);
  if (!acc || !isOwner_(acc.email)) return { ok: false, error: 'Chỉ người quản trị.' };
  const rows = docsSheet_().getDataRange().getValues();
  const list = [];
  for (let i = 1; i < rows.length; i++) list.push({ id: rows[i][0], name: rows[i][1], at: rows[i][3] });
  return { ok: true, docs: list };
}

/* ======================= Lượt tải, đề xuất ======================= */

function logDownload_(b) {
  const acc = b.token ? accountFromToken_(b.token) : null;
  const who = acc ? { verified: acc.status === ST_OK, name: acc.name, email: acc.email } : verifyGoogle_(b.credential);
  sheetOf_(SHEET_NAME, ['Thời gian', 'Họ tên', 'Email', 'Công cụ', 'Phiên bản', 'Xác minh']).appendRow([
    new Date(), clean_(who.name || b.name), clean_(who.email || b.email), clean_(b.tool), clean_(b.version), who.verified ? 'Có' : 'Không',
  ]);
  return { ok: true };
}

function suggest_(body) {
  const acc = body.token ? accountFromToken_(body.token) : null;
  const who = acc ? { verified: true, name: acc.name, email: acc.email } : verifyGoogle_(body.credential);
  if (!who.name) who.name = String(body.name || '');
  if (!who.email) who.email = String(body.email || '');
  // Tệp đính kèm (chỉ nhận từ người đã xác minh, tối đa 10 MB): gửi kèm email, không lưu lên Drive.
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
  sheetOf_(SUGGEST_SHEET, ['Thời gian', 'Họ tên', 'Email', 'Xác minh', 'Tài liệu', 'Số hiệu', 'Lĩnh vực', 'Link', 'Ghi chú', 'Tệp đính kèm']).appendRow([
    new Date(), clean_(who.name), clean_(who.email), who.verified ? 'Có' : 'Không', clean_(body.docName, 500), clean_(body.number),
    clean_(body.field), clean_(body.link, 500), clean_(body.message, 2000), blob ? blob.getName() + ' (gửi kèm email)' : '',
  ]);
  mail_(ownerEmail_(), SITE_NAME + ': đề xuất đăng tài liệu – ' + String(body.docName || '').slice(0, 80),
    ['Người đề xuất: ' + who.name + ' <' + who.email + '>' + (who.verified ? '' : ' (chưa xác minh)'),
      'Tài liệu: ' + (body.docName || ''), 'Số hiệu: ' + (body.number || ''), 'Lĩnh vực: ' + (body.field || ''),
      'Link: ' + (body.link || ''), 'Tệp đính kèm: ' + (blob ? blob.getName() : 'không có'), '', 'Ghi chú:',
      String(body.message || ''), '', 'Xem tất cả đề xuất ở trang "' + SUGGEST_SHEET + '" trong Google Sheet.'].join('\n'),
    blob ? { attachments: [blob] } : {});
  return { ok: true };
}

/* ======================= Phiên đăng nhập (vé có chữ ký) ======================= */

function session_(acc) {
  const days = acc.status === ST_OK ? 3650 : SESSION_DAYS;
  const exp = Date.now() + days * 24 * 3600 * 1000;
  const payload = Utilities.base64EncodeWebSafe(JSON.stringify({ e: acc.email, x: exp }));
  const token = payload + '.' + sign_(payload);
  return { ok: true, token: token, until: exp, status: acc.status, profile: profile_(acc) };
}

function accountFromToken_(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 2 || sign_(parts[0]) !== parts[1]) return null;
  let p;
  try {
    p = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString());
  } catch (err) {
    return null;
  }
  if (!p || p.x < Date.now()) return null;
  const acc = findAccount_(p.e);
  if (!acc || acc.status === ST_LOCK || acc.status === ST_NO) return null;
  return acc;
}

function sign_(text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(text, secret_())).replace(/=+$/, '');
}

/** Khóa bí mật để ký vé, tạo ngẫu nhiên lần đầu và cất trong Thuộc tính tập lệnh (không nằm trong mã). */
function secret_() {
  const props = PropertiesService.getScriptProperties();
  let s = props.getProperty('SESSION_SECRET');
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('SESSION_SECRET', s);
  }
  return s;
}

/* ======================= Tiện ích ======================= */

function profile_(acc) {
  return { email: acc.email, name: acc.name, unit: acc.unit, role: acc.role, via: acc.via, admin: isOwner_(acc.email) };
}

function accounts_() {
  return sheetOf_(ACCOUNT_SHEET, ACC_HEAD);
}

function docsSheet_() {
  const sh = sheetOf_(DOC_SHEET, ['Mã văn bản', 'Tên tệp', 'Loại', 'Ngày tải lên', 'Nội dung (chia nhiều ô)']);
  return sh;
}

function findAccount_(email) {
  email = normEmail_(email);
  if (!email) return null;
  const sh = accounts_();
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (normEmail_(rows[i][C.email - 1]) === email) {
      const r = rows[i];
      const acc = { row: i + 1 };
      Object.keys(C).forEach(function (k) {
        acc[k] = r[C[k] - 1];
      });
      acc.email = email;
      acc.status = String(acc.status || ST_PENDING);
      acc.via = String(acc.via || '');
      return acc;
    }
  }
  return null;
}

/** Ghi tài khoản: `found` = null thì thêm dòng mới; ngược lại sửa các cột có trong `values`. */
function saveAccount_(found, values) {
  const sh = accounts_();
  if (!found) {
    const row = ACC_HEAD.map(function () {
      return '';
    });
    Object.keys(values).forEach(function (k) {
      if (C[k]) row[C[k] - 1] = values[k];
    });
    sh.appendRow(row);
    return;
  }
  Object.keys(values).forEach(function (k) {
    if (C[k]) sh.getRange(found.row, C[k]).setValue(values[k]);
  });
}

function notifyOwnerNew_(v) {
  mail_(ownerEmail_(), SITE_NAME + ': có người đăng ký mới – ' + v.name,
    ['Họ tên: ' + v.name, 'Email: ' + v.email, 'Đơn vị: ' + (v.unit || ''), 'Chức vụ: ' + (v.role || ''),
      'Điện thoại: ' + (v.phone || ''), 'Cách đăng nhập: ' + v.via, '',
      'Duyệt: mở Google Sheet, trang "' + ACCOUNT_SHEET + '", sửa cột Trạng thái thành "' + ST_OK + '" hoặc "' + ST_NO +
      '", rồi bấm menu ' + SITE_NAME + ' → Gửi email báo kết quả duyệt.'].join('\n'));
}

/** Băm mật khẩu: SHA-256 lặp 1000 lần với muối riêng từng tài khoản. */
function hash_(password, salt) {
  let h = password + '|' + salt;
  let bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h, Utilities.Charset.UTF_8);
  for (let i = 0; i < 1000; i++) {
    bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes.concat(Utilities.newBlob(salt).getBytes()));
  }
  return Utilities.base64Encode(bytes);
}

/** Hỏi Google xem mã đăng nhập Google có thật và đúng của web này không. */
function verifyGoogle_(credential) {
  const who = { verified: false, name: '', email: '' };
  if (!credential) return who;
  try {
    const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(credential)),
      { muteHttpExceptions: true });
    if (res.getResponseCode() === 200) {
      const info = JSON.parse(res.getContentText());
      if (info.aud === CLIENT_ID && String(info.email_verified) === 'true') {
        who.verified = true;
        who.name = info.name || '';
        who.email = info.email || '';
      }
    }
  } catch (err) {
    // không gọi được Google
  }
  return who;
}

/** Giới hạn số lần thử trong 10 phút cho mỗi khóa (chống dò mật khẩu, gửi thư hàng loạt). */
function throttle_(key, max) {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(n), 600);
  return n <= max;
}

function ownerEmail_() {
  return Session.getEffectiveUser().getEmail();
}

function isOwner_(email) {
  return normEmail_(email) === normEmail_(ownerEmail_());
}

function normEmail_(v) {
  return String(v || '').trim().toLowerCase();
}

function validEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 120;
}

function mail_(to, subject, text, opts) {
  try {
    MailApp.sendEmail(to, subject, text, opts || {});
  } catch (err) {
    // hết hạn mức gửi thư trong ngày: bỏ qua, dữ liệu vẫn có trong Sheet
  }
}

function sheetOf_(name, header) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(header);
    sh.setFrozenRows(1);
    if (name !== DOC_SHEET) sh.getRange('A:A').setNumberFormat(name === ACCOUNT_SHEET ? '@' : 'dd/MM/yyyy HH:mm:ss');
  }
  return sh;
}

/** Cắt ngắn và chặn công thức (ô bắt đầu bằng = + - @) để không ai chèn được công thức vào Sheet. */
function clean_(v, max) {
  const s = String(v == null ? '' : v).slice(0, max || 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
