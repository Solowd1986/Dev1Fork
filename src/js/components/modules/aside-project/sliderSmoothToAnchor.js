"use strict";


/*
================================
*/
export default class SliderSmoothToAnchor {
    constructor({sliderSelector, sliderControls, sliderLogo}) {
        this.sliderList = document.querySelectorAll(sliderSelector);
        this.sliderBtn = document.querySelector(sliderControls);
        this.sliderLogo = document.querySelector(sliderLogo);
        this.indexOfCurrentSlide = 0;

        if (this.sliderList.length !== 0 && this.sliderBtn !== null && this.sliderLogo !== null) {
            this.init();
        }
    }

    /*  Данный метод плзволяет получить количество пикселей от верха документа до верха слайда, чтобы прокрутить к нему страницу.
        Складывается высота viewportt и количество прокрученных пикселей за пределами viewport.
        Важная деталь, это то, что для текущего слайда getBoundingClientRect().top равно 0, так как каждый слайд
        прижат к верху экрана. Но вот следующий слайд имеет этот отступ, так как он ниже текущей границы viewport, поэтому
        мы берем именно его и складываем со скроллом, так мы можем указать, сколько пикселей нужно мягко прокрутить для
        достижения следующего слайда
    ================================
    */
    static calcSlideOffset(slide) {
        return window.scrollY + Math.round(slide.getBoundingClientRect().top);
    }

    /*  Вызывает метод прокрутки окна на переданное количество пикселей
    ================================
    */
    static sliderScroll(offset) {
        window.scrollTo({top: offset, behavior: "smooth"})
    }

    init() {
        this.sliderBtn.addEventListener("click", (evt) => {
            this.nextSlide();
        });

        this.sliderLogo.addEventListener("click", (evt) => {
            evt.preventDefault();
            this.resetSlides();
        });
    }

    /*
    ================================
    */
    nextSlide() {
        if (this.indexOfCurrentSlide < this.sliderList.length - 1) {
            let currentSlideOffset = SliderSmoothToAnchor.calcSlideOffset(this.sliderList[++this.indexOfCurrentSlide]);
            SliderSmoothToAnchor.sliderScroll(currentSlideOffset);
        } else {
            this.resetSlides();
        }
    }

    /* Обязательно обнуляем счетчик слайдов, перейти к первому через передачу нужного индекса статчиескому методу - недостаточно,
       так как из-за этого счетчик навсегда останется в последнем использованном положении (конечного индекса массива слайдов)
       После обнуления счетчика, просто передаем его для расчета нужной высоты прокрутки до первого элемента и
       вызываем соответствующий метод.
    ================================
    */
    resetSlides() {
        this.indexOfCurrentSlide = 0;
        let currentSlideOffset = SliderSmoothToAnchor.calcSlideOffset(this.sliderList[this.indexOfCurrentSlide]);
        SliderSmoothToAnchor.sliderScroll(currentSlideOffset);
    }
}