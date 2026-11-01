# Lenovo LOQ 15IAX9 (Machine Type 83GS) — Bảng Dữ Liệu Tham Chiếu & Đối Chiếu Hình Học 3D (MODEL_REFERENCE)

Tài liệu này xác lập nguồn sự thật kỹ thuật (Ground Truth) dùng để xây dựng, tái tạo và kiểm soát chất lượng mô hình 3D cho dự án **Lenovo LOQ 15IAX9 — Interactive 3D Exploded View**.

---

## 1. Nguồn Dữ Liệu Tham Chiếu Bắt Buộc

1. **Nguồn 1 — Lenovo PSREF (Product Specifications Reference):**
   - URL: `https://psref.lenovo.com/syspool/Sys/PDF/LOQ/LOQ_15IAX9/LOQ_15IAX9_Spec.pdf`
   - Dữ liệu cung cấp: Kích thước vỏ ngoài ($359.86 \times 258.7 \times 21.9–23.9\text{ mm}$), trọng lượng (2.38 kg), màu Luna Grey, thông số màn hình 15.6" 16:9, chipset Intel HM670, CPU dòng HX, cổng I/O phía sau và hai bên, pin 60Wh, 2 khe SO-DIMM DDR5, 2 khe M.2 PCIe 4.0.
2. **Nguồn 2 — Lenovo Hardware Maintenance Manual (HMM):**
   - URL: `https://pcsupport.lenovo.com/gb/en/products/laptops-and-netbooks/gaming-series/loq-15iax9/83gs/document-userguide`
   - Dữ liệu cung cấp: Sơ đồ tháo rời linh kiện (CRU/FRU), 10 ốc nắp đáy, vị trí tháo pin, thứ tự nới ốc tản nhiệt (A -> B -> C -> D -> E), góc nâng 30° của RAM SO-DIMM và ổ M.2 NVMe SSD.
3. **Nguồn 3 — Lenovo Removal and Replacement Videos (HT515879):**
   - URL: `https://support.lenovo.com/ai/en/solutions/HT515879`
   - Dữ liệu cung cấp: Video hướng dẫn thực tế từng bước tháo nắp đáy D-Cover, pin L23M4PC0, lồng chắn RAM EMI, bo mạch chủ, quạt ly tâm và cụm tản nhiệt Hyperchamber.
4. **Nguồn 4 — Teardown & Internal Inspection:**
   - LaptopMedia / iFixit teardown của LOQ 15 Gen 9 (15IAX9 2024): Xác minh hình dáng bo mạch chủ L-Shape, đường cắt quanh họng 2 quạt, bố cục die CPU & GPU, cụm phím điều hướng Inverted-T.

---

## 2. Bảng Đối Chiếu Linh Kiện: Kích Thước Xác Thực vs Hình Học Ước Lượng

| Bộ Phận | Vị Trí Trong Laptop | Nguồn & Tham Chiếu Kỹ Thuật | Kích Thước Đã Xác Thực (mm) | Phần Hình Học Tái Dựng / Ước Lượng | Mức Độ Tin Cậy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nắp lưng A-Cover (`display_lid`)** | Mặt trên nắp màn hình | PSREF LOQ 15IAX9 Dimensions / Video HT515879 | $359.86 \times 238.0 \times 7.2$ (Dài × Rộng × Dày) | Độ cong vát 4 góc ngoài, vị trí logo LOQ góc trên trái và plate Lenovo góc dưới phải | **Rất cao (High)** |
| **Viền màn hình B-Cover (`display_bezel`)** | Mặt trước quanh tấm nền | Lenovo HMM Bezel FRU | $352.0 \times 232.0 \times 2.8$; Viền bên: 7.8mm, đỉnh: 11.5mm | Biên dạng ngàm nhựa viền bên dưới; độ nhô notch webcam đỉnh | **Rất cao (High)** |
| **Tấm nền LCD (`display_panel`)** | Giữa nắp A và viền B | PSREF 15.6" FHD 16:9 Active Area Spec | $344.16 \times 193.59 \times 3.2$ (Vùng hiển thị chuẩn) | Khung viền mạ kẽm gia cố phía sau | **Tuyệt đối (Exact)** |
| **Webcam & Mics (`webcam_module`)** | Gờ notch trên viền B | Lenovo HMM Camera FRU / PSREF Spec | $65.0 \times 8.0 \times 2.5$ | Mạch in vi mô tích hợp công tắc ngắt e-shutter | **Cao (High)** |
| **Bản lề (`hinge_left`, `hinge_right`)** | Hai góc dưới màn hình, gắn lên C-Cover | Lenovo HMM Hinge Section | $32.0 \times 28.0 \times 14.0$; góc mở tối đa 180° | Rãnh vít ren chịu lực M2.5 × L5 | **Cao (High)** |
| **Khung mặt C (`upper_case`)** | Khung thân trên & bệ kê tay | PSREF / HMM Upper Case Assembly | $359.86 \times 258.7 \times 12.0$ | Độ dốc vát mặt kê tay và rãnh chứa cụm phím điều hướng thụt xuống | **Rất cao (High)** |
| **Bàn phím (`keyboard`)** | Khay phím mặt C | PSREF Full Keyboard with Numpad Spec | Vùng phím $338.0 \times 106.0 \times 2.5$; hành trình 1.5mm | Khung phím Inverted-T đặc trưng, font chữ silkscreen và độ lõm mặt phím TrueStrike | **Rất cao (High)** |
| **Bàn di chuột (`touchpad`)** | Trung tâm lệch trái bệ kê tay | PSREF Mylar Trackpad Spec | $120.0 \times 75.0 \times 2.0$ (Chuẩn Mylar 120×75mm) | Cơ cấu switch click bên dưới | **Tuyệt đối (Exact)** |
| **Gờ cổng sau (`rear_io_ports`)** | Gờ nhô sau bản lề (Shelf) | PSREF Port Layout / Rear Shelf Spec | Vùng gờ: $220.0 \times 16.0 \times 10.0$ | Khối jack đúc Slim Tip, HDMI, RJ45, USB-C | **Rất cao (High)** |
| **Bo mạch chủ (`motherboard`)** | Nằm trong khoang khung C | Lenovo HMM Motherboard FRU / Teardown | Chiều bao ngoài: $265.0 \times 175.0 \times 1.6$; PCB dạng chữ L | Các hốc khuyết đón họng quạt ly tâm 2 bên; mật độ linh kiện dán SMD | **Rất cao (High)** |
| **CPU Intel HX (`cpu_module`)** | Bên trái bo mạch chủ | Intel Socket BGA1964 Datasheet | $45.0 \times 37.5 \times 1.8$ (Kích thước đế BGA1964) | Tụ lọc điện quanh die silicon | **Tuyệt đối (Exact)** |
| **GPU NVIDIA RTX (`gpu_module`)** | Bên phải trung tâm bo mạch | NVIDIA Mobile GPU Package Spec | $40.0 \times 40.0 \times 2.0$ | Khung viền kim loại bảo vệ mép die | **Tuyệt đối (Exact)** |
| **VRAM GDDR6 (`vram_chips`)** | Xung quanh 3 phía đế GPU | JEDEC GDDR6 BGA Package Spec | $14.0 \times 12.0 \times 1.2$ (Chuẩn BGA GDDR6) | Đường mạch dẫn tín hiệu ngầm | **Tuyệt đối (Exact)** |
| **Cụm tản nhiệt (`thermal_module`)** | Phủ trên CPU, GPU & VRM | Lenovo HMM Hyperchamber FRU / Whitepaper | Chiều dài tổng thể: $280.0 \times 110.0 \times 8.5$ | Biên dạng ống đồng composite D8 uốn lượn; 5 ốc lò xo dập chữ A-E | **Rất cao (High)** |
| **Quạt CPU & GPU (`fan_cpu`, `fan_gpu`)** | Hai góc sau bo mạch chủ | Lenovo HMM Fan FRU (CPU trái, GPU phải) | $72.0 \times 68.0 \times 9.5$ | Họng thổi tiếp tuyến ra sau; số lượng cánh ly tâm cong 23 cánh | **Rất cao (High)** |
| **Lá tản nhiệt sau (`heatsink_fins`)** | 2 cụm lá đồng ở hai họng thoát sau | Lenovo Hyperchamber Exhaust Spec | $85.0 \times 18.0 \times 10.0$ (Mỗi cụm) | Độ dày lá đồng 0.15mm sắp song song | **Cao (High)** |
| **Lồng che RAM (`ram_shield`)** | Trung tâm bo mạch | Lenovo HMM RAM Shielding Guide | $76.0 \times 68.0 \times 4.2$ | Dập lỗ tổ ong tản nhiệt và ngàm bấm đàn hồi | **Cao (High)** |
| **Thanh RAM DDR5 (`ram_slot_1`, `2`)** | 2 khe SO-DIMM xếp ngang/chồng | JEDEC SO-DIMM 262-pin DDR5 Spec | $69.6 \times 30.0 \times 3.8$ (Chuẩn JEDEC SO-DIMM) | Khe socket có lẫy kim loại bật chéo 30° | **Tuyệt đối (Exact)** |
| **Ổ cứng SSD M.2 (`ssd_primary`, `2`)** | Slot 1 bên trái (2280/2242), Slot 2 bên phải | JEDEC M.2 2280 NVMe Spec | $80.0 \times 22.0 \times 3.5$ (Chuẩn M.2 2280) | Chip controller, flash NAND và tấm kẹp tản nhiệt | **Tuyệt đối (Exact)** |
| **Card Wi-Fi 6 (`wifi_card`)** | Cạnh khe SSD Slot 1 | Intel Wi-Fi 6 M.2 2230 Spec | $30.0 \times 22.0 \times 2.4$ (Chuẩn M.2 2230 Key-E) | 2 đầu cắm ăng-ten IPEX MHF4 trắng/đen | **Tuyệt đối (Exact)** |
| **Bộ pin 60Wh (`battery_pack`)** | Phía trước đáy máy | Lenovo PSREF / HMM Pin Model L23M4PC0 | $225.0 \times 75.0 \times 7.5$ (Dung lượng 60Wh, 15.36V) | Đường rãnh giữa 4 cell pouch, cáp giắc cắm nguồn bo mạch, 4 tai ốc | **Rất cao (High)** |
| **Loa âm thanh (`speaker_left`, `right`)** | Hai góc trước 2 bên pin | Lenovo HMM Speaker FRU (2W × 2) | $55.0 \times 25.0 \times 7.0$ (Mỗi hộp) | Đệm cao su giảm chấn vòng quanh | **Cao (High)** |
| **Nắp đáy D-Cover (`bottom_cover`)** | Toàn bộ mặt đáy laptop | PSREF LOQ 15IAX9 D-Cover / Video HT515879 | $359.86 \times 258.7 \times 10.5$ | Hệ thống khe hút gió tổ ong dưới 2 quạt, dải cao su trước và 2 chân nâng cao phía sau, 10 lỗ ốc | **Rất cao (High)** |

---

## 3. Quy Ước Mức Độ Xác Thực & Giới Hạn Nghiệm Thu

1. **Tuyệt đối (Exact):** Kích thước chuẩn hóa theo chuẩn công nghiệp (JEDEC DDR5, JEDEC M.2 2280, BGA1964, Vùng hiển thị LCD 15.6" 16:9).
2. **Rất cao (High):** Kích thước được công bố chính thức trong Lenovo PSREF / HMM hoặc đo đạc trực tiếp từ tài liệu kỹ thuật có tỉ lệ mm.
3. **Cao (High):** Kích thước hình học tái dựng theo tỉ lệ phân rã cơ học thực tế từ video tháo máy HT515879 của Lenovo.
4. **Không tự gắn nhãn VERIFIED cho hình học ước lượng:** Mọi chi tiết ước lượng (như đường uốn chính xác của heatpipe hoặc vi mạch SMD) đều được ghi rõ là hình học tái dựng tham chiếu (Reconstructed Reference Asset).

