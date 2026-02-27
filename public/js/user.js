$(document).ready(function () {

	$('.humb').click(function () {
		$('.header_nav').toggleClass('header_nav_open');
		$('.humb').toggleClass('active');
		$('body').toggleClass('no_scroll');
		$('html').toggleClass('no_scroll');

		if ($('.js-nav-curtain').hasClass('curtain-up')) {
			$('.js-nav-curtain').removeClass('curtain-up');
			$('.site-nav__curtain').addClass('curtain-down');
		} else {
			$('.js-nav-curtain').addClass('curtain-up');
			$('.site-nav__curtain').removeClass('curtain-down');
		}
	});

	$('.nav__list-item').click(function () {
		$('.js-nav-curtain').removeClass('curtain-up');
		$('.site-nav__curtain').removeClass('curtain-down');
		$('body').removeClass('no_scroll');
		$('body').removeClass('nav-active');
		$('html').removeClass('no_scroll');
		$('.humb').removeClass('active');

	});

	const header = document.querySelector('header');
	window.addEventListener('scroll', () => {
		if (window.scrollY > 0) {
			header.classList.add('header_scroll');
		} else {
			header.classList.remove('header_scroll');
		}
	});

	Navigation
	var app = function () {
		var body = undefined;
		var menu = undefined;
		var menuItems = undefined;
		var init = function init() {
			body = document.querySelector('body');
			menu = document.querySelector('.humb');
			menuItems = document.querySelectorAll('.nav__list-item');
			applyListeners();
		};
		var applyListeners = function applyListeners() {
			menu.addEventListener('click', function () {
				return toggleClass(body, 'nav-active');
			});
		};
		var toggleClass = function toggleClass(element, stringClass) {
			if (element.classList.contains(stringClass)) element.classList.remove(stringClass);
			else element.classList.add(stringClass);
		};
		init();
	}();


	document.querySelectorAll('.sub_menu_btn').forEach(button => {
		button.addEventListener('click', function (event) {
			event.stopPropagation();
			const parentLi = this.closest('.menu-item-has-children');
			const subMenu = parentLi.querySelector('.sub-menu');
			if (subMenu) {
				subMenu.classList.toggle('active');
				this.classList.toggle('active_btn');
			}
		});
	});
	// Закрытие подменю при клике вне меню
	document.addEventListener('click', function () {
		document.querySelectorAll('.sub-menu.active').forEach(subMenu => {
			subMenu.classList.remove('active');
			const button = subMenu.previousElementSibling;
			if (button && button.classList.contains('sub_menu_btn')) {
				button.classList.remove('active_btn');
			}
		});
	});

	$('.modal_btn_box').magnificPopup({
		delegate: 'a',
		removalDelay: 500,
		callbacks: {
			beforeOpen: function () {
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
		midClick: true,
	});

	$("#phone, input[type='tel']").inputmask({
		"mask": "+7(999)999-99-99",
		"clearIncomplete": true,
		showMaskOnFocus: true,
		showMaskOnHover: false,
	});


	//	//accordion
	//
	//	$('#accordion').accordion({
	//		header: '> .accordion_item > .accordion_header',
	//		active: false,
	//		collapsible: true,
	//		heightStyle: "content",
	//
	//		// дает возможность открыть каждый сблок
	//		beforeActivate: function (event, ui) {
	//			if (ui.newHeader[0]) {
	//				var currHeader = ui.newHeader;
	//				var currContent = currHeader.next('.ui-accordion-content');
	//			} else {
	//				var currHeader = ui.oldHeader;
	//				var currContent = currHeader.next('.ui-accordion-content');
	//			}
	//			var isPanelSelected = currHeader.attr('aria-selected') == 'true';
	//
	//			currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));
	//
	//			currHeader.children('.ui-icon').toggleClass('ui-icon-plus', isPanelSelected).toggleClass('ui-icon-minus', !isPanelSelected);
	//
	//			currContent.toggleClass('accordion-content-active', !isPanelSelected)
	//			if (isPanelSelected) {
	//				currContent.slideUp();
	//			} else {
	//				currContent.slideDown();
	//			}
	//
	//			return false;
	//		},
	//
	//		icons: {
	//			"header": "ui-icon-plus",
	//			"activeHeader": "ui-icon-minus"
	//		},
	//
	//	});

	// плавный скрол 
	const offset = 80;
	$('a[href^="#"]').on('click', function (e) {
		e.preventDefault();

		const targetId = $(this).attr('href');
		const $target = $(targetId);

		if ($target.length) {
			$('html, body').animate({
				scrollTop: $target.offset().top - offset
			}, 1200);
		}
	});

	//	$("#tabs").tabs();
	//
	//	$().fancybox({});
});
