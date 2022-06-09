function Sim(sldrId) {

	let id = document.getElementById(sldrId);
	if(id) {
		this.sldrRoot = id
	}
	else {
		this.sldrRoot = document.querySelector('.sim-slider')
	};

	// Объекты слайдера
	this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
	this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
	this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
	this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');

	// Инициализация
	this.options = Sim.defaults;
	Sim.initialize(this)
};

Sim.defaults = {
	loop: true,     // Бесконечное зацикливание слайдера
	auto: true,     // Автоматическое пролистывание
	interval: 2500, // Интервал между пролистыванием элементов (мс)
	dots: true      // Индикаторные точки
};

Sim.prototype.elemPrev = function(num) {

	let prevElement = this.currentElement;
	this.currentElement -= num;
	
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.elemNext = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement += num;
	if(this.currentElement >= this.elemCount) this.currentElement = 0;

	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText =
             'background-color:#BBB; cursor:pointer;'
};

Sim.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText =
             'background-color:#556; cursor:default;'
};

Sim.initialize = function(that) {
	// Constants
	that.elemCount = that.sldrElements.length; 
	// Variables
	that.currentElement = 0;
	let bgTime = getTime();
	// Functions
	function getTime() {
		return new Date().getTime();
	};
	
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	if(that.elemCount >= 1) {   // показать первый элемент
		that.sldrElemFirst.style.opacity = '1';
	};

	 if(that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
	};

	if(that.options.dots) {  // инициализация индикаторных точек
		let sum = '', diffNum;
		for(let i = 0; i < that.elemCount; i++) {
			sum += '<span class="sim-dot"></span>'
		};
		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');
		// Назначаем точкам обработчик события 'click'
		for(let n = 0; n < that.elemCount; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function(){
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if(n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
				// Если n == that.currentElement ничего не делаем
			}, false)
		};
		that.dotOff(0);  // точка[0] выключена, остальные включены
		for(let i = 1; i < that.elemCount; i++) {
			that.dotOn(i)
		}
	}
};