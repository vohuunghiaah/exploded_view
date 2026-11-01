# Lenovo LOQ 15IAX9 — Interactive 3D Exploded View & Hardware Explorer

Ứng dụng web 3D tương tác hoàn chỉnh cho phép khám phá cấu trúc phần cứng, phân rã linh kiện (Exploded View), mô phỏng khí động học tản nhiệt và hướng dẫn tháo lắp laptop gaming **Lenovo LOQ 15IAX9** (Thế hệ 2024, Machine Type 83GS).

---

## 1. Điểm Nổi Bật & Tính Năng Cốt Lõi

### 5 Chế Độ Hiển Thị 3D Toàn Diện:
- **Chế độ A — Assembled View:** Chiêm ngưỡng laptop hoàn chỉnh ở màu sơn Luna Grey cao cấp. Hỗ trợ xoay tự do 360°, phóng to/thu nhỏ, điều chỉnh góc mở bản lề màn hình từ 0° (gập kín) đến 180° (mở phẳng).
- **Chế độ B — Exploded View:** Thanh trượt từ 0% đến 100% điều khiển trực tiếp chuyển động cơ học mượt mà của hơn 20 linh kiện riêng biệt theo đúng không gian lắp ráp.
- **Chế độ C — Component Inspector:** Nhấp chọn bất kỳ bộ phận nào để kích hoạt camera zoom điện ảnh, hiển thị bảng thông số kỹ thuật đã xác minh, mã FRU/CRU, trích dẫn tài liệu Lenovo, cùng tính năng cô lập linh kiện (Isolate) và tùy chỉnh độ mờ vỏ máy.
- **Chế độ D — Assembly / Disassembly Animation:** Mô phỏng quy trình tháo rời và lắp ráp 10 bước chuẩn theo tài liệu kỹ thuật **Lenovo Hardware Maintenance Manual (HMM)** với đầy đủ điều khiển Play, Pause, Step Next/Prev, đảo chiều và chỉnh tốc độ 0.25x - 2.0x.
- **Chế độ E — X-Ray View:** Kỹ thuật vật liệu trong suốt hiển thị xuyên thấu khung vỏ ngoài, để lộ rõ bo mạch chủ L-Shape, đế CPU/GPU, 2 khe RAM DDR5, 2 khe SSD M.2, pin 60Wh và cụm tản nhiệt Hyperchamber.

### Hệ Thống Hoạt Ảnh 3D Cao Cấp (Advanced Animation System):
- **ANIM-01 (Cinematic Introduction):** Đoạn mở đầu điện ảnh với camera quét quanh máy, màn hình tự động mở lên góc 115° và tiêu đề giới thiệu sản phẩm xuất hiện (có thể bỏ qua bất kỳ lúc nào).
- **ANIM-02 (Advanced Exploded View):** Quỹ đạo chuyển động cơ học không va chạm, nội suy mượt mà qua GSAP.
- **ANIM-03 (Reverse Assembly):** Tái lắp ráp chính xác tuyệt đối về vị trí và góc quay ban đầu mà không bị trôi lệch tọa độ.
- **ANIM-04 (Component Focus):** Điều hướng camera tập trung mượt mà vào linh kiện được chọn, làm nổi bật viền cyan và giảm sáng các bộ phận xung quanh.
- **ANIM-05 (Cooling System Simulation):** Hai quạt lồng sóc quay quanh trục Y ở các mức tốc độ thực (1800, 2800, 4200 RPM), kèm hệ thống hạt luồng khí lạnh hút từ đáy và luồng khí nóng phụt ra hai cụm lá tản nhiệt đồng phía sau.
- **ANIM-06 (X-Ray Transition):** Chuyển đổi trơn tru giữa lớp vỏ nhám mờ và kính quang học xuyên thấu.
- **ANIM-07 (RAM & SSD Upgrade Guide):** Mô phỏng chi tiết cơ cấu lẫy khóa đàn hồi và góc cắm chéo 30° chuẩn kỹ thuật Lenovo.
- **ANIM-08 (Camera Showcase Presets):** Các góc quay định sẵn chuyển đổi mượt: Mặt trước, Mặt sau, Nhìn trên, Mặt đáy, Cạnh trái, Cạnh phải, Góc 3/4 Isometric, Trọng tâm Mainboard, Trọng tâm Tản nhiệt.
- **ANIM-09 (Hover & Selection Feedback):** Phản hồi tức thì khi di chuột và nhấp chọn linh kiện, cập nhật con trỏ tương tác.
- **ANIM-10 (Guided Technical Tour):** Chuyến tham quan kỹ thuật tự động 10 cảnh có phụ đề thuyết minh tiếng Việt và đồng hồ tiến trình.

---

## 2. Công Nghệ Triển Khai

- **Giao diện người dùng:** React 19 + TypeScript + Vite + Tailwind CSS.
- **Hiển thị 3D & WebGL:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`).
- **Chuyển động & Timeline:** GSAP (GreenSock Animation Platform) kết hợp slerp/lerp nội suy khung hình 60 FPS.
- **Định dạng tài sản 3D:** GLB / glTF 2.0 chuẩn PBR (Physically Based Rendering), tối ưu hóa lưới dưới 1MB giúp tải nhanh tức thì trên web.
- **Tái tạo mô hình 3D:** Script Node.js sử dụng Three.js và GLTFExporter (`scripts/generate_loq_model.js`).
- **Kiểm thử tự động:** Playwright kiểm thử đầu cuối (End-to-End) trên trình duyệt Chromium WebGL.

---

## 3. Cấu Trúc Dự Án

```
exploded_view/
├── docs/
│   ├── HARDWARE_SPECS.md        # Thông số kỹ thuật chi tiết từ Lenovo PSREF & HMM
│   ├── VERIFICATION_MATRIX.md   # Ma trận xác thực 20+ linh kiện chính hãng
│   ├── LIMITATIONS.md           # Báo cáo giới hạn và độ chính xác kỹ thuật
│   └── TEST_RESULTS.md          # Báo cáo kết quả kiểm thử tự động Playwright (8/8 Pass)
├── public/
│   └── models/
│       └── lenovo_loq_15iax9.glb # Tệp mô hình 3D nhị phân tiêu chuẩn (728 KB)
├── scripts/
│   └── generate_loq_model.js    # Mã nguồn tạo/tái tạo mô hình 3D từ thông số cơ khí
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── CanvasContainer.tsx   # Cảnh dựng 3D, ánh sáng studio, bóng đổ
│   │   │   ├── LaptopModel.tsx       # Tải GLB, quản lý biến đổi phân rã & vật liệu
│   │   │   ├── CoolingAnimation.tsx  # Quạt quay ly tâm & luồng hạt tản nhiệt
│   │   │   └── CameraManager.tsx     # Điều khiển camera điện ảnh, presets & tour
│   │   └── ui/
│   │       ├── Header.tsx            # Thanh điều hướng và chuyển đổi chế độ
│   │       ├── LeftSidebar.tsx       # Bảng thanh trượt, cây linh kiện, tốc độ quạt
│   │       ├── RightSidebar.tsx      # Bảng soi thông số linh kiện (Inspector)
│   │       ├── BottomBar.tsx         # Thanh tiến trình tháo lắp HMM & góc camera
│   │       ├── TourOverlay.tsx       # Giao diện Tour kỹ thuật 10 cảnh
│   │       ├── CinematicIntroOverlay.tsx # Thẻ tiêu đề giới thiệu mở đầu
│   │       ├── RAMSSDModal.tsx       # Hướng dẫn thao tác tháo lắp RAM & SSD góc 30°
│   │       └── PerformanceMonitor.tsx# Giám sát FPS và chỉ số dựng hình thời gian thực
│   ├── data/
│   │   ├── components.ts        # Cơ sở dữ liệu linh kiện đã xác minh
│   │   ├── assemblySteps.ts     # Quy trình tháo lắp 10 bước chuẩn HMM
│   │   └── tourScenes.ts        # Kịch bản 10 cảnh tham quan kỹ thuật
│   ├── types/
│   │   └── hardware.ts          # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx                  # Bộ điều phối trạng thái ứng dụng chính
│   └── main.tsx
├── tests/
│   ├── e2e/
│   │   └── explorer.spec.ts     # Bộ kịch bản kiểm thử Playwright toàn diện
│   └── screenshots/             # 9 ảnh chụp màn hình nghiệm thu thực tế
├── playwright.config.ts         # Cấu hình Playwright WebGL
└── package.json
```

---

## 4. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu hệ thống:
- Node.js phiên bản 18+ trở lên.
- Trình duyệt web hỗ trợ WebGL 2.0 (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

### Cài đặt và khởi chạy máy chủ cục bộ:
```bash
# 1. Di chuyển vào thư mục dự án
cd c:\dev\exploded_view

# 2. Cài đặt các thư viện phụ thuộc (nếu chưa cài)
npm install

# 3. Khởi chạy máy chủ phát triển
npm run dev
```
Mở trình duyệt tại địa chỉ: `http://localhost:5173`

### Biên dịch sản xuất (Production Build):
```bash
npm run build
npm run preview
```

### Tạo lại mô hình 3D GLB từ mã nguồn:
```bash
npm run generate:model
```

### Chạy bộ kiểm thử tự động Playwright & chụp ảnh màn hình:
```bash
npm run test
```

---

## 5. Danh Sách Ảnh Chụp Nghiệm Thu (Screenshots)

Các ảnh chụp màn hình nghiệm thu được lưu trữ trực tiếp trong thư mục `tests/screenshots/`:
- `01_assembled_view.png` — Chế độ A: Laptop lắp ráp hoàn chỉnh ở góc 3/4.
- `02_cinematic_intro.png` — ANIM-01: Đoạn giới thiệu điện ảnh mở đầu sản phẩm.
- `03_exploded_view_100.png` — Chế độ B: Phân rã 100% toàn bộ các nhóm linh kiện.
- `04_component_inspector_motherboard.png` — Chế độ C: Soi chi tiết linh kiện Bo mạch chủ và thông số xác minh.
- `05_xray_mode.png` — Chế độ E: Nhìn xuyên qua lớp vỏ máy vào cấu trúc bên trong.
- `06_cooling_system_simulation.png` — ANIM-05: Hệ thống tản nhiệt Hyperchamber, quạt quay và hạt luồng khí.
- `07_assembly_step_by_step.png` — Chế độ D: Hoạt ảnh tháo lắp linh kiện từng bước chuẩn Lenovo HMM.
- `08_ram_ssd_upgrade_guide.png` — ANIM-07: Hướng dẫn nâng cấp RAM DDR5 & SSD M.2 góc nghiêng 30°.
- `09_guided_technical_tour.png` — ANIM-10: Chuyến tham quan kỹ thuật có thuyết minh 10 cảnh.

---

## 6. Nguồn Dữ Liệu Tham Khảo Kỹ Thuật
1. **Lenovo PSREF (Product Specifications Reference):** LOQ 15IAX9 (Machine Type 83GS).
2. **Lenovo Hardware Maintenance Manual (HMM):** LOQ 15 Series (83GS) — CRU/FRU Replacement Procedures.
3. **Lenovo Official Removal and Replacement Instructional Videos:** HT515879.
