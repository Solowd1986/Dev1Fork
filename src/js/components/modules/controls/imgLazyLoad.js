"use strict";


/*  Функция для LazyLoad изображений по мере прокрутки страницы.
================================
*/
function lazyLoadImg(imgWrapperSelector, imgItemSelector, imgShowClassName) {
    const gallery = document.querySelector(imgWrapperSelector);
    const img = document.querySelectorAll(imgItemSelector);

    window.addEventListener("scroll", function (evt) {
        const galleyTopOffset = Math.trunc(gallery.getBoundingClientRect().top);
        if (window.scrollY + window.innerHeight >= galleyTopOffset) {
            img.forEach(value => value.classList.add(imgShowClassName));
        }
    });
}
