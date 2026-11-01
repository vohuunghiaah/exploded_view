# Báo Cáo Kết Quả Kiểm Thử Nghiệm Thu (Automated Test Report)
## Lenovo LOQ 15IAX9 — Interactive 3D Exploded View

- **Thời gian thực thi:** 2026-11-01
- **Môi trường thử nghiệm:** Windows, Chromium Engine (Headless WebGL 2.0 via ANGLE SwiftShader)
- **Công cụ kiểm thử:** Playwright 1.64.1
- **Kết quả tổng quát:** **8/8 bài kiểm thử đạt (100% Pass Rate)**

---

### Bảng Tổng Hợp Kịch Bản Kiểm Thử

| # | Tên Kịch Bản Kiểm Thử | Thời Gian | Kết Quả | Ảnh Chụp Nghiệm Thu |
|---|---|---|---|---|
| **01** | Khởi chạy ứng dụng, kiểm tra 3D Canvas, tiêu đề thiết bị và Cinematic Intro | 8.7s | **PASSED** | `tests/screenshots/01_assembled_view.png`<br>`tests/screenshots/02_cinematic_intro.png` |
| **02** | Chế độ B: Exploded View thanh trượt 0% - 100% và cơ chế đảo chiều mượt mà | 14.3s | **PASSED** | `tests/screenshots/03_exploded_view_100.png` |
| **03** | Chế độ C: Component Inspector, tra cứu thông số kỹ thuật và tính năng cô lập | 20.7s | **PASSED** | `tests/screenshots/04_component_inspector_motherboard.png` |
| **04** | Chế độ E: Chuyển đổi trạng thái nhìn xuyên Tia X (X-Ray Transition) | 13.6s | **PASSED** | `tests/screenshots/05_xray_mode.png` |
| **05** | ANIM-05: Mô phỏng hệ thống tản nhiệt Hyperchamber, tốc độ quạt 4200 RPM và luồng khí | 11.3s | **PASSED** | `tests/screenshots/06_cooling_system_simulation.png` |
| **06** | Chế độ D: Hoạt ảnh tháo lắp 10 bước chuẩn Lenovo Hardware Maintenance Manual | 14.6s | **PASSED** | `tests/screenshots/07_assembly_step_by_step.png` |
| **07** | ANIM-07: Hướng dẫn nâng cấp RAM DDR5 & M.2 PCIe 4.0 SSD góc nghiêng 30° | 12.1s | **PASSED** | `tests/screenshots/08_ram_ssd_upgrade_guide.png` |
| **08** | ANIM-10: Chuyến tham quan kỹ thuật tự động 10 cảnh (Guided Technical Tour) | 17.6s | **PASSED** | `tests/screenshots/09_guided_technical_tour.png` |

---

### Chi Tiết Xác Thực Kỹ Thuật

1. **Khởi tạo 3D & WebGL (Test 01):**
   - WebGL Canvas khởi tạo ổn định với ACESFilmicToneMapping, bóng đổ mềm PCFSoftShadowMap.
   - Không xuất hiện bất kỳ lỗi nghiêm trọng console nào trong phiên làm việc.
   - Đoạn giới thiệu điện ảnh (Cinematic Intro) phát mượt mà và nút "Bỏ qua giới thiệu" phản hồi ngay lập tức.

2. **Cơ cấu phân rã Exploded View (Test 02):**
   - Thanh trượt điều khiển trực tiếp vector dịch chuyển 3D của 20+ linh kiện độc lập.
   - Các nút preset 0% (Lắp ráp), 50% (Trung gian), 100% (Phân rã hoàn toàn) nội suy vị trí chính xác không làm sai lệch vị trí gốc ban đầu.

3. **Soi linh kiện & Thông số kỹ thuật (Test 03):**
   - Bộ tìm kiếm và lọc phân nhóm linh kiện phản hồi tức thời.
   - Nhấp chọn linh kiện kích hoạt camera framing mượt mà tới vị trí mục tiêu.
   - Bảng thông tin bên phải hiển thị đầy đủ nhãn `ĐÃ XÁC MINH CHÍNH HÃNG`, mã linh kiện FRU (như pin 60Wh L23M4PC0, bo mạch chủ Intel HM770), thông số chi tiết và trích dẫn tài liệu Lenovo.
   - Tính năng "Cô lập linh kiện" (Isolate) ẩn thành công các bộ phận xung quanh để quan sát độc lập.

4. **Trực quan hóa tản nhiệt Hyperchamber (Test 05):**
   - Hai quạt lồng sóc quay quanh trục Y chuẩn xác theo nguyên lý thổi gió ly tâm.
   - Các mức tốc độ Yên tĩnh (1800 RPM), Cân bằng (2800 RPM), Cực đại (4200 RPM) thay đổi trực tiếp tần số quay và vận tốc hạt luồng khí.
   - Gradient nhiệt hiển thị chính xác các vùng tỏa nhiệt cao (đỏ/cam trên die CPU, GPU và ống đồng) và luồng gió lạnh (xanh dương ở khe hút gió đáy).

5. **Quy trình tháo lắp chuẩn Lenovo HMM 10 bước (Test 06):**
   - 10 bước tháo lắp từ Nắp đáy D-Cover, Pin 60Wh, Loa, RAM, SSD, Wi-Fi, Tản nhiệt, Màn hình đến Bo mạch chủ.
   - Thao tác chuyển bước (Next/Prev/Direct Step) và nhãn CRU/FRU hiển thị đồng bộ.

