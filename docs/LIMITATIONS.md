# Báo Cáo Giới Hạn & Độ Chính Xác Kỹ Thuật (Technical Limitations Report)
## Lenovo LOQ 15IAX9 (Machine Type 83GS) — Interactive 3D Exploded View

### 1. Phạm vi và Cơ sở Dữ liệu
- Ứng dụng này là một mô hình trực quan hóa 3D tương tác kỹ thuật cao được dựng lại dựa trên thông số chính hãng của **Lenovo PSREF**, **Lenovo Hardware Maintenance Manual (HMM)** cho dòng máy LOQ 15IAX9 (Machine Type 83GS), và tài liệu video hướng dẫn tháo lắp linh kiện Lenovo Customer Replaceable Unit (CRU) / Field Replaceable Unit (FRU).
- **Lưu ý pháp lý và kỹ thuật:** Mô hình này **không phải là bản vẽ CAD gốc từ bộ phận R&D của Lenovo**, vì Lenovo không công khai bản vẽ CAD sản xuất cơ khí chính xác theo chuẩn STEP/IGES. Toàn bộ hình học 3D trong ứng dụng là mô hình tái dựng tham chiếu (engineering reconstructed asset) với độ chính xác kích thước tổng thể đạt chuẩn mm theo PSREF (359.86 × 258.7 × 21.9–23.9 mm).

### 2. Chi Tiết Về Linh Kiện Bên Trong
1. **Khối CPU và GPU:**
   - Vị trí vật lý của CPU và GPU trên mainboard tuân theo sơ đồ khối kiến trúc tản nhiệt Hyperchamber của LOQ Gen 9 (CPU nằm lệch trái, GPU nằm lệch phải gần trung tâm cụm tản nhiệt).
   - Die silicon và các tụ điện SMD xung quanh được mô hình hóa theo quy cách BGA thực tế.
2. **Hệ thống tản nhiệt Hyperchamber:**
   - Cụm ống đồng composite, lá tản nhiệt phía sau và hai quạt lồng sóc (blower fans) được thiết kế theo đúng luồng khí thực tế (hút đáy, thổi sau).
   - Mô phỏng luồng khí và gradient nhiệt độ trong ứng dụng là mô phỏng trực quan kỹ thuật (visual didactic simulation) nhằm mục đích giáo dục và minh họa luồng tản nhiệt, không phải là kết quả phân tích động lực học chất lưu (CFD) hay đo đạc nhiệt độ nhiệt kế hồng ngoại theo thời gian thực.
3. **RAM & Ổ cứng SSD:**
   - Mô phỏng chính xác cấu hình 2 khe DDR5 SO-DIMM có lồng chắn kim loại chống nhiễu điện từ (EMI shield) và 2 khe M.2 NVMe PCIe 4.0.
   - Thao tác cắm/rút mô phỏng chuẩn góc nghiêng 30 độ theo khuyến cáo bảo trì phần cứng Lenovo.
4. **Hệ thống ốc vít và ngàm nhựa:**
   - Ứng dụng tập trung vào trực quan hóa phân rã cấu trúc linh kiện (exploded view) và trình diễn kỹ thuật; các ngàm nhựa vi mô siêu nhỏ (micro-latches) dưới 0.2mm được tinh giản hình học nhằm đảm bảo hiệu năng dựng hình 60 FPS mượt mà trên trình duyệt WebGL.

### 3. Tối Ưu Hiệu Năng & Khả Năng Tương Thích
- Mô hình 3D được tối ưu hóa lưới (geometry optimization) và vật liệu chuẩn PBR (Physically Based Rendering) với các kênh BaseColor, Metallic, Roughness, Normal.
- Dung lượng asset GLB được nén gọn để tải nhanh qua mạng web mà vẫn đảm bảo tính sắc nét của các đường nét cơ khí, cổng kết nối và tem nhãn linh kiện.

