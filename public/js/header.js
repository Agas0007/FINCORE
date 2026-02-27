document.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector("#header");
	if (header) {
		let lastPosition = 0;
		let limitPosition = 30;

		window.addEventListener("scroll", function () {
			if (lastPosition < window.scrollY && limitPosition < window.scrollY) {
				$("#header").addClass("scrolled");
				$("#header").removeClass("scrolling-up");
			}
			if (lastPosition > window.scrollY) {
				$("#header").removeClass("scrolled");

				if (limitPosition < window.scrollY) {
					$("#header").addClass("scrolling-up");
				} else {
					$("#header").removeClass("scrolling-up");
				}
			}
			lastPosition = window.scrollY;
		});
	}
});
