/**
 * "Nội dung chính" của từng văn bản: các vấn đề văn bản quy định, hướng dẫn hoặc giải đáp (chỉ nêu vấn đề,
 * không nêu kết luận — đọc toàn văn để biết cách giải quyết). Hiện ở ô bên phải danh sách và dùng khi tìm kiếm.
 * Thêm văn bản mới: thêm một mục theo id; mỗi ý ngắn gọn, viết như tiêu đề.
 */
export const POINTS: Record<string, string[]> = {
  // ---------------- Luật, bộ luật ----------------
  "blhs-hop-nhat": [
    "Toàn bộ Bộ luật Hình sự đã cập nhật sửa đổi 2017, 2025",
    "Phần chung: tội phạm, hình phạt, án treo, tha tù trước thời hạn, xóa án tích",
    "Phần các tội phạm: từ Điều 108 đến Điều 425",
    "Sửa đổi 2025: bỏ hình phạt tử hình ở một số tội, tội mới về ma túy (Điều 256a)",
  ],
  "bltths-hop-nhat": [
    "Toàn bộ Bộ luật Tố tụng hình sự đã cập nhật sửa đổi 2021, 2024, 2025",
    "Tiếp nhận, giải quyết nguồn tin về tội phạm; khởi tố, điều tra, truy tố, xét xử",
    "Biện pháp ngăn chặn, cưỡng chế; chứng cứ, hồ sơ vụ án điện tử",
    "Thủ tục đặc biệt: rút gọn, người dưới 18 tuổi, pháp nhân",
  ],
  "luat-cqdths-hop-nhat": [
    "Hệ thống cơ quan điều tra, cơ quan được giao nhiệm vụ điều tra",
    "Nhiệm vụ, quyền hạn của Cơ quan điều tra VKSND tối cao, Cơ quan điều tra quân sự",
    "Điều tra viên, cán bộ điều tra: tiêu chuẩn, bổ nhiệm",
    "Sửa đổi 2025 theo việc không tổ chức Công an cấp huyện",
  ],
  "luat-vksnd-hop-nhat": [
    "Chức năng thực hành quyền công tố, kiểm sát hoạt động tư pháp",
    "Tổ chức VKSND các cấp sau sửa đổi 2025 (VKSND khu vực)",
    "Kiểm sát viên, Kiểm tra viên: tiêu chuẩn, nhiệm vụ, quyền hạn",
  ],
  "luat-tp-nctn-hop-nhat": [
    "Xử lý chuyển hướng người dưới 18 tuổi phạm tội",
    "Thủ tục tố tụng thân thiện; tạm giữ, tạm giam, thời hạn với người chưa thành niên",
    "Biện pháp giáo dục tại trường giáo dưỡng; thi hành án, tái hòa nhập",
  ],
  "luat-pcmt-hop-nhat": [
    "Quản lý người sử dụng trái phép chất ma túy",
    "Cai nghiện tự nguyện, bắt buộc; người nghiện từ đủ 12 đến dưới 18 tuổi",
    "Trách nhiệm phòng, chống ma túy của cơ quan, tổ chức",
  ],
  "luat-vu-khi-hop-nhat": [
    "Khái niệm vũ khí, vũ khí quân dụng, vũ khí thô sơ, vật liệu nổ, công cụ hỗ trợ",
    "Dao có tính sát thương cao: khái niệm, quản lý",
    "Các hành vi bị nghiêm cấm; trang bị, sử dụng, thu hồi vũ khí",
  ],
  "luat-thahs-2025": [
    "Thi hành án phạt tù, tử hình, án treo, cải tạo không giam giữ, cấm cư trú, quản chế",
    "Tha tù trước thời hạn có điều kiện; giảm thời hạn chấp hành án",
    "Thi hành án đối với pháp nhân thương mại; biện pháp tư pháp",
    "Kiểm sát thi hành án hình sự; khiếu nại, tố cáo",
  ],
  "luat-thtg-tg-2025": [
    "Thi hành tạm giữ, tạm giam và cấm đi khỏi nơi cư trú",
    "Chế độ quản lý giam giữ; quyền, nghĩa vụ người bị tạm giữ, tạm giam",
    "Thăm gặp, tiếp xúc lãnh sự; trích xuất; người bị kết án tử hình",
    "Kiểm sát việc tạm giữ, tạm giam; khiếu nại, tố cáo",
  ],
  "nq-41-2017-qh14": [
    "Hiệu lực thi hành Bộ luật Hình sự 2015 (sửa đổi 2017)",
    "Áp dụng các quy định có lợi cho người phạm tội",
    "Các trường hợp không xử lý, đình chỉ, miễn chấp hành hình phạt khi BLHS mới có hiệu lực",
    "Hiệu lực BLTTHS, Luật Tổ chức CQĐTHS, Luật Thi hành tạm giữ, tạm giam",
  ],

  // ---------------- Thông tư, TTLT, nghị định ----------------
  "ttlt-14-2026-dat-dai": [
    "Cơ chế không truy cứu, tạm hoãn truy cứu TNHS trong vụ án vi phạm pháp luật đất đai",
    "Điều kiện áp dụng theo Nghị quyết 29/2026/QH16",
    "Trình tự giải quyết nguồn tin, khởi tố, điều tra, truy tố",
    "Thẩm quyền ban hành quyết định tố tụng; chuyển tiếp",
  ],
  "ttlt-13-2026-thong-ke-giam-dinh": [
    "Chỉ tiêu, biểu mẫu thống kê giám định tư pháp trong tố tụng hình sự",
    "Kỳ báo cáo, nguồn số liệu, đối chiếu số liệu",
    "Cơ sở dữ liệu thống kê và chia sẻ dữ liệu",
  ],
  "ttlt-12-2026-tuong-tro": [
    "Yêu cầu nước ngoài cam kết liên quan đến hình phạt tử hình",
    "Lấy lời khai trực tuyến theo yêu cầu nước ngoài",
    "Chuyển giao tạm thời người đang bị tạm giam, chấp hành án",
    "Yêu cầu nước ngoài truy cứu TNHS và xử lý yêu cầu truy cứu của nước ngoài",
  ],
  "ttlt-11-2026-ly-lich": [
    "Tra cứu, xác minh thông tin lý lịch tư pháp, tiền án của người phạm tội",
    "Thông tin do Tòa án, VKS, Công an, thi hành án dân sự cung cấp",
    "Thời hạn cung cấp thông tin; rà soát dữ liệu",
  ],
  "ttlt-06-2026-dan-do": [
    "Tiếp nhận, chuyển yêu cầu dẫn độ của nước ngoài",
    "Lập yêu cầu dẫn độ của Việt Nam",
    "Chuyển giao người bị dẫn độ; biên bản bàn giao",
    "Thời hạn 30 ngày, lý do bất khả kháng",
  ],
  "tt-03-2026-vkstc-bieu-mau": [
    "Biểu mẫu văn bản tố tụng của VKS trong khởi tố, điều tra, truy tố",
    "Biểu mẫu văn bản nghiệp vụ công tố, kiểm sát điều tra",
    "Mẫu đối với người dưới 18 tuổi",
  ],
  "ttlt-01-2017-nguon-tin": [
    "Trách nhiệm tiếp nhận, thẩm quyền giải quyết tố giác, tin báo, kiến nghị khởi tố",
    "Phân loại, giải quyết nguồn tin; thời hạn giải quyết",
    "Thực hành quyền công tố, kiểm sát việc giải quyết nguồn tin",
    "Tạm đình chỉ, phục hồi giải quyết nguồn tin",
  ],
  "ttlt-01-2021-nguon-tin": ["Sửa đổi, bổ sung TTLT 01/2017 về tiếp nhận, giải quyết nguồn tin về tội phạm"],
  "ttlt-07-2025-quan-doi": [
    "Phối hợp giải quyết nguồn tin liên quan người trong và ngoài Quân đội",
    "Chuyển giao nguồn tin; nguồn tin chưa rõ thẩm quyền",
    "Ủy thác điều tra, tách, chuyển vụ án",
    "Phối hợp khi bắt, khám xét, tạm giữ, tạm giam; truy tố, xét xử",
  ],
  "ttlt-02-2017-tra-ho-so": [
    "Các trường hợp trả hồ sơ để điều tra bổ sung (thiếu chứng cứ, đồng phạm, tội khác…)",
    "Vi phạm nghiêm trọng thủ tục tố tụng",
    "Phối hợp thực hiện quyết định trả hồ sơ",
  ],
  "ttlt-01-2026-cqdt-vks": [
    "Phối hợp Cơ quan điều tra – VKS trong khởi tố, điều tra",
    "Khởi tố bị can, phê chuẩn; thay đổi, bổ sung quyết định khởi tố",
    "Yêu cầu điều tra; VKS trực tiếp tiến hành một số hoạt động điều tra",
    "Giữ người khẩn cấp, bắt, tạm giữ, tạm giam",
  ],
  "ttlt-03-2018-ghi-am": [
    "Ghi âm, ghi hình có âm thanh khi hỏi cung bị can",
    "Hành vi bị nghiêm cấm; quản lý, sử dụng bản ghi",
  ],
  "ttlt-04-2026-chi-tiet-bltths": [
    "Ký số văn bản tố tụng; xác nhận điện tử của người tham gia tố tụng",
    "Số hóa hồ sơ vụ án; giá trị pháp lý hồ sơ vụ án điện tử",
    "Giao, chuyển, đọc, sao chụp, lưu trữ hồ sơ điện tử",
  ],
  "ttlt-04-2026-thong-ke": [
    "Thống kê hình sự liên ngành: chỉ tiêu, biểu mẫu",
    "Nguồn số liệu, đối chiếu, hiệu chỉnh số liệu",
    "Thời hạn, phương thức gửi báo cáo",
  ],
  "ttlt-01-2017-giam-dinh-tham-nhung": [
    "Trường hợp cần thiết phải trưng cầu giám định trong vụ án tham nhũng, kinh tế",
    "Giao nhận quyết định trưng cầu, hồ sơ, đối tượng giám định",
    "Đánh giá, sử dụng kết luận giám định",
  ],
  "ttlt-02-2026-giam-dinh": [
    "Phân cấp, các trường hợp trưng cầu giám định tư pháp",
    "Giám định mẫu đại diện; đối tượng giám định không còn",
    "Niêm phong, giao nhận hồ sơ, kết luận giám định",
    "Quyền yêu cầu giám định; đánh giá kết luận giám định",
  ],
  "ttlt-01-2025-giam-dinh": [
    "Phối hợp trưng cầu, thực hiện giám định trong tố tụng hình sự",
    "Đánh giá, sử dụng kết luận giám định",
  ],
  "ttlt-05-2025-vang-mat": [
    "Kết luận điều tra đề nghị truy tố vắng mặt bị can",
    "Truy tố vắng mặt bị can",
    "Xét xử vắng mặt bị cáo bỏ trốn ra nước ngoài",
  ],
  "ttlt-03-2025-tham-quyen": [
    "Thẩm quyền xét xử sơ thẩm vụ án hình sự của Tòa án cấp tỉnh",
    "Chuyển vụ án giữa các Tòa án trong giai đoạn xét xử",
  ],
  "ttlt-01-2025-vat-chung": [
    "Thí điểm xử lý vật chứng, tài sản theo Nghị quyết 164/2024/QH15",
    "Trả lại tiền cho bị hại; gửi tiền vào ngân hàng chờ xử lý",
    "Nộp tiền bảo đảm để hủy bỏ thu giữ, kê biên",
    "Mua bán, chuyển nhượng, giao vật chứng; tạm ngừng giao dịch",
  ],
  "ttlt-11-2025-lang-phi": [
    "Dấu hiệu vi phạm gây lãng phí trong ngân sách, tài sản công, đất đai",
    "Xác định hậu quả lãng phí qua giám định, định giá và không qua giám định",
  ],
  "tt-02-2025-vkstc": [
    "Thẩm quyền của VKSND tối cao, VKSND cấp tỉnh, VKSND khu vực",
    "Phân định thẩm quyền công tố, kiểm sát sau sắp xếp bộ máy",
  ],
  "tt-28-2020-bca": [
    "Tiếp nhận, phân loại, xử lý tố giác, tin báo trong Công an nhân dân",
    "Thời hạn phân công, giải quyết; kế hoạch kiểm tra, xác minh",
    "Biện pháp áp dụng khi giải quyết tố giác, tin báo",
  ],
  "tt-75-2024-bca": [
    "Danh mục dao có tính sát thương cao",
    "Trang bị, sử dụng, thu hồi vũ khí, vật liệu nổ, công cụ hỗ trợ",
    "Phân loại, bảo quản, tiêu hủy vũ khí thu hồi",
  ],
  "nd-19-2018-ma-tuy": [
    "Nguyên tắc tính tổng khối lượng, thể tích chất ma túy",
    "Trường hợp có nhiều chất ma túy khác nhau trong một vụ án",
  ],
  "nd-115-2017-phap-nhan": [
    "Mức tiền pháp nhân thương mại phạm tội nộp bảo đảm thi hành án",
    "Trình tự nộp, tạm giữ, hoàn trả, nộp ngân sách số tiền bảo đảm",
  ],

  // ---------------- Nghị quyết HĐTP, văn bản hướng dẫn ----------------
  "nq-04-2025-hdtp": [
    "Áp dụng từng tình tiết giảm nhẹ tại Điều 51 BLHS",
    "Áp dụng từng tình tiết tăng nặng tại Điều 52 BLHS",
    "Thành khẩn khai báo, ăn năn hối cải; bồi thường, khắc phục hậu quả",
  ],
  "nq-04-2024-hdtp": [
    "Xuất cảnh trái phép đi khai thác thủy sản ở vùng biển nước ngoài",
    "Khai thác, mua bán, vận chuyển thủy sản trái phép",
    "Truy cứu TNHS người nước ngoài khai thác thủy sản trái phép",
  ],
  "nq-02-2024-hdtp": [
    "Vi phạm quy định về phòng cháy, chữa cháy (Điều 313 BLHS)",
    "Truy cứu theo khoản 1, 2, 3 và khoản 4 Điều 313",
    "Một số trường hợp cụ thể",
  ],
  "nq-03-2022-hdtp": [
    "Từ ngữ: vũ khí quân dụng, vật liệu nổ, súng săn, vũ khí thô sơ",
    "Tình tiết định tội, định khung các Điều 304–308",
    "Một số trường hợp cụ thể",
  ],
  "nq-01-2021-hdtp": [
    "Nguyên tắc xử lý tội cho vay lãi nặng (Điều 201)",
    "Tư cách tố tụng của người vay",
    "Xác định số tiền thu lợi bất chính; xử lý vật, tiền",
  ],
  "nq-03-2020-hdtp": [
    "Tình tiết định tội, định khung trong tội tham nhũng, chức vụ",
    "Nguyên tắc xử lý; miễn TNHS, quyết định hình phạt",
    "Phạm tội nhiều lần; xác định trị giá tài sản chiếm đoạt, thiệt hại",
    "Xử lý vật, tiền liên quan",
  ],
  "nq-07-2019-hdtp": [
    "Khái niệm gây tình trạng hoảng sợ trong công chúng",
    "Tình tiết định khung tội khủng bố, tài trợ khủng bố",
    "Một số trường hợp cụ thể",
  ],
  "nq-06-2019-hdtp": [
    "Giải thích: xâm hại tình dục, bộ phận sinh dục, quan hệ tình dục khác, dâm ô",
    "Tình tiết định tội, định khung các Điều 141–147",
    "Trường hợp loại trừ xử lý hình sự",
    "Tổ chức xét xử vụ án có bị hại dưới 18 tuổi",
  ],
  "nq-05-2019-hdtp": [
    "Gian lận bảo hiểm xã hội, bảo hiểm thất nghiệp, bảo hiểm y tế",
    "Trốn đóng bảo hiểm cho người lao động",
    "Tư cách tố tụng của cơ quan bảo hiểm xã hội",
  ],
  "nq-03-2019-hdtp": ["Tội rửa tiền: thuật ngữ, tội phạm nguồn", "Tình tiết định tội, định khung"],
  "nq-02-2019-hdtp": [
    "Tình tiết định tội, định khung mua bán người, mua bán người dưới 16 tuổi",
    "Thủ đoạn lừa đưa sang nước ngoài, mua bán bào thai",
    "Phạm tội có nhiều hành vi; mua bán người và cố ý gây thương tích",
  ],
  "nq-05-2018-hdtp": [
    "Động vật hoang dã, nguy cấp, quý, hiếm (Điều 234, 244)",
    "Chiếm đoạt cá thể, bộ phận cơ thể, sản phẩm",
    "Thu giữ nhiều loài động vật; xử lý vật chứng",
  ],
  "nq-04-2026-hdtp": [
    "Cơ chế đặc thù khi xét xử vi phạm pháp luật đất đai",
    "Miễn TNHS; đình chỉ, tạm đình chỉ vụ án",
    "Giảm thời hạn để xóa án tích",
  ],
  "nq-08-2021-ubtvqh15": ["Giải thích hành vi xâm nhập trái phép mạng máy tính (khoản 1 Điều 289)", "Lấy dữ liệu chứa bí mật kinh doanh"],
  "cv-662-2026-tandtc": ["Dùng dao có tính sát thương cao giết người", "Xét giảm thời hạn chấp hành hình phạt tù"],
  "cv-250-2026-tandtc": [
    "Dao có tính sát thương cao gây rối trật tự công cộng",
    "Xử lý vật, tiền trong tội cho vay lãi nặng",
    "Giao cấu, quan hệ tình dục đồng thuận với người dưới 16 tuổi",
    "Sử dụng trái phép chất ma túy (Điều 256a); người đang cai nghiện",
    "Làm giả con dấu, tài liệu; tái phạm, tình tiết định tội",
    "Tàng trữ súng kíp, thuốc nổ; đua xe, lạng lách",
    "Phạm nhân phạm tội mới; bắt buộc chữa bệnh",
    "Kháng cáo một phần trong vụ nhiều bị cáo; người chưa thành niên",
  ],
  "cv-01-2026-tandtc": [
    "Dùng dao có tính sát thương cao xâm phạm tính mạng, sức khỏe",
    "Buôn bán, tàng trữ, vận chuyển thuốc lá điếu nhập lậu",
  ],
  "cv-163-2024-tandtc": [
    "Phá két sắt trộm cắp tài sản",
    "Làm cho quan hệ hôn nhân dẫn đến ly hôn (Điều 182)",
    "Làm giả căn cước công dân; chuẩn bị phạm tội (khoản 6 Điều 134)",
    "Tai nạn giao thông chết người; thời hiệu đối với tội kéo dài",
    "Tạm giam để bảo đảm thi hành án sau xét xử sơ thẩm",
    "Thi hành án: quyết định thi hành án phạt tù, tổng hợp hình phạt",
  ],
  "cv-174-2023-tandtc": ["Tình tiết thành khẩn khai báo, ăn năn hối cải (điểm s khoản 1 Điều 51)"],
  "cv-02-2021-tandtc": [
    "Người nghiện cho người nghiện khác sử dụng địa điểm",
    "Mua ma túy hộ người khác",
    "Bị cáo phạm tội khi chưa đủ 70 tuổi",
    "Thế nào là đã bồi thường xong; tai nạn với phương tiện mượn",
    "Trả tự do khi thời hạn tù không quá thời gian tạm giam",
    "Thẩm quyền tổng hợp hình phạt (khoản 3 Điều 56)",
  ],
  "cv-89-2020-tandtc": [
    "Đưa ma túy cho người khác sử dụng; rủ nhau sử dụng ma túy",
    "Tình tiết “đối với 02 người trở lên” (Điều 255)",
    "Ma túy dạng viên nén, trộn lẫn, nhiều chất ma túy",
    "Bắt quả tang bán ma túy; buôn lậu hàng đã tiêu thụ",
    "Đánh bạc: căn cứ số tiền; buôn bán pháo nổ",
    "Giới hạn xét xử; rút một phần quyết định truy tố; hoãn chấp hành án",
  ],
  "cv-196-2018-tandtc": ["Tình tiết sử dụng mạng internet, mạng viễn thông trong tội đánh bạc, tổ chức đánh bạc (Điều 321, 322)"],
  "gd-01-2017-tandtc": [
    "Miễn chấp hành hình phạt và hình phạt bổ sung",
    "Buôn lậu; tình tiết phạm tội lần đầu, ít nghiêm trọng",
    "Hành vi trái pháp luật nghiêm trọng của nạn nhân",
    "Giới hạn xét xử; Hội đồng xét xử khởi tố vụ án",
    "Hoãn chấp hành án đối với phụ nữ có thai, nuôi con nhỏ",
    "Phần dân sự, tố tụng dân sự, hành chính",
  ],
  "cv-1179-2024-vkstc": [
    "Lợi dụng chức vụ, quyền hạn; tổ chức sử dụng trái phép chất ma túy",
    "Gây rối trật tự công cộng; tình tiết tăng nặng có tính chất côn đồ",
    "Đối chất, nhận dạng trong giải quyết nguồn tin; vật chứng vũ khí quân dụng",
    "Giám định, định giá chậm; rửa tiền; làm giả con dấu, tài liệu",
    "Phần dân sự: chi phí, thời hạn giám định",
  ],
  "cv-4962-2023-vkstc": [
    "Tình tiết “người phạm tội là người có thành tích xuất sắc”",
    "Thời hạn coi là chưa bị xử phạt vi phạm hành chính",
    "Đương nhiên được xóa án tích; tình tiết có tính chất côn đồ",
    "Làm giả, sử dụng con dấu, tài liệu giả",
    "Vụ án tạm đình chỉ; ghi âm, ghi hình hỏi cung",
    "Phần dân sự, tố tụng dân sự",
  ],
  "cv-2160-2023-vkstc": [
    "Xử lý phương tiện; hiếp dâm; giao cấu với người 13 tuổi có thai",
    "Lừa đảo bằng hóa đơn khống; lãi suất hụi, họ",
    "Xe máy chuyên dùng, nồng độ cồn (Điều 260)",
    "Số lô, số đề trong tội đánh bạc; tái phạm",
    "Thẩm quyền Hạt Kiểm lâm; vật chứng là tiền",
    "Thi hành án: giảm thời hạn, tử hình kêu oan, khiếu nại tha tù",
  ],
  "cv-5442-2020-vkstc": [
    "Miễn TNHS; xúi giục người dưới 18 tuổi phạm tội",
    "Công ty TNHH có là pháp nhân thương mại",
    "Người từ 14 đến dưới 16 tuổi phạm tội; hình phạt với người dưới 18 tuổi",
    "Đánh bạc số đề nhiều lần; để 10 người đánh bạc cùng lúc",
    "Tàng trữ ma túy; người nghiện cho người nghiện khác sử dụng địa điểm",
    "Án phí hình sự, dân sự trong vụ án hình sự",
  ],
  "cv-4688-2020-vkstc": [
    "Xác định số tiền thu lợi bất chính trong tội cho vay lãi nặng",
    "Xử lý tiền gốc và tiền thu lợi bất chính",
  ],
  "cv-5887-2019-vkstc": [
    "Tình tiết “đã bị xử phạt vi phạm hành chính”; cố tình trốn tránh",
    "Án tích người từ 16 đến dưới 18 tuổi",
    "Động vật hoang dã; sử dụng người dưới 16 tuổi phạm tội",
    "Ma túy “đối với 02 người trở lên”; bắt quả tang ma túy",
    "Chống người thi hành công vụ khi cưỡng chế; nghĩa vụ quân sự",
    "Tố tụng: giữ người khẩn cấp, ủy thác điều tra, khởi tố bị can, khám xét",
  ],
  "cv-5024-2018-vkstc": [
    "Người bị giữ trong trường hợp khẩn cấp, người bị bắt",
    "Thời điểm người bào chữa tham gia tố tụng",
    "Thay thế biện pháp ngăn chặn; tạm giữ, tạm giam",
    "Nghiệp vụ thực hành quyền công tố, kiểm sát điều tra, xét xử",
  ],
  "cv-2189-2026-vkstc": [
    "Không thay thế tạm giữ bằng cấm đi khỏi nơi cư trú",
    "Hủy bỏ tạm giữ, quyết định gia hạn tạm giữ khi khởi tố bị can",
    "Cập nhật trên Nền tảng Quản lý án hình sự",
  ],
  "hd-21-2026-vkstc-trinh-chieu": [
    "Điều kiện, trường hợp trình chiếu tài liệu, chứng cứ tại phiên tòa",
    "Trình chiếu lời khai, dữ liệu điện tử, camera, vật chứng",
    "Xử lý khi có đề nghị, khiếu nại; phân công, thiết bị",
  ],
  "hd-14-2022-lua-dao-mang": [
    "Thẩm quyền tiếp nhận tố giác lừa đảo qua mạng, viễn thông",
    "Nội dung kiểm tra, xác minh",
    "Kiểm sát việc giải quyết tố giác, tin báo",
  ],

  // ---------------- TBRKN, liên ngành Ninh Bình ----------------
  "tb-149-2025-rkn-ninh-binh": [
    "Không đề nghị áp dụng Điều 38 khi phạt tù có thời hạn",
    "Không đề nghị Điều 58 khi quyết định hình phạt đồng phạm",
    "Áp dụng chưa đủ Điều 47, 48 BLHS, Điều 106 BLTTHS khi xử lý vật chứng",
    "Áp dụng sai điều luật khi đề nghị án treo, phạt tù",
  ],
  "kl-ln-ninh-binh-q4-2025": [
    "Mua bán giấy khám sức khỏe giả; làm giả tài liệu",
    "Đánh bạc qua mạng; lô đề; tính tiền đánh bạc",
    "Chiếm đoạt nhiều lần; lừa đặt cọc qua mạng; tiêu thụ tài sản nhiều lần",
    "Gây ảnh hưởng xấu đến an ninh trật tự; hung khí gây rối, gây thương tích",
    "Tai nạn giao thông, xe tự chế; chết chưa rõ nguyên nhân",
    "Thời hạn tạm giam; vật chứng; ghi âm, ghi hình hỏi cung",
    "Thi hành án hình sự: rút ngắn thử thách, tạm đình chỉ, ủy thác",
  ],
  "kl-ln-ninh-binh-q3-2026": [
    "Thông tin nguồn tin; thỉnh thị; vụ việc tạm đình chỉ; không khởi tố",
    "Kiềm chế tai nạn giao thông; hướng dẫn Công an cấp xã",
    "Dao có tính sát thương cao theo CV 01, 250/TANDTC-PC",
    "Phạm nhân bị khởi tố tội mới: biện pháp ngăn chặn",
    "Người chưa thành niên phạm tội, khi khởi tố đã thành niên",
    "Thẩm quyền kiểm sát vụ án xảy ra ở hai khu vực; gây rối và cố ý gây thương tích",
  ],
  "tb-01-2026-ln-ninh-binh": [
    "Không hình sự hóa quan hệ kinh tế, dân sự (Nghị quyết 68-NQ/TW)",
    "Tư pháp người chưa thành niên: tách vụ án, xử lý chuyển hướng",
    "Dao có tính sát thương cao: áp dụng tạm thời",
  ],

  // ---------------- VB khác, quy chế ----------------
  "qd-06-vkstc-quy-che": [
    "Thực hành quyền công tố, kiểm sát việc tiếp nhận, giải quyết nguồn tin",
    "Kiểm sát khởi tố, điều tra; phê chuẩn, quyết định tố tụng",
    "Truy tố; trách nhiệm Kiểm sát viên",
    "Kèm 18 biểu mẫu",
  ],
  "qd-69-2026-vkstc-thinh-thi": [
    "Hướng dẫn, giải đáp vướng mắc về pháp luật, nghiệp vụ trong ngành Kiểm sát",
    "Báo cáo thỉnh thị và trả lời thỉnh thị",
  ],
  "qd-297-2026-vkstc-truc": ["Trực ngoài giờ hành chính trong ngành Kiểm sát nhân dân"],
  "nd-151-2024-giao-thong": [
    "Chi tiết Luật Trật tự, an toàn giao thông đường bộ",
    "Cơ sở dữ liệu giao thông; thiết bị giám sát hành trình",
    "Xe ưu tiên, xe ô tô người nước ngoài",
  ],

  // ---------------- Thi hành án hình sự ----------------
  "nd-170-2026-thahs": [
    "Chế độ, chính sách đối với phạm nhân",
    "Xếp loại chấp hành án phạt tù; xử lý phạm nhân vi phạm",
  ],
  "nd-213-2026-tam-giu": [
    "Kinh phí quản lý, thi hành tạm giữ, tạm giam",
    "Thông báo tạm giữ, tạm giam; người nước ngoài, tiếp xúc lãnh sự",
  ],
  "tt-57-2026-bca": [
    "Tiếp nhận, quản lý giam giữ người bị tạm giữ, tạm giam",
    "Trích xuất, điều chuyển; thăm gặp",
    "Quản lý người bị kết án tử hình; hồ sơ quản lý",
  ],
  "ttlt-13-2026-so-hoa-tam-giu": [
    "Số hóa hồ sơ, ký số trong tạm giữ, tạm giam, thi hành án tại cộng đồng",
    "Kết nối, chia sẻ dữ liệu; an toàn thông tin",
  ],
  "ttlt-12-2026-so-hoa-thahs": [
    "Số hóa hồ sơ thi hành án hình sự; ký số",
    "Gửi, nhận văn bản điện tử; kết nối, chia sẻ dữ liệu",
  ],
  "ttlt-10-2026-khieu-nai-tha": [
    "Quyết định, hành vi có thể bị khiếu nại trong thi hành án phạt tù",
    "Thẩm quyền, trình tự giải quyết khiếu nại lần đầu, lần hai",
    "Giải quyết tố cáo; kiểm sát việc giải quyết",
  ],
  "ttlt-09-2026-tu-hinh": [
    "Quyết định, kế hoạch thi hành án tử hình bằng tiêm thuốc độc",
    "Hoãn thi hành án tử hình; biên bản, hồ sơ",
    "Nhận tử thi, tro cốt, hài cốt",
  ],
  "ttlt-08-2026-tha-tu": [
    "Hồ sơ, lập hồ sơ đề nghị tha tù trước thời hạn có điều kiện",
    "Hội đồng xét, thẩm định hồ sơ",
    "Thi hành quyết định tha tù",
  ],
  "ttlt-07-2026-chuyen-doi-hinh-phat": [
    "Chuyển đổi hình phạt tù khi chuyển giao người chấp hành án",
    "Người thành niên, người chưa thành niên; trả tự do",
  ],
  "ttlt-05-2026-tam-giu": [
    "Bàn giao, tiếp nhận, điều chuyển người bị tạm giữ, tạm giam",
    "Quản lý bị cáo khi trích xuất ra phiên tòa",
    "Trực tiếp kiểm sát; huy động lực lượng cơ sở giam giữ",
  ],
  "ttlt-01-2026-truong-giao-duong": [
    "Khiếu nại trong thi hành biện pháp giáo dục tại trường giáo dưỡng",
    "Thẩm quyền, thời hạn, thủ tục giải quyết; kiểm sát",
  ],
  "ttlt-03-2026-trich-xuat": [
    "Thủ tục yêu cầu, ra lệnh, gia hạn trích xuất phạm nhân",
    "Quản lý phạm nhân được trích xuất; trả lại trại giam",
  ],
  "ttlt-04-2025-phoi-hop": [
    "Phối hợp tố tụng hình sự khi không tổ chức Công an cấp huyện",
    "Thẩm quyền giải quyết nguồn tin, khởi tố, điều tra",
    "Cơ quan quản lý, thi hành tạm giữ, tạm giam; thẩm quyền kiểm sát",
  ],
  "nq-03-2025-hdtp": [
    "Chuyển hình phạt tử hình thành tù chung thân theo Luật 86/2025/QH15",
    "Rà soát, lập danh sách, xem xét quyết định chuyển",
  ],
  "nq-03-2024-hdtp": [
    "Thời hiệu thi hành bản án",
    "Miễn chấp hành hình phạt; giảm mức hình phạt đã tuyên",
    "Hoãn, tạm đình chỉ chấp hành hình phạt tù",
  ],
  "nq-01-2018-hdtp": [
    "Điều kiện tha tù trước thời hạn có điều kiện",
    "Hủy bỏ quyết định tha tù; rút ngắn thời gian thử thách",
  ],
  "nq-an-treo-hop-nhat": [
    "Điều kiện cho hưởng án treo; trường hợp không cho hưởng",
    "Thời gian thử thách; nội dung bản án",
    "Rút ngắn thời gian thử thách",
  ],
};
