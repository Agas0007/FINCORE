'use strict';

function Tabs() {
	var bindAll = function () {
		var menuElements = document.querySelectorAll('[data-tab]');
		for (var i = 0; i < menuElements.length; i++) {
			menuElements[i].addEventListener('click', change, false);
		}
	}

	var clear = function () {
		var menuElements = document.querySelectorAll('[data-tab]');
		for (var i = 0; i < menuElements.length; i++) {
			menuElements[i].classList.remove('active');
			var id = menuElements[i].getAttribute('data-tab');
			document.getElementById(id).classList.remove('active');
		}
	}

	var change = function (e) {
		clear();
		e.target.classList.add('active');
		var id = e.currentTarget.getAttribute('data-tab');
		document.getElementById(id).classList.add('active');
	}

	bindAll();
}

var connectTabs = new Tabs();



function TabsNew() {
	var bindAllNew = function () {
		var menuElementsNew = document.querySelectorAll('[data-tab_why_us]');
		for (var i = 0; i < menuElementsNew.length; i++) {
			menuElementsNew[i].addEventListener('click', change, false);
		}
	}

	var clear = function () {
		var menuElementsNew = document.querySelectorAll('[data-tab_why_us]');
		for (var i = 0; i < menuElementsNew.length; i++) {
			menuElementsNew[i].classList.remove('active');
			var id = menuElementsNew[i].getAttribute('data-tab_why_us');
			document.getElementById(id).classList.remove('active');
		}
	}

	var change = function (e) {
		clear();
		e.target.classList.add('active');
		var id = e.currentTarget.getAttribute('data-tab_why_us');
		document.getElementById(id).classList.add('active');
	}

	bindAllNew();
}

var connectTabsNew = new TabsNew();