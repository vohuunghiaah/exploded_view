# Bảng Ma Trận Xác Minh Linh Kiện (Component Verification Matrix)
## Lenovo LOQ 15IAX9 (Machine Type 83GS) — Cập Nhật Chuẩn Hóa Theo MODEL_REFERENCE

| ID Linh Kiện | Tên Tiếng Việt | Tên Tiếng Anh | Phân Nhóm | Kích Thước Tham Chiếu (mm) | Trạng Thái Xác Thực | Căn Cứ & Bằng Chứng Riêng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `display_lid` | Nắp lưng màn hình (Mặt A) | Display A-Cover Lid | Khung & Vỏ | 359.86 × 238.0 × 7.2 | **Đã xác minh (Verified)** | Lenovo PSREF Dimensions ($359.86 \times 258.7\text{ mm}$), bề dày nắp lưng từ HMM |
| `display_bezel` | Viền màn hình (Mặt B) | Display Bezel (B-Cover) | Màn hình | 352.0 × 232.0 × 2.8 | **Tái dựng tham chiếu** | Viền bên 7.8mm, đỉnh 11.5mm từ tài liệu thiết kế LOQ 15 Gen 9 |
| `display_panel` | Tấm nền màn hình LCD 15.6" | 15.6" FHD IPS Panel | Màn hình | 344.16 × 193.59 × 3.2 | **Đã xác minh (Verified)** | Chuẩn công nghiệp 15.6" tỉ lệ 16:9 vùng hiển thị $344.16 \times 193.59\text{ mm}$ |
| `webcam_module` | Cụm Webcam & Micro kép | Webcam & Dual-mic Module | Màn hình | 65.0 × 8.0 × 2.5 | **Tái dựng tham chiếu** | Lenovo HMM Camera FRU, vị trí notch trên viền B |
| `hinge_left` | Bản lề trái | Left Display Hinge | Khung & Vỏ | 32.0 × 28.0 × 14.0 | **Tái dựng tham chiếu** | Lenovo HMM Hinge Assembly Section, 3 ốc bắt M2.5 × L5 |
| `hinge_right` | Bản lề phải | Right Display Hinge | Khung & Vỏ | 32.0 × 28.0 × 14.0 | **Tái dựng tham chiếu** | Lenovo HMM Hinge Assembly Section, góc mở 180° |
| `upper_case` | Khung mặt C & Kê tay | Upper Case Palmrest (C-Cover)| Khung & Vỏ | 359.86 × 258.7 × 12.0 | **Đã xác minh (Verified)** | Lenovo PSREF Chassis Envelope & HMM Upper Case Section |
| `keyboard` | Bàn phím đầy đủ + Numpad | Full Keyboard & Numpad | Khung & Vỏ | 338.0 × 106.0 × 2.5 | **Đã xác minh (Verified)** | PSREF Keyboard Spec, hành trình phím 1.5mm, cụm Inverted-T |
| `touchpad` | Bàn di chuột cảm ứng (Trackpad) | Precision Touchpad | Khung & Vỏ | 120.0 × 75.0 × 2.0 | **Đã xác minh (Verified)** | Lenovo PSREF Spec (Mylar surface, $120 \times 75\text{ mm}$) |
| `rear_io_ports`| Gờ tản nhiệt & Cổng sau | Rear Thermal Shelf Ports | Cổng ngoại vi| 220.0 × 16.0 × 10.0 | **Đã xác minh (Verified)** | Lenovo PSREF Port Layout Map (DC Slim Tip, RJ45, HDMI 2.1, 2x USB-A, 1x USB-C) |
| `motherboard` | Bo mạch chủ L-Shape | Main System Board | Bo mạch chủ | 265.0 × 175.0 × 1.6 | **Tái dựng tham chiếu** | Teardown LOQ 15 Gen 9 & HMM: PCB chữ L với 2 hốc cắt quạt ly tâm |
| `cpu_module` | Bộ vi xử lý Intel Core HX | Intel Core i5 HX CPU | Bo mạch chủ | 45.0 × 37.5 × 1.8 | **Đã xác minh (Verified)** | Intel Socket BGA1964 Package Specification |
| `gpu_module` | Chip đồ họa NVIDIA RTX | NVIDIA GeForce RTX GPU | Bo mạch chủ | 40.0 × 40.0 × 2.0 | **Đã xác minh (Verified)** | NVIDIA GN20/GN21 Mobile BGA Package Spec |
| `vram_chips` | Bộ nhớ đồ họa GDDR6 | GDDR6 VRAM ICs (4 chips) | Bo mạch chủ | 14.0 × 12.0 × 1.2 | **Đã xác minh (Verified)** | JEDEC GDDR6 BGA Standard ($14 \times 12\text{ mm}$) |
| `thermal_module` | Cụm tản nhiệt Hyperchamber | Heat Pipe & Cold Plate Unit| Tản nhiệt | 280.0 × 110.0 × 8.5 | **Tái dựng tham chiếu** | Lenovo Hyperchamber Architecture, 5 ốc lò xo A-E theo HMM |
| `fan_cpu` | Quạt làm mát CPU (Trái) | CPU Centrifugal Blower Fan | Tản nhiệt | 72.0 × 68.0 × 9.5 | **Tái dựng tham chiếu** | Lenovo HMM Fan FRU, họng xả tiếp tuyến ra sau |
| `fan_gpu` | Quạt làm mát GPU (Phải) | GPU Centrifugal Blower Fan | Tản nhiệt | 72.0 × 68.0 × 9.5 | **Tái dựng tham chiếu** | Lenovo HMM Fan FRU, họng xả tiếp tuyến ra sau |
| `heatsink_fins` | Lá tản nhiệt đồng phía sau | Copper Exhaust Fin Stacks | Tản nhiệt | 85.0 × 18.0 × 10.0 (x2) | **Tái dựng tham chiếu** | 2 khối lá tản nhiệt đồng đối xứng tại 2 cửa gió sau |
| `ram_shield` | Nắp chắn kim loại bảo vệ RAM | RAM Metal Shielding Can | Linh kiện rời | 76.0 × 68.0 × 4.2 | **Tái dựng tham chiếu** | Lenovo HMM RAM Shielding Removal Video HT515879 |
| `ram_slot_1` | Thanh RAM DDR5 SO-DIMM #1 | DDR5 SO-DIMM Stick #1 | Linh kiện rời | 69.6 × 30.0 × 3.8 | **Đã xác minh (Verified)** | JEDEC SO-DIMM 262-pin DDR5 Standard ($69.6 \times 30.0\text{ mm}$) |
| `ram_slot_2` | Thanh RAM DDR5 SO-DIMM #2 | DDR5 SO-DIMM Stick #2 | Linh kiện rời | 69.6 × 30.0 × 3.8 | **Đã xác minh (Verified)** | JEDEC SO-DIMM 262-pin DDR5 Standard ($69.6 \times 30.0\text{ mm}$) |
| `ssd_primary` | Ổ cứng SSD M.2 2280 NVMe #1 | Primary M.2 PCIe 4.0 SSD | Linh kiện rời | 80.0 × 22.0 × 3.5 | **Đã xác minh (Verified)** | JEDEC M.2 2280 Form Factor Standard ($80 \times 22\text{ mm}$) |
| `ssd_secondary`| Ổ cứng SSD M.2 NVMe #2 | Secondary M.2 PCIe SSD | Linh kiện rời | 80.0 × 22.0 × 3.5 | **Đã xác minh (Verified)** | JEDEC M.2 2280 Form Factor Standard ($80 \times 22\text{ mm}$) |
| `wifi_card` | Card mạng không dây Wi-Fi 6 | Intel Wi-Fi 6 M.2 2230 Card| Bo mạch chủ | 30.0 × 22.0 × 2.4 | **Đã xác minh (Verified)** | Intel M.2 2230 Form Factor Standard ($30 \times 22\text{ mm}$) |
| `battery_pack` | Bộ pin Lithium-Polymer 60Wh | 60Wh 4-Cell Li-ion Battery | Nguồn điện | 225.0 × 75.0 × 7.5 | **Đã xác minh (Verified)** | Lenovo PSREF / HMM Pin Model L23M4PC0 (60Wh, 15.36V) |
| `speaker_left` | Loa âm thanh nổi trái | Left Stereo Speaker (2W) | Âm thanh | 55.0 × 25.0 × 7.0 | **Tái dựng tham chiếu** | Lenovo HMM Speaker FRU (2W Nahimic Audio) |
| `speaker_right`| Loa âm thanh nổi phải | Right Stereo Speaker (2W) | Âm thanh | 55.0 × 25.0 × 7.0 | **Tái dựng tham chiếu** | Lenovo HMM Speaker FRU (2W Nahimic Audio) |
| `bottom_cover` | Vỏ nắp đáy máy (Mặt D) | Lower Case / Base Cover | Khung & Vỏ | 359.86 × 258.7 × 10.5 | **Đã xác minh (Verified)** | Lenovo PSREF Base Dimensions & HMM 10-screw pattern |
| `rubber_feet` | Dải chân cao su chống trượt | Non-slip Rubber Feet | Khung & Vỏ | 320.0 × 8.0 × 2.5 | **Tái dựng tham chiếu** | Teardown & D-Cover Inspection (1 dải trước, 2 gờ sau) |

---
**Quy ước định danh trạng thái:**
- **Đã xác minh (Verified):** Kích thước bao hoặc thông số kỹ thuật được xác định trực tiếp từ tài liệu công bố của Lenovo (PSREF/HMM) hoặc chuẩn công nghiệp chuẩn hóa (JEDEC, Intel BGA).
- **Tái dựng tham chiếu (Reconstructed Reference):** Hình học 3D, đường cong, vát mép, biên dạng uốn ống đồng, hoặc hốc cắt phức tạp được phục dựng dựa trên tỉ lệ cơ học từ video tháo máy HT515879 và ảnh tháo máy thực tế.
