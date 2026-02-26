document.addEventListener("DOMContentLoaded", () => {
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	const showAll = () => {
		document.querySelectorAll(".banner .background, .banner_left > *, .banner_right > *, .banner_right > .banner_right_img")
			.forEach(el => {
				el.style.opacity = 1;
				el.style.visibility = "visible";
			});
	};

	if (reduceMotion) {
		showAll();
		return;
	}

	// Стартовые состояния (без скрытия — скрытие уже в CSS)
	gsap.set(".banner .background", {
		scale: 1.03,
		transformOrigin: "50% 50%"
	});

	// LEFT: слева + чуть ниже + агрессивный scale
	gsap.set(".banner_left > *", {
		x: -56,
		y: 10,
		scale: 0.92,
		transformOrigin: "0% 50%"
	});

	// RIGHT: справа + чуть ниже + агрессивный scale
	gsap.set(".banner_right", {
		x: 64,
		y: 8,
		scale: 0.92,
		transformOrigin: "50% 50%",
		force3D: true
	});
	gsap.set(".banner_right_img", {
		x: 64,
		y: 8,
		scale: 0.92,
		transformOrigin: "50% 50%",
		force3D: true
	});

	// Иконки справа — чуть сильнее “поп”
	gsap.set(".banner_icon_top", {
		x: 18,
		y: -14,
		scale: 0.85,
		rotate: -8,
		force3D: true
	});
	gsap.set(".banner_icon_bottom", {
		x: 18,
		y: 14,
		scale: 0.85,
		rotate: 8,
		force3D: true
	});

	// Для “премиум” ощущений: короткий стаггер, разные ease
	const tl = gsap.timeline({
		defaults: {
			duration: 0.9,
			ease: "power3.out"
		}
	});

	// 1) Фон
	tl.to(".banner .background", {
		autoAlpha: 1,
		scale: 1,
		duration: 0.85,
		ease: "power2.out"
	}, 0);

	// 2) Правая колонка — начинает чуть раньше (или позже — можно менять)
	tl.to(".banner_right", {
		autoAlpha: 1,
		x: 0,
		y: 0,
		scale: 1,
		duration: 1.05,
		ease: "back.out(1.25)" // мягкий overshoot
	}, 0.10);

	tl.to(".banner_right_img", {
		autoAlpha: 1,
		x: 0,
		y: 0,
		scale: 1,
		duration: 1.15,
		ease: "back.out(1.25)" // мягкий overshoot
	}, 0.10);

	// 3) Левая колонка — каскадом, но именно слева
	tl.to(".banner_left > *", {
		autoAlpha: 1,
		x: 0,
		y: 0,
		scale: 1,
		stagger: {
			each: 0.09,
			from: "start"
		},
		duration: 0.85,
		ease: "back.out(1.18)" // менее “прыгающее”, чем у правой
	}, 0.14);

	// 4) Иконки справа — отдельный акцент (поп)
	tl.to(".banner_icon_top", {
		autoAlpha: 1,
		x: 0,
		y: 0,
		scale: 1,
		rotate: 0,
		duration: 0.65,
		ease: "back.out(1.8)"
	}, 0.38);

	tl.to(".banner_icon_bottom", {
		autoAlpha: 1,
		x: 0,
		y: 0,
		scale: 1,
		rotate: 0,
		duration: 0.65,
		ease: "back.out(1.8)"
	}, 0.52);

	// 5) Тонкая “сборка” в конце (очень лёгкая)
	tl.fromTo(".banner_wrapper", {
			scale: 1
		}, {
			scale: 1,
			duration: 0.001
		},
		0.0
	);

	// Чистим will-change (по желанию)
	tl.set(".banner_left > *, .banner_right > *, .banner_right_img", {
		clearProps: "willChange"
	}, "+=0.05");
});

//Калькулятор выплат


// Убедитесь, что ScrollTrigger подключен
gsap.registerPlugin(ScrollTrigger);


// Паралакс эффект для блока 

gsap.from(".why_us .grid_container", {
	opacity: 0,
	y: 150,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".why_us .grid_container",
		start: "top 100%",
		end: "top",
		scrub: true,
		once: true,
	},
});


// --ДОХОД --
gsap.from(".dohod_wrap, .products .grid_container", {
	scrollTrigger: {
		trigger: ".dohod_wrap, .products .grid_container", // Триггер - сам элемент
		start: "top 100%", // Когда верх элемента достигает 100% высоты окна
		end: "top", // Конечная точка анимации, когда низ элемента достигает верха окна
		scrub: true, // Для плавной анимации во время прокрутки
		markers: false, // Убираем маркеры для отладки
		toggleActions: "play none none none", // Когда триггер активирован
	},
	opacity: 0, // Начальная прозрачность
	y: 50, // Смещение по оси Y
	duration: 1, // Длительность анимации
	ease: "power3.out", // Эффект easing для плавного движения
});

gsap.from(".dohod_right h2, .dohod_subtitle", {
	scrollTrigger: {
		trigger: ".dohod_right", // Триггер - сам элемент
		start: "top 60%", // Когда верх элемента достигнет 80% высоты окна
		//		end: "bottom top", // Когда низ элемента достигнет верха окна
		once: true, // Анимация сработает только один раз, когда элемент попадет в видимую область
		toggleActions: "play none none none", // Когда триггер активирован
	},
	opacity: 0, // Начальная прозрачность
	y: 50, // Смещение по оси Y
	duration: 1, // Длительность анимации
	ease: "power3.out", // Эффект easing для плавного движения
	stagger: 0.2 // Задержка между анимациями элементов (поочередное появление)
});

// Анимация для .dohod_list_item, элементы будут появляться поочередно
gsap.from(".dohod_list_item", {
	scrollTrigger: {
		trigger: ".dohod_list", // Триггер - список элементов
		start: "top 60%", // Когда верх списка достигнет 80% высоты окна
		//		end: "bottom top", // Когда низ списка достигнет верха окна
		once: true, // Анимация сработает только один раз, когда элемент попадет в видимую область
		toggleActions: "play none none none", // Когда триггер активирован
	},
	opacity: 0, // Начальная прозрачность
	y: 50, // Смещение по оси Y
	duration: 0.5, // Длительность анимации
	ease: "power3.out", // Эффект easing для плавного движения
	stagger: 0.2 // Задержка между анимациями элементов (поочередное появление)
});



//-------------------




//-------------------

gsap.from(".products_tabs_left", {
	opacity: 0,
	scale: .7,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".products_tabs_left",
		start: "top 98%",
		end: "top",
		scrub: true,
		once: true,
	},
});

gsap.from(".products_tabs_right", {
	opacity: 0,
	scale: 1.2,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".tabs_catalog",
		start: "top 85%",
		end: "top",
		scrub: true,
		once: true,
	},
});



//-------------------

gsap.from(".why_us_title", {
	opacity: 0,
	scale: 1.2,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".why_us_title",
		start: "top 95%",
		end: "bottom top",
		scrub: true,
		once: true,
	},
});


///----solutions----


gsap.from(".solutions_box", {
	x: -200,
	opacity: 0,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".solutions_box",
		start: "top 95%",
		end: "left top",
		scrub: true,
		once: true,
	},
});


gsap.from(".solutions_title", {
	opacity: 0,
	scale: 1.2,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".solutions_title",
		start: "top 95%",
		end: "bottom top",
		scrub: true,
		once: true,
	},
});


//-------logistika_box------------
gsap.from(".logistika_box", {
	opacity: 0,
	y: 250,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".logistika_box",
		start: "top 100%",
		end: "top",
		scrub: true,
		once: true,
	},
});


gsap.from(".logistika_left", {
  opacity: 0,
  x: -300,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".logistika_left",
    start: "top 100%",
    end: "top 50%",
    scrub: true,
    once: true,
  },
});

gsap.from(".logistika_center", {
  opacity: 0,
  x: -450,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".logistika_center",
    start: "top 100%",
    end: "top 50%",
    scrub: true,
    once: true,
  },
});

gsap.from(".logistika_right", {
  opacity: 0,
  x: -300,
  duration: 1,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".logistika_center",
    start: "top 100%",
    end: "top 50%",
    scrub: true,
    once: true,
  },
});



//-------------------



//  Для формы

gsap.from(".leave_request_left", {
	opacity: 0,
	x: -200,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".leave_request_left",
		start: "top 90%",
		end: "top",
		scrub: true,
		once: true,
	},
});

gsap.from(".leave_request_form", {
	opacity: 0,
	x: 200,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".leave_request_form",
		start: "top 90%",
		end: "top",
		scrub: true,
		once: true,
	},
});
