"use strict";



/*  Базовый слайдер, с переключением слайдов по клику.
    На вход передаются:
    1. sliderSelector - сами элементы слайдов
    2. slideNextBtn/slidePrevBtn - кнопки управления
    3. activeClass - класс активности, который будет получать активный класс
    4. options - опции, позволяет включить актоматический показ слайдов с заданной частотой
================================
*/
export default class SliderBasic {

    constructor({sliderSelector, slideNextBtn, slidePrevBtn, activeClass = null, options = null}) {
        this.sliderList = document.querySelectorAll(sliderSelector);
        this.slideNextBtn = document.querySelector(slideNextBtn);
        this.slidePrevBtn = document.querySelector(slidePrevBtn);

        this.activeClass = [].includes.call(activeClass, ".") ? activeClass.replace(".", "") : activeClass;
        this.options = options;

        if (this.sliderList.length !== 0 && this.slideNextBtn !== null && this.slidePrevBtn !== null) {
            this.init();
        }
    }

    /*  Данный метод вызывается при создании экземпляра слайдера, проводит все инициализации, устанавливает слушатели событий
    ================================
    */
    init() {
        if (this.getInitialSlideIndex(this.activeClass) === false) {
            //console.log("Active class error");
        } else {
            if (this.options && this.options.autoplay) {
                const interval = this.options.interval || 1000;
                this.autoplaySlider(interval);
            }

            this.slideNextBtn.addEventListener("click", (evt) => {
                this.nextSlide();
            });

            this.slidePrevBtn.addEventListener("click", (evt) => {
                this.prevSlide();
            });
        }
    }

    /*  Метод получения инициирующего слайда. Это не обязателньо первый слайд, просто тот, у которого есть класс активности.
        Сначала получаем индекс слайда, имеющего класс активности. Если таковой не найден, то индекст будет -1 и вернем false
    ================================
    */
    getInitialSlideIndex(activeClass) {
        const activeSlideIndex = [].indexOf.call(this.sliderList, [].find.call(this.sliderList, value => value.classList.contains(activeClass)));
        return (activeSlideIndex !== -1) ? this.indexOfCurrentSlide = activeSlideIndex : false;
    }

    /*  Метод, задающий интервал переключения слайдов, при переданной опции auto
    ================================
    */
    autoplaySlider(time) {
        setInterval(() => this.nextSlide(), time)
    }

    /*  Если текущий индекс слайда равен нулю - то перезапускаем слайдер, так как индекс меньше нуля недопустим.
    ================================
    */
    prevSlide() {
        if (this.indexOfCurrentSlide !== 0) {
            this.sliderList[this.indexOfCurrentSlide].classList.remove(this.activeClass);
            this.sliderList[--this.indexOfCurrentSlide].classList.add(this.activeClass);
        } else {
            this.resetSlides(true);
        }
    }

    /*  Если текущий индекс слайда меньше, чем длина массива слайдов -1, то уменьшаем счетчик слайдов, иначе - перзапуск.
        Строго меньше чем -1 тут нужно потому, что должно быть пространство для уменьшения индекса на 1, в массиве из 3 слайдов
        длина будет 4, если 3 < 4, то при входе в блок индекс попытается стать 3 + 1, а такого индекса нет.
        Поэтому нужно строгое index < length -1
    ================================
    */
    nextSlide() {
        if (this.indexOfCurrentSlide < this.sliderList.length - 1) {
            this.sliderList[this.indexOfCurrentSlide].classList.remove(this.activeClass);
            this.sliderList[++this.indexOfCurrentSlide].classList.add(this.activeClass);
        } else {
            this.resetSlides();
        }
    }

    /*  Перезапуск слайдов, меняется, в зависимости от того, в какой ситуации вызван. Если передана опция reverse, то слайды
        передет на последний слайд, это при клике на кнопку prev, когда дальше уже элементов нет. И наоборот, если перешли на
        последний слайд, то начиинаем с первого.
    ================================
    */
    resetSlides(reverse = false) {
        this.sliderList[this.indexOfCurrentSlide].classList.remove(this.activeClass);
        reverse ? this.indexOfCurrentSlide = this.sliderList.length - 1 : this.indexOfCurrentSlide = 0;
        this.sliderList[this.indexOfCurrentSlide].classList.add(this.activeClass);
    }
}
















