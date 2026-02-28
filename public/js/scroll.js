document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollTrigger);

	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	// === 1) LENIS ===
	const lenis = new Lenis({
		// “премиум” — чуть длиннее и мягче
		duration: reduceMotion ? 0 : 1.35,
		easing: (t) => 1 - Math.pow(1 - t, 4),
		smooth: !reduceMotion,
		smoothTouch: false, // если надо — включай true (но чаще на мобиле спорно)
		wheelMultiplier: 1,
		touchMultiplier: 1.1,
		normalizeWheel: true
	});

	// === 2) RAF LOOP (вместо gsap.ticker) ===
	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	// === 3) SCROLLER PROXY (правильная интеграция) ===
	// Если у тебя скролл по всему документу — оставляем body.
	// Если ты скроллишь контейнер (например .scroll-container) — укажи его.
	const scroller = document.documentElement; // или document.body

	ScrollTrigger.scrollerProxy(scroller, {
		scrollTop(value) {
			if (arguments.length) {
				// мгновенная установка позиции (без анимации)
				lenis.scrollTo(value, {
					immediate: true
				});
			}
			return lenis.scroll;
		},
		getBoundingClientRect() {
			return {
				top: 0,
				left: 0,
				width: window.innerWidth,
				height: window.innerHeight
			};
		},
		// pinType помогает фикс-пинам на трансформ-скролле
		pinType: "transform"
	});

	// Lenis -> ScrollTrigger
	lenis.on("scroll", ScrollTrigger.update);

	// ScrollTrigger refresh должен синкаться с Lenis
	ScrollTrigger.addEventListener("refresh", () => lenis.resize());
	ScrollTrigger.defaults({
		scroller
	});

	// === 4) ПРАВИЛЬНЫЙ REFRESH ===
	// после загрузки шрифтов/картинок полезно обновить
	const refresh = () => ScrollTrigger.refresh();
	window.addEventListener("load", refresh);
	window.addEventListener("resize", () => {
		lenis.resize();
		ScrollTrigger.refresh();
	});

	// === 5) ЯКОРЯ (#hash) — чтобы не “рвало”
	if (location.hash) {
		const el = document.querySelector(location.hash);
		if (el) lenis.scrollTo(el, {
			immediate: true
		});
	}
	window.addEventListener("hashchange", () => {
		const el = document.querySelector(location.hash);
		if (el) lenis.scrollTo(el, {
			duration: 1.1
		});
	});

	// === 6) ПРИМЕР АНИМАЦИИ ===
//	gsap.to(".box", {
//		y: 200,
//		ease: "none",
//		scrollTrigger: {
//			trigger: ".box",
//			start: "top 80%",
//			end: "bottom 20%",
//			scrub: true
//		}
//	});

	// ВАЖНО: после всех сетапов — refresh
	ScrollTrigger.refresh();
});
