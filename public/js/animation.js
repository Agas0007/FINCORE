	// плавная анимация за курсором
	'use strict';
	// ====== Константы ======
	const CELL_WIDTH = 94; // ширина грани
	const P_MAX = 98; // у курсора: градиент почти до низа
	const P_MIN = 55; // далеко: короче, но заметный
	const CENTER = 0.5; // центр экрана в долях
	const BLEND_WIDTH = 0.2; // ширина зоны смешения парабола→волна
	const ALPHA = 0.1; // сглаживание движения курсора (меньше → плавнее)
	const LAMBDA = 1; // длина волны (фиксированная для стабильности)
	const SPREAD = 1.0; // ширина параболы (|u - u0| = 1 → минимум)

	// ====== Утилиты ======
	const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
	const smoothstep = (e0, e1, x) => {
		const t = clamp((x - e0) / (e1 - e0), 0, 1);
		return t * t * (3 - 2 * t);
	};

	// ====== DOM ======
	const bg = document.querySelector('.background');

	function renderCells() {
		const needed = Math.max(1, Math.ceil(window.innerWidth / CELL_WIDTH));
		const current = bg.children.length;
		for (let i = current; i < needed; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell';
			bg.appendChild(cell);
		}
		for (let i = bg.children.length - 1; i >= needed; i--) {
			bg.removeChild(bg.children[i]);
		}
	}

	// ====== Анимация градиента ======
	let lastX = window.innerWidth / 2; // последняя позиция курсора (px)
	let smoothU = 0.5; // сглаженная позиция курсора (0..1)

	function updateGradients(x) {
		if (typeof x === 'number') lastX = x;
		if (!bg.children.length) renderCells();

		// Геометрия контейнера (кэшируем часто используемые величины)
		const rect = bg.getBoundingClientRect();
		const rectLeft = rect.left;
		const width = Math.max(1, rect.width);
		const invWidth = 1 / width;

		// Нормализуем и сглаживаем позицию курсора
		const uMouseRaw = clamp((lastX - rectLeft) * invWidth, 0, 1);
		smoothU += ALPHA * (uMouseRaw - smoothU);

		// Плавное смешение режимов: 0 — парабола, 1 — волна
		const blend = smoothstep(0, BLEND_WIDTH, Math.abs(smoothU - CENTER));

		// Предварительные коэффициенты для быстроты
		const m = (smoothU * 2) - 1; // центр параболы в [-1,1]
		const range = (P_MAX - P_MIN);

		// Обход без создания массивов на каждый кадр
		const n = bg.children.length;
		for (let i = 0; i < n; i++) {
			const cell = bg.children[i];

			// Центр ячейки в координатах контейнера (используем offset для стабильности)
			const u = clamp((cell.offsetLeft + cell.offsetWidth * 0.5) * invWidth, 0, 1);

			// 1) Параболическая компонента
			const uu = (u * 2) - 1;
			const d = (uu - m) / SPREAD;
			const parabola = Math.max(0, 1 - d * d);
			const pinkParabola = P_MIN + range * parabola;

			// 2) Волновая компонента (стабильная фаза)
			const phase = (2 * Math.PI * (u - smoothU)) / LAMBDA;
			const wave = (Math.cos(phase) + 1) * 0.5; // 0..1
			const pinkWave = P_MIN + range * wave;

			// 3) Итог с плавным смешением
			let pinkStop = pinkParabola * (1 - blend) + pinkWave * blend;
			pinkStop = clamp(pinkStop, 20, 99);

			//        cell.style.background = `linear-gradient(180deg, #0279C1 0%, #FF2A92 ${pinkStop}%, #FF2A92 100%)`;
			cell.style.background = `linear-gradient(140deg, #2563EB 0%, rgba(255, 255, 255, 0.95) ${pinkStop}%, #813CE7 135%)`;
		}
	}

	// ====== Инициализация и события ======
	function init() {
		renderCells();
		const rect = bg.getBoundingClientRect();
		const width = Math.max(1, rect.width);
		smoothU = clamp((lastX - rect.left) / width, 0, 1);
		requestAnimationFrame(() => updateGradients(lastX));
	}

	window.addEventListener('resize', () => {
		renderCells();
		requestAnimationFrame(() => updateGradients(lastX));
	});

	window.addEventListener('pointermove', (e) => {
		updateGradients(e.clientX);
	});

	init();
