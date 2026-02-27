document.addEventListener("DOMContentLoaded", () => {

	'use strict';

	function Tabs() {
		var bindAll = function () {
			var menuElements = document.querySelectorAll('[data-tab]');
			for (var i = 0; i < menuElements.length; i++) {
				menuElements[i].addEventListener('click', change, false);
			}
		};

		var clear = function () {
			var menuElements = document.querySelectorAll('[data-tab]');
			for (var i = 0; i < menuElements.length; i++) {
				menuElements[i].classList.remove('active');
				var id = menuElements[i].getAttribute('data-tab');
				var tab = document.getElementById(id);
				if (tab) tab.classList.remove('active');
			}
		};

		var change = function (e) {
			clear();
			e.currentTarget.classList.add('active');
			var id = e.currentTarget.getAttribute('data-tab');
			var tab = document.getElementById(id);
			if (!tab) return;
			tab.classList.add('active');

			// Обновляем позицию индикатора
			moveIndicator(e.currentTarget);
		};

		var moveIndicator = function (el) {
			const indicator = document.querySelector('.tab_indicator');
			const rect = el.getBoundingClientRect();
			const parentRect = el.parentElement.getBoundingClientRect();
			indicator.style.width = rect.width + 'px';
			indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
		};

		bindAll();

		// Устанавливаем индикатор для первого активного таба при загрузке
		requestAnimationFrame(function () {
			const firstActiveTab = document.querySelector('[data-tab].active');
			if (firstActiveTab) {
				moveIndicator(firstActiveTab);
			}
			//    animateProductsTab(document.querySelector('.products_tab.active'));
		});
	}

	var connectTabs = new Tabs();

	// Повторим для других вкладок (TabsNew и TabsSolutions)
	function TabsNew() {
		var bindAllNew = function () {
			var menuElementsNew = document.querySelectorAll('[data-tab_why_us]');
			for (var i = 0; i < menuElementsNew.length; i++) {
				menuElementsNew[i].addEventListener('click', change, false);
			}
		};

		var clear = function () {
			var menuElementsNew = document.querySelectorAll('[data-tab_why_us]');
			for (var i = 0; i < menuElementsNew.length; i++) {
				menuElementsNew[i].classList.remove('active');
				var id = menuElementsNew[i].getAttribute('data-tab_why_us');
				document.getElementById(id).classList.remove('active');
			}
		};

		var change = function (e) {
			clear();
			e.target.classList.add('active');
			var id = e.currentTarget.getAttribute('data-tab_why_us');
			document.getElementById(id).classList.add('active');

			// Обновляем позицию индикатора
			moveIndicator(e.currentTarget);
		};

		var moveIndicator = function (el) {
			const indicator = document.querySelector('.tab_indicator_why_us');
			const rect = el.getBoundingClientRect();
			const parentRect = el.parentElement.getBoundingClientRect();
			indicator.style.width = rect.width + 'px';
			indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
		};

		bindAllNew();

		// Устанавливаем индикатор для первого активного таба при загрузке
		requestAnimationFrame(function () {
			const firstActiveTab = document.querySelector('[data-tab_why_us].active');
			if (firstActiveTab) {
				moveIndicator(firstActiveTab);
			}
		});
	}

	var connectTabsNew = new TabsNew();

	function TabsSolutions() {
		var bindAllSolutions = function () {
			var menuElementsSolutions = document.querySelectorAll('[data-tab_solutions]');
			for (var i = 0; i < menuElementsSolutions.length; i++) {
				menuElementsSolutions[i].addEventListener('click', change, false);
			}
		};

		var clear = function () {
			var menuElementsSolutions = document.querySelectorAll('[data-tab_solutions]');
			for (var i = 0; i < menuElementsSolutions.length; i++) {
				menuElementsSolutions[i].classList.remove('active');
				var id = menuElementsSolutions[i].getAttribute('data-tab_solutions');
				document.getElementById(id).classList.remove('active');
			}
		};

		var change = function (e) {
			clear();
			e.target.classList.add('active');
			var id = e.currentTarget.getAttribute('data-tab_solutions');
			document.getElementById(id).classList.add('active');

			// Обновляем позицию индикатора
			moveIndicator(e.currentTarget);
		};

		var moveIndicator = function (el) {
			const indicator = document.querySelector('.tab_indicator_solutions');
			const rect = el.getBoundingClientRect();
			const parentRect = el.parentElement.getBoundingClientRect();
			indicator.style.width = rect.width + 'px';
			indicator.style.transform = `translateX(${rect.left - parentRect.left}px)`;
		};

		bindAllSolutions();

		// Устанавливаем индикатор для первого активного таба при загрузке
		requestAnimationFrame(function () {
			const firstActiveTab = document.querySelector('[data-tab_solutions].active');
			if (firstActiveTab) {
				moveIndicator(firstActiveTab);
			}
		});
	}

	var connectTabsSolutions = new TabsSolutions();

});
