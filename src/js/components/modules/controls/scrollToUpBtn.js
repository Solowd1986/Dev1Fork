"use strict";


/*  Создание и добавление на страницу кнопки "Наверх"
================================
*/
function btnScrollToTop() {

    const scrollBtn = document.createElement("button");
    scrollBtn.innerText = "UP";
    scrollBtn.classList.add("scroll-up", "scroll-hide");
    document.body.appendChild(scrollBtn);

    scrollBtn.addEventListener("click", function (evt) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    });

    window.addEventListener("DOMContentLoaded", function (evt) {
        if (window.scrollY >= window.innerHeight/2) {
            scrollBtn.classList.remove("scroll-hide");
        }
    });

    window.addEventListener("scroll", function (evt) {
        (window.scrollY >= window.innerHeight/2) ? scrollBtn.classList.remove("scroll-hide") : scrollBtn.classList.add("scroll-hide");
    });
}

btnScrollToTop();

