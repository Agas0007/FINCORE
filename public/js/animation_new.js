'use strict';

// =========================
// Утилиты
// =========================
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const smoothstep = (e0, e1, x) => {
	const t = clamp((x - e0) / (e1 - e0 || 1), 0, 1);
	return t * t * (3 - 2 * t);
};

const num = (v, fallback) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : fallback;
};

// =========================
// Дефолтные настройки
// =========================
const DEFAULTS = {
	cellWidth: 94,

	pMax: 98,
	pMin: 55,

	center: 0.5,
	blendWidth: 0.2,
	alpha: 0.1,
	lambda: 1,
	spread: 1.0,

	angle: 140,
	color1: '#2563EB',
	color2: 'rgba(255,255,255,0.95)',
	color3: '#813CE7',
	color3Stop: '135%'
};

// =========================
// Класс одного анимированного фона
// =========================
class AnimatedBackground {
	constructor(el) {
		this.el = el;
		this.cells = [];
		this.lastPointerX = window.innerWidth / 2;
		this.smoothU = 0.5;
		this.needsRender = true;

		this.cfg = this.readConfig();
		this.applyCssVars();
		this.syncCells();
		this.initPointerPosition();

		// Отслеживаем изменение размера самого блока
		this.ro = new ResizeObserver(() => {
			this.syncCells();
			this.needsRender = true;
		});
		this.ro.observe(this.el);
	}

	readConfig() {
		const d = this.el.dataset;

		return {
			cellWidth: num(d.cellWidth, DEFAULTS.cellWidth),

			pMax: num(d.pmax, DEFAULTS.pMax),
			pMin: num(d.pmin, DEFAULTS.pMin),

			center: num(d.center, DEFAULTS.center),
			blendWidth: num(d.blendWidth, DEFAULTS.blendWidth),
			alpha: num(d.alpha, DEFAULTS.alpha),
			lambda: num(d.lambda, DEFAULTS.lambda),
			spread: num(d.spread, DEFAULTS.spread),

			angle: num(d.angle, DEFAULTS.angle),
			color1: d.color1 || DEFAULTS.color1,
			color2: d.color2 || DEFAULTS.color2,
			color3: d.color3 || DEFAULTS.color3,
			color3Stop: d.color3Stop || DEFAULTS.color3Stop
		};
	}

	applyCssVars() {
		this.el.style.setProperty('--cell-width', `${this.cfg.cellWidth}px`);
	}

	initPointerPosition() {
		const rect = this.el.getBoundingClientRect();
		const width = Math.max(1, rect.width);
		this.smoothU = clamp((this.lastPointerX - rect.left) / width, 0, 1);
	}

	syncCells() {
		const rect = this.el.getBoundingClientRect();
		const width = Math.max(1, rect.width);

		// +1 ячейка про запас, чтобы не было щели на дробных ширинах / zoom
		const needed = Math.max(1, Math.ceil(width / this.cfg.cellWidth) + 1);
		const current = this.el.children.length;

		// Добавляем
		for (let i = current; i < needed; i++) {
			const cell = document.createElement('div');
			cell.className = 'cell';
			this.el.appendChild(cell);
		}

		// Удаляем лишние
		for (let i = this.el.children.length - 1; i >= needed; i--) {
			this.el.removeChild(this.el.children[i]);
		}

		// Кэшируем список
		this.cells = Array.from(this.el.children);
	}

	setPointerX(x) {
		this.lastPointerX = x;
		this.needsRender = true;
	}

	resize() {
		this.syncCells();
		this.needsRender = true;
	}

	update() {
		// Если ререндер не нужен, пропускаем
		if (!this.needsRender) return;

		const rect = this.el.getBoundingClientRect();
		const width = Math.max(1, rect.width);
		const invWidth = 1 / width;

		// Нормализованная позиция курсора относительно этого блока
		const uMouseRaw = clamp((this.lastPointerX - rect.left) * invWidth, 0, 1);

		// Сглаживание
		const prevSmooth = this.smoothU;
		this.smoothU += this.cfg.alpha * (uMouseRaw - this.smoothU);

		// Если почти не изменилось — можно реже перерисовывать
		const delta = Math.abs(this.smoothU - prevSmooth);

		const blend = smoothstep(0, this.cfg.blendWidth, Math.abs(this.smoothU - this.cfg.center));
		const m = (this.smoothU * 2) - 1;
		const range = this.cfg.pMax - this.cfg.pMin;

		const n = this.cells.length;
		for (let i = 0; i < n; i++) {
			const cell = this.cells[i];

			// Центр ячейки в координатах блока
			// offsetLeft стабильный и быстрый для grid в таком кейсе
			const u = clamp((cell.offsetLeft + cell.offsetWidth * 0.5) * invWidth, 0, 1);

			// 1) Парабола
			const uu = (u * 2) - 1;
			const d = (uu - m) / this.cfg.spread;
			const parabola = Math.max(0, 1 - d * d);
			const stopParabola = this.cfg.pMin + range * parabola;

			// 2) Волна
			const phase = (2 * Math.PI * (u - this.smoothU)) / this.cfg.lambda;
			const wave = (Math.cos(phase) + 1) * 0.5;
			const stopWave = this.cfg.pMin + range * wave;

			// 3) Смешение
			let stop = stopParabola * (1 - blend) + stopWave * blend;
			stop = clamp(stop, 20, 99);

			cell.style.background = `linear-gradient(${this.cfg.angle}deg, ${this.cfg.color1} 0%, ${this.cfg.color2} ${stop}%, ${this.cfg.color3} ${this.cfg.color3Stop})`;
		}

		// Если почти не движется — можно считать кадр завершённым
		// (при следующем pointermove снова включится)
		if (delta < 0.0005 && Math.abs(uMouseRaw - this.smoothU) < 0.0005) {
			this.needsRender = false;
		} else {
			this.needsRender = true;
		}
	}

	destroy() {
		this.ro?.disconnect();
	}
}

// =========================
// Менеджер всех background
// =========================
class BackgroundAnimatorManager {
	constructor(selector = '.background') {
		this.items = Array.from(document.querySelectorAll(selector)).map(el => new AnimatedBackground(el));
		this.pointerX = window.innerWidth / 2;
		this.rafId = null;
		this.running = false;

		this.onPointerMove = this.onPointerMove.bind(this);
		this.onResize = this.onResize.bind(this);
		this.tick = this.tick.bind(this);

		window.addEventListener('pointermove', this.onPointerMove, {
			passive: true
		});
		window.addEventListener('resize', this.onResize, {
			passive: true
		});

		// Первый запуск
		for (const item of this.items) item.setPointerX(this.pointerX);
		this.start();
	}

	onPointerMove(e) {
		this.pointerX = e.clientX;
		for (const item of this.items) item.setPointerX(this.pointerX);
		this.start(); // запускаем цикл, если был остановлен
	}

	onResize() {
		for (const item of this.items) item.resize();
		this.start();
	}

	start() {
		if (this.running) return;
		this.running = true;
		this.rafId = requestAnimationFrame(this.tick);
	}

	tick() {
		let anyNeedsRender = false;

		for (const item of this.items) {
			item.update();
			if (item.needsRender) anyNeedsRender = true;
		}

		if (anyNeedsRender) {
			this.rafId = requestAnimationFrame(this.tick);
		} else {
			this.running = false;
			this.rafId = null;
		}
	}

	destroy() {
		window.removeEventListener('pointermove', this.onPointerMove);
		window.removeEventListener('resize', this.onResize);
		if (this.rafId) cancelAnimationFrame(this.rafId);
		for (const item of this.items) item.destroy();
	}
}

// Инициализация
const bgAnimator = new BackgroundAnimatorManager('.background');
