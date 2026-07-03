import gsap from "gsap";

/**
 * CHỨC NĂNG: Tạo hiệu ứng trượt Sidebar từ trái qua phải khi xuất hiện.
 */
export function animateSidebarIn(element: Element) {
    return gsap.fromTo(
        element,
        { x: -18, opacity: 0 }, // Điểm đầu: lệch trái 18px, ẩn hoàn toàn
        { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" } // Điểm cuối: về vị trí chuẩn, mượt mà trong 0.45s
    );
}

/**
 * CHỨC NĂNG: Tạo hiệu ứng chuyển cảnh trượt từ phải qua trái khi đổi câu hỏi.
 */
export function animateQuestionTransition(element: Element) {
    return gsap.fromTo(
        element,
        { x: 18, opacity: 0 }, // Điểm đầu: lệch phải 18px, ẩn hoàn toàn
        { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" } // Điểm cuối: về vị trí chuẩn trong 0.35s
    );
}

/**
 * CHỨC NĂNG: Tạo hiệu ứng nhấp nháy/phóng to cảnh báo khi đồng hồ sắp hết giờ (Timer Warning).
 */
export function animateTimerWarning(element: Element) {
    return gsap.to(element, {
        color: "#f87171", // Chuyển sang màu đỏ nhạt (Tailwind red-400)
        scale: 1.035, // Phóng to nhẹ 3.5%
        duration: 0.25,
        yoyo: true, // Kết hợp repeat để đảo ngược hiệu ứng (co giãn về kích thước/màu cũ)
        repeat: 1, // Tổng cộng chạy 2 lượt (phóng to -> thu nhỏ lại)
        ease: "power1.inOut",
    });
}

/**
 * CHỨC NĂNG: Tạo hiệu ứng xuất hiện so le (Stagger) cho danh sách các hàng kết quả (Result Rows).
 */
export function animateResultRows(elements: Element[]) {
    return gsap.fromTo(
        elements,
        { y: 10, opacity: 0 }, // Điểm đầu: hơi lệch xuống dưới 10px, ẩn
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.28, ease: "power1.out" } // Điểm cuối: các hàng xuất hiện cách nhau 0.06s (thác đổ)
    );
}