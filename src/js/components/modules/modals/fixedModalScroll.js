"use strict";



/*  Modal user auth
================================
*/


const fixedScrollBar = () => {


    if (window.location.pathname.slice(1) !== 'profile.html') {


        const modals = document.querySelectorAll(".modal");
        const overlay = document.querySelector(".modal-overlay");
        const openModalBtn = document.querySelector(".user-nav__login-btn");
        const modalAuth = document.querySelector(".modal-auth");
        const authForm = document.querySelector(".modal-auth__form");
        const body = document.querySelector("body");


        function scrollBarFixedPadding(elementListSelector) {

            const containers = document.querySelectorAll(elementListSelector);

            function calcScrollBarWidth() {
                // Получаем ширину окна, это аналог width: 100vw (то есть ширина 100% + ширина scrollbar)
                const windowWidth = window.innerWidth;
                // Получаем ширину документа, это аналог width: 100%
                const documentWidth = document.documentElement.clientWidth;
                // Возвращаем разницу между этими величинами, это и есть ширина scrollbar. Если его нет, то вернутся такие значения -1 или 0
                return windowWidth - documentWidth;
            }

            if (calcScrollBarWidth() > 0) {
                containers.forEach(value => {
                    const basePaddingRight = parseInt(window.getComputedStyle(value).getPropertyValue("padding-right"));
                    if (calcScrollBarWidth() > 0) {
                        value.style.paddingRight = `${calcScrollBarWidth() + basePaddingRight}px`;
                    }
                });
            } else {
                containers.forEach(value => value.style.removeProperty("padding-right"));
            }
        }


        openModalBtn.addEventListener("click", function (e) {
            e.preventDefault();
            overlay.classList.remove("modal-hide");
            modalAuth.classList.remove("modal-hide");
            scrollBarFixedPadding(".container");
            body.classList.add("modal-overlay--body-fixed");

        });

        authForm.addEventListener("submit", function (e) {
            e.preventDefault();
        });

        authForm.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        overlay.addEventListener("click", function () {
            modals.forEach(value => value.classList.add("modal-hide"));
            scrollBarFixedPadding(".container");
            body.classList.remove("modal-overlay--body-fixed");

        });
    }
};

export default fixedScrollBar;











export const fixedScrollBarWithTransition = () => {

    const modals = document.querySelectorAll(".modal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".profile__login-btn");
    const modalAuth = document.querySelector(".modal-auth");
    const authForm = document.querySelector(".modal-auth__form");
    const body = document.querySelector("body");


    const containers = document.querySelectorAll(".container");


    function calcScrollBarWidth() {
        // Получаем ширину окна, это аналог width: 100vw (то есть ширина 100% + ширина scrollbar)
        const windowWidth = window.innerWidth;
        // Получаем ширину документа, это аналог width: 100%
        const documentWidth = document.documentElement.clientWidth;
        // Возвращаем разницу между этими величинами, это и есть ширина scrollbar. Если его нет, то вернутся такие значения -1 или 0
        return  windowWidth - documentWidth;
    }


    function containerPaddingOffset(containers, {transition = false} = {}) {

        /*  Обходим все выбранные контейнеры и задаем им padding  */
        containers.forEach(value => {
            
            if (transition) {
                !value.classList.contains("modal-transtition") ? value.classList.add("modal-transtition") : null;
            }
            
            if (calcScrollBarWidth() > 0 ) {
                // Получаем изначальный padding-right для контейнера, именно right, так как там scrollbar. Левый padding не нужен.
                const basePaddingRight = parseInt(window.getComputedStyle(value).getPropertyValue("padding-right"));
                value.style.cssText = `padding-right: ${calcScrollBarWidth() + basePaddingRight}px;`;
            } else {
                value.removeAttribute("style");
            }
        })
    }

    window.addEventListener("DOMContentLoaded", () => containerPaddingOffset(containers), {once: true});


    openModalBtn.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.remove("modal-hide");
        modalAuth.classList.remove("modal-hide");
        body.classList.add("modal-overlay--body-fixed");
        containerPaddingOffset(containers, {transition: true});
    });


    authForm.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    authForm.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    overlay.addEventListener("click", function () {
        modals.forEach(value => value.classList.add("modal-hide"));
        body.classList.remove("modal-overlay--body-fixed");
        containerPaddingOffset(containers);
    });
};









/*
(function () {


    const modals = document.querySelectorAll(".modal");
    const overlay = document.querySelector(".modal-overlay");
    const openModalBtn = document.querySelector(".profile__login-btn");
    const modalAuth = document.querySelector(".modal-auth");
    const authForm = document.querySelector(".modal-auth__form");
    const body = document.querySelector("body");


    const containers = document.querySelectorAll(".container");


    function calcScrollBarWidth() {
        // Получаем ширину окна, это аналог width: 100vw (то есть ширина 100% + ширина scrollbar)
        const windowWidth = window.innerWidth;
        // Получаем ширину документа, это аналог width: 100%
        const documentWidth = document.documentElement.clientWidth;
        // Возвращаем разницу между этими величинами, это и есть ширина scrollbar. Если его нет, то вернутся такие значения -1 или 0
        return  windowWidth - documentWidth;
    }

    /*  Функция для расчета padding-ов на основе переданных изначальных padding-ов у элемента и наличия/отсутствия scrollba-а  */
/*    function calcElemPaddingWithScrollbar(elemCurrentPadding) {
        // Если их разница больше нуля (т.е. scrollbar есть) - прибавлеем ширину scrollbar-а к изначальному padding элемента.
        // В противном случае - возвращаем элементу изначальный padding, приклеив строку с "px".
        return  (calcScrollBarWidth() > 0 ? calcScrollBarWidth() + elemCurrentPadding : elemCurrentPadding);
    }

    function containerPaddingOffset(containers, {transition = true} = {}) {

        /*  Обходим все выбранные контейнеры и задаем им padding  */
  /*      containers.forEach(value => {

            if (transition) {
                !value.classList.contains("modal-transtition") ? value.classList.add("modal-transtition") : null;
            }

            // Получаем изначальный padding-right для контейнера, именно right, так как там scrollbar. Левый padding не нужен.
            const basePaddingRight = parseInt(window.getComputedStyle(value).getPropertyValue("padding-right"));
            value.style.cssText = `padding-right: ${calcElemPaddingWithScrollbar(basePaddingRight)}px;`;
        })
    }



    window.addEventListener("DOMContentLoaded", () => containerPaddingOffset(containers, {transition: false}), {once: true});


    openModalBtn.addEventListener("click", function (e) {
        e.preventDefault();
        overlay.classList.remove("modal-hide");
        modalAuth.classList.remove("modal-hide");
        body.classList.add("modal-overlay--body-fixed");
    });

    authForm.addEventListener("submit", function (e) {
        e.preventDefault();
    });

    authForm.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    overlay.addEventListener("click", function () {
        modals.forEach(value => value.classList.add("modal-hide"));
        body.classList.remove("modal-overlay--body-fixed");
    });
})();

*/