---
name: use-nexus
description: Kích hoạt toàn bộ năng lực của GitNexus để truy vấn, phân tích và triển khai code dựa trên sơ đồ Semantic Index của project.
---

# Use Nexus

## Instructions

Mỗi khi nhận nhiệm vụ, Agent PHẢI thực hiện quy trình sau thông qua GitNexus:

1. **Query Index**: Sử dụng `gitnexus analyze` hoặc lệnh tương đương để cập nhật trạng thái mới nhất của 378 nodes và 659 edges trong project.
2. **Context Verification**:
    - Trước khi sửa bất kỳ file nào, hãy truy vấn các "Edges" liên quan để xem file đó đang được import ở đâu.
    - Đảm bảo các thay đổi trong `quiz-service.ts` không làm gãy các "Flows" hiện có.
3. **Smart Refactoring**:
    - Khi di chuyển component (Phase 3), sử dụng GitNexus để tự động tìm và cập nhật toàn bộ đường dẫn import cũ sang `src/components/quiz-create/` hoặc `src/components/quiz-editor/`.
4. **Data Integrity**:
    - Tuân thủ nghiêm ngặt cấu trúc `correctAnswerId` và `timeLimit` đã được thiết kế trong Phase 1.
    - Kiểm tra tính đồng bộ giữa file `data/quiz.json` và các Server Actions.

## Examples

### Ví dụ 1: Truy vấn trước khi sửa

"Dựa trên @GitNexus, hãy liệt kê toàn bộ các file đang phụ thuộc vào `quiz-create/components.tsx` trước khi tôi thực hiện di chuyển chúng."

### Ví dụ 2: Sửa lỗi logic dựa trên Flow

"Flow số 5 đang gặp lỗi không lưu được thời gian câu hỏi. Hãy dùng GitNexus để trace từ UI đến `updateQuizAction` và tìm điểm nghẽn."
