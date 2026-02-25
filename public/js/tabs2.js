function TabsSolutions() {
	var bindAllSolutions = function () {
		var menuElementsSolutions = document.querySelectorAll('[data-tab_solutions]');
		for (var i = 0; i < menuElementsSolutions.length; i++) {
			menuElementsSolutions[i].addEventListener('click', change, false);
		}
	}

	var clear = function () {
		var menuElementsSolutions = document.querySelectorAll('[data-tab_solutions]');
		for (var i = 0; i < menuElementsSolutions.length; i++) {
			menuElementsSolutions[i].classList.remove('active');
			var id = menuElementsSolutions[i].getAttribute('data-tab_solutions');
			document.getElementById(id).classList.remove('active');
		}
	}

	var change = function (e) {
		clear();
		e.target.classList.add('active');
		var id = e.currentTarget.getAttribute('data-tab_solutions');
		document.getElementById(id).classList.add('active');
	}

	bindAllSolutions();
}

var connectTabsSolutions = Solutions TabsSolutions();
