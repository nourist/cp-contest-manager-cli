# Tổng Kết Dự Án: Competitive Programming Contest Manager (CPM)

Dự án **cp-contest-manager-cli** (`cpm`) là một công cụ dòng lệnh (CLI tool) được xây dựng bằng Node.js, nhằm mục đích quản lý và sắp xếp các giải pháp cho các cuộc thi lập trình thi đấu (Competitive Programming). Công cụ này đóng vai trò như một kho lưu trữ tập trung giúp người dùng dễ dàng lưu trữ, truy cập, quản lý và chia sẻ các bài giải của mình.

## 1. Công nghệ sử dụng
- **Ngôn ngữ**: JavaScript (Node.js) - ES Modules (`"type": "module"`).
- **Thư viện chính**:
  - `commander`: Xây dựng và quản lý các câu lệnh CLI.
  - `inquirer` & `inquirer-search-list`: Tạo các menu tương tác và danh sách tìm kiếm trong terminal.
  - `colors`: Làm đẹp và tạo màu cho đầu ra của terminal.
  - `cli-table`: Hiển thị dữ liệu dưới dạng bảng trực quan.
  - `fs-extra`: Quản lý, thao tác thư mục và tệp tin mở rộng.
  - `app-root-path`: Lấy đường dẫn gốc của dự án.

## 2. Tính năng chính (Commands)
Công cụ cung cấp nhiều lệnh hữu ích thông qua cú pháp `cpm <command> [options]`:
- `config`: Thiết lập thư mục lưu trữ (`contest`) và xuất (`export`) của dự án.
- `list`: Hiển thị danh sách tất cả các cuộc thi (có thể lọc theo trạng thái đã hoàn thành - AC).
- `create`: Tạo một cuộc thi mới (hỗ trợ tạo các thư mục con cho mỗi bài toán và tự động tạo các tệp input/output).
- `delete`: Xóa một cuộc thi khỏi kho lưu trữ.
- `mark`: Đánh dấu một cuộc thi là đã hoàn thành (AC).
- `unmark`: Bỏ đánh dấu hoàn thành của một cuộc thi.
- `rename`: Đổi tên một cuộc thi.
- `open`: Mở thư mục của một cuộc thi cụ thể bằng trình soạn thảo VS Code.
- `export`: Xuất (export) mã nguồn và giải pháp của các cuộc thi để dễ dàng chia sẻ.
- `workspace`: Mở toàn bộ không gian làm việc (workspace chứa tất cả cuộc thi) bằng VS Code.

## 3. Cấu trúc mã nguồn
Mã nguồn chính nằm trong thư mục `src/`, được tổ chức logic như sau:
- `index.js`: Điểm vào (entry point) của ứng dụng CLI. Nơi khởi tạo cấu hình `commander` và đăng ký các lệnh.
- `actions/`: Chứa các hàm thực thi logic chính cho từng lệnh (ví dụ: tạo, xóa, đổi tên, v.v.).
- `commands/`: Nơi định nghĩa chi tiết cấu trúc các câu lệnh CLI và liên kết với các `actions` tương ứng.
- `config/`: Chứa các thiết lập và cấu hình hệ thống hoặc dự án.
- `constants/`: Định nghĩa các hằng số được sử dụng chung trong toàn bộ ứng dụng.
- `template/`: Chứa các tệp mẫu (templates) để sinh ra code hoặc cấu trúc thư mục mặc định khi người dùng sử dụng lệnh `create`.
- `utils/`: Các hàm tiện ích dùng chung (helper functions) như xử lý đường dẫn, kiểm tra file/thư mục, in ra giao diện, v.v.

## 4. Cài đặt và sử dụng
- Dự án được định cấu hình để chạy toàn cầu trên hệ thống người dùng (thông qua `"bin": { "cpm": "./src/index.js" }` trong `package.json`).
- Có thể chạy trực tiếp trên môi trường phát triển qua `npm start <command>` hoặc cài đặt toàn cầu bằng lệnh `npm i -g .`.

---
*Tóm lại, **cpm** là một công cụ mạnh mẽ, được tổ chức mã nguồn tốt, hướng tới đối tượng là những lập trình viên tham gia Competitive Programming, giúp họ tối ưu hóa luồng công việc (workflow) và tập trung vào việc giải quyết thuật toán thay vì quản lý thư mục thủ công.*
