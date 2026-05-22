# TODO - Nâng cấp UI/UX Dashboard

## Plan (đã duyệt: hướng 2)

### 1) Khảo sát & chuẩn hóa
- [x] Đọc `app/dashboard/layout.tsx`, `app/dashboard/student/page.tsx`, `app/dashboard/teacher/page.tsx`
- [ ] (Nếu cần) rà thêm các component UI hiện có trong `components/ui/*`

### 2) Tạo component reusable cho dashboard
- [ ] Tạo `components/dashboard/SectionHeader.tsx`
- [ ] Tạo `components/dashboard/StatCard.tsx`
- [ ] (Tuỳ chọn) Tạo `components/dashboard/DashboardCard.tsx` để glow/border thống nhất

### 3) Nâng cấp layout/dashboard shell
- [ ] Thêm active state cho nav items trong `app/dashboard/layout.tsx`
- [ ] Chuẩn hóa focus-visible/focus ring cho Link/Button trong sidebar
- [ ] Đồng bộ spacing/typography header & main

### 4) Nâng cấp Student page
- [x] Dùng `StatCard` thay cho div thô
- [x] Đồng bộ style section headers (SectionHeader)
- [x] Tối ưu affordance clickable cho card khóa học (focus ring + role button)


### 5) Nâng cấp Teacher page
- [ ] Đồng bộ style section headers
- [ ] Chuẩn hóa CTA button & hover/focus
- [ ] Thêm “View all”/link nhỏ nếu phù hợp (không ảnh hưởng backend)

### 6) Kiểm thử
- [ ] Chạy `npm run lint`
- [ ] Chạy `npm run build`
- [ ] Kiểm tra responsive: desktop sidebar + mobile Sheet

