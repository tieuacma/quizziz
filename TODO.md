# TODO - Quiz Editor Updates

## Checklist

- [ ] Confirm xóa câu hỏi bằng hộp thoại xác nhận (UX đúng yêu cầu)
- [x] Chỉnh UI edit: có nút **Save** và **Cancel** khi chỉnh câu hỏi

- [ ] Save của nút edit: cập nhật question trong quiz.json theo `questionId` (partial update)
- [ ] Sửa edit reading sub: hỗ trợ multi-choice / điền khuyết / đúng-sai
- [ ] Save quiz: validate trước khi lưu
  - [ ] Kiểm tra mục nào bị trống
  - [ ] Kiểm tra đã chọn đáp án đúng
- [ ] Hiển thị lỗi đỏ sát dưới trong card question
- [ ] Nếu có lỗi khi bấm Save quiz: tự scroll xuống câu hỏi lỗi gần nhất
- [ ] Nếu không có lỗi: lưu toàn bộ questions kể cả question mới vừa tạo
