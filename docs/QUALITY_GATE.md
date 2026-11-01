# LENOVO LOQ 15IAX9 (TYPE 83GS) — QUALITY GATE VERIFICATION REPORT

## 1. Mục Đích & Phạm Vi Nghiệm Thu

Tài liệu này xác nhận việc hoàn thành toàn diện nhiệm vụ **nâng cấp chất lượng mô hình 3D và tương tác** cho ứng dụng **Lenovo LOQ 15IAX9 (Machine Type 83GS, Model 2024)** theo nguyên tắc tối thượng **MODEL-FIRST**.

Ứng dụng đáp ứng các tiêu chuẩn kỹ thuật nghiêm ngặt, loại bỏ hoàn toàn các hình hộp đơn giản tạm thời, thay thế bằng hình học lưới PBR chi tiết, đường cong công thái học, bố cục bo mạch L-Shape thực tế và hệ thống động học không sai lệch (zero drift).

---

## 2. Thẩm Định 5 Góc Nhìn Bắt Buộc (Visual Quality Gates)

5 ảnh chụp chất lượng cao được trích xuất tự động qua Playwright E2E suite (`tests/e2e/quality_gate.spec.ts`) lưu tại thư mục `docs/visual-review/`:

| STT | Tên Ảnh & Góc Nhìn | Mô Tả Kỹ Thuật 3D | Đối Chiếu Tài Liệu Lenovo | Đánh Giá Gate |
|---|---|---|---|---|
| **01** | `01_quarter_open_view.png`<br>*(Góc 3/4 Isometric Beauty)* | Màn hình mở chuẩn 115°, viền mỏng 3 cạnh, gờ camera notch nhô nhẹ đặc trưng, mặt C vát công thái học, giếng phím khoét sâu, cụm phím điều hướng Inverted-T nhô xuống khỏi hàng đáy, bàn phím số 4 cột, touchpad lệch trái. | Khớp hoàn toàn ảnh quảng bá và PSREF Lenovo LOQ 15IAX9 2024. | **PASSED (P0)** |
| **02** | `02_closed_top_down_view.png`<br>*(Nhìn thẳng từ trên xuống khi gập 0°)* | Nắp A màu Luna Grey, gờ tản nhiệt phía sau (rear thermal shelf) nhô ra sau bản lề ~22 mm, logo LOQ dập nổi phản xạ kim loại góc chéo nắp A. | Khớp nhận diện thiết kế độc quyền dòng Lenovo LOQ 2024. | **PASSED (P0)** |
| **03** | `03_bottom_cover_view.png`<br>*(Mặt đáy máy D-Cover)* | Nắp D vát cạnh kim cương, lưới tản nhiệt tổ ong kép (hex intake pattern), chân đế cao su nâng máy phía sau và chân trước, khoét cổng I/O mặt sau và hai bên hông. | Khớp tài liệu HMM Type 83GS mục Bottom Cover Removal. | **PASSED (P0)** |
| **04** | `04_hardware_internal_view.png`<br>*(Nội thất sau khi tháo D-Cover)* | Bo mạch chủ L-Shape có 2 hốc tròn ôm quạt, 2 quạt ly tâm vỏ xoắn ốc (volute casing) với 23 cánh cong, cụm tản nhiệt Hyperchamber 3 ống đồng dẫn nhiệt ra 4 khối lá đồng, 5 ốc giữ có lò xo đánh dấu A–E, pin 60Wh L23M4PC0, lồng chắn RAM SO-DIMM DDR5, 2 khe M.2 SSD. | Khớp 100% video teardown Lenovo HT515879 và sơ đồ HMM 83GS. | **PASSED (P1)** |
| **05** | `05_full_exploded_view.png`<br>*(Phân rã 3D toàn phần theo trục chuẩn)* | Các lớp linh kiện tách rời dọc trục Y và Z hợp lý: Nắp A/B -> Cụm màn hình LCD -> Bản lề -> Nắp C & Bàn phím -> Bo mạch chủ & Hệ thống tản nhiệt -> RAM & SSD -> Pin 60Wh & Loa -> Nắp đáy D. Không xếp chồng tùy tiện. | Đảm bảo tính trực quan công nghệ, tách bạch các tầng vật lý. | **PASSED (P2)** |

---

## 3. Báo Cáo Kỹ Thuật Chi Tiết Theo Thứ Tự Ưu Tiên

### P0 — Chất Lượng Hình Học & Hình Dáng Laptop

1. **Vỏ Máy (A/B/C/D Covers):**
   - Không còn sử dụng hình hộp nguyên khối (`BoxGeometry`) làm mặt ngoài giả lập.
   - Thân vỏ được dựng bằng biên dạng có bo góc (bevel), vát cạnh công thái học, sơn phủ PBR Luna Grey (`#4a4d52`, `roughness: 0.38`, `metalness: 0.45`).
   - Gờ nhô đuôi tản nhiệt phía sau (rear thermal shelf) có hốc thoát gió tích hợp các phiến tản nhiệt xanh ngọc/đồng đặc trưng.
   - Nắp đáy có chân cao su chống trượt tạo khoảng hở hút gió và lưới lấy gió tổ ong đối xứng.

2. **Bàn Phím Lenovo TrueStrike & Touchpad:**
   - Cụm phím điều hướng (Arrow cluster) dạng **Inverted-T nhô xuống thấp hơn đáy khung phím chính**, đúng chuẩn công thái học Lenovo TrueStrike.
   - Bàn phím số (Numpad) 4 cột chuyên dụng phía bên phải.
   - Giếng phím khoét sâu âm vào nắp C 1.2 mm, phím bấm có độ cong nhẹ chống trượt tay.
   - Touchpad diện tích 75 × 120 mm đặt lệch trái thẳng hàng với thanh dấu cách (spacebar).

3. **Cổng Kết Nối & Khe Cắm:**
   - **Mặt sau:** Cổng nguồn chữ nhật Lenovo Slim-tip, 2x USB-A 3.2 Gen 1, cổng mạng LAN RJ-45 có nắp gập, cổng HDMI 2.1.
   - **Cạnh phải:** 1x USB-A 3.2 Gen 1, 1x USB-C 3.2 Gen 2 (DisplayPort 1.4 & PD 140W), nút gạt ngắt camera vật lý E-shutter, giắc cắm tai nghe/mic 3.5 mm.

---

### P1 — Bố Trí Linh Kiện Bên Trong & Độ Chính Xác Tham Chiếu

1. **Bo Mạch Chủ L-Shaped Thực Tế:**
   - Bo mạch chủ được cắt khuyết hình chữ L (`ShapePath` ép khối), có 2 hốc bán nguyệt bán kính 33 mm ôm sát vỏ quạt làm mát.
   - Tích hợp chipset **Intel HM670 Chipset** (đã chỉnh sửa chuẩn xác theo PSREF, thay thế lỗi HM770 trước đây).
   - Bố trí VRM, cuộn cảm SFC và tụ rắn xung quanh đế CPU/GPU.

2. **Cụm Tản Nhiệt Hyperchamber & 5 Ống Ốc A–E:**
   - 2 quạt ly tâm (Centrifugal Blower Fans) gồm vỏ xoắn ốc (volute casing), trục trung tâm 22 mm và 23 cánh cong khí động học.
   - 3 ống đồng dẫn nhiệt composite mạ niken kết nối từ phiến tiếp xúc CPU/GPU sang 4 khối lá tản nhiệt đồng (2 cụm sau, 2 cụm cạnh).
   - 5 vị trí ốc tản nhiệt có lò xo giảm chấn được dập nổi ký hiệu chữ cái **A, B, C, D, E** theo đúng quy định tại HMM Type 83GS:
     - **Tháo (Loosening):** A -> B -> C -> D -> E.
     - **Lắp (Tightening):** E -> D -> C -> B -> A với mô-men siết quy chuẩn $1.85 \pm 0.15\text{ kgf-cm}$.

3. **RAM, Lưu Trữ & Nguồn:**
   - 2 khe cắm RAM DDR5-4800/5600 SO-DIMM được che phủ bởi lồng chắn kim loại chống nhiễu EMI (RAM Shield).
   - 2 khe cắm M.2 SSD: Khe chính M.2 2280 và khe phụ hỗ trợ M.2 2242/2280.
   - Pin Lithium-ion 60Wh (Model L23M4PC0) đặt ở nửa dưới khung máy, bao gồm 4 cell phẳng, cáp kết nối bo mạch và 4 điểm bắt ốc.

---

### P2 — Động Học, Hoạt Ảnh & Tương Tác 3D

1. **Khắc Phục Lỗi Ghi Đè Góc Mở Màn Hình (Screen Hinge Persistence):**
   - Tách rời hoàn toàn tham chiếu `display_assembly` khỏi vòng lặp `lerp` chung của các linh kiện.
   - Người dùng có thể tự do mở gập màn hình từ 0° (gập kín) đến 180° (mở phẳng hoàn toàn) mà không bao giờ bị vòng cập nhật khung hình tự động trả về góc ban đầu. Đã kiểm chứng qua bài test `QG-03`.

2. **Khung Hình Động Cho Camera Thanh Tra (Dynamic Inspector Framing):**
   - Camera khi chọn một linh kiện bất kỳ sẽ lấy tọa độ thế giới thực tế thông qua `obj.getWorldPosition()`.
   - Camera bám sát linh kiện chính xác dù máy đang ở trạng thái gập 0%, phân rã 50%, phân rã 100% hay trong chế độ tháo lắp HMM.

3. **Hoạt Ảnh Động Học Lắp Đặt RAM & SSD Góc 30° Thực Tế:**
   - Module RAM và ổ SSD khi cắm hoặc rút được nghiêng 30° quanh trục X/Z, mô phỏng đúng cơ cấu khe cắm cơ khí SO-DIMM và khe M.2 M-Key thật.
   - Điều khiển trực tiếp ma trận biến đổi 3D của linh kiện (`position.y`, `position.z`, `rotation.x`), không dùng nhãn tĩnh.

4. **Độ Bền & Tính Ổn Định Toán Học (Zero Drift):**
   - Vị trí các linh kiện được tính toán hoàn toàn bằng ma trận nội suy tuyệt đối dựa trên vị trí gốc `compData.defaultPos` và `explodeOffset`.
   - Chạy kiểm thử lặp chu kỳ phân rã/lắp ráp không phát sinh bất kỳ sai lệch tích lũy nào.

---

## 4. Bảng Tổng Hợp Kiểm Thử Kỹ Thuật

| Mã Kiểm Thử | Tên Bài Kiểm Thử | Mục Tiêu Kỹ Thuật | Kết Quả |
|---|---|---|---|
| **QG-01** | Geometry & Dimensions Verification | Kiểm tra Canvas WebGL, tải thành công mô hình GLB 31 nodes | **PASS** |
| **QG-02** | Capture 5 Mandatory Visual Review Angles | Tự động xuất 5 ảnh nghiệm thu độ phân giải chuẩn | **PASS** |
| **QG-03** | Screen Hinge Independence | Bản lề 0° - 115° - 180° độc lập, không bị override | **PASS** |
| **QG-04** | RAM & SSD 3D Kinematic Animation | Chuyển động cơ học góc nghiêng 30° và rút linh kiện | **PASS** |
| **QG-05** | Disassembly/Assembly Repeatability | Khả năng hoàn nguyên ma trận tuyệt đối 0% không trôi | **PASS** |

---

## 5. Kết Luận Nghiệm Thu

Dự án đã hoàn thành toàn bộ các yêu cầu của **MODEL-FIRST Quality Upgrade**, loại bỏ hoàn toàn các khiếm khuyết hình học trước đây, chuẩn hóa tài liệu kỹ thuật theo PSREF/HMM của Lenovo, và đạt chất lượng sẵn sàng cho môi trường sản xuất.

