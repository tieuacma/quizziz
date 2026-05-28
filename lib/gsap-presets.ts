import gsap from "gsap";

export function animateSidebarIn(element: Element) {
	return gsap.fromTo(
		element,
		{ x: -18, opacity: 0 },
		{ x: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
	);
}

export function animateQuestionTransition(element: Element) {
	return gsap.fromTo(
		element,
		{ x: 18, opacity: 0 },
		{ x: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
	);
}

export function animateTimerWarning(element: Element) {
	return gsap.to(element, {
		color: "#f87171",
		scale: 1.035,
		duration: 0.25,
		yoyo: true,
		repeat: 1,
		ease: "power1.inOut",
	});
}

export function animateResultRows(elements: Element[]) {
	return gsap.fromTo(
		elements,
		{ y: 10, opacity: 0 },
		{ y: 0, opacity: 1, stagger: 0.06, duration: 0.28, ease: "power1.out" },
	);
}
