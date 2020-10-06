"use strict";

function calcScrollBarWidth() {
    // Получаем ширину окна, это аналог width: 100vw (то есть ширина 100% + ширина scrollbar)
    const windowWidth = window.innerWidth;
    // Получаем ширину документа, это аналог width: 100%
    const documentWidth = document.documentElement.clientWidth;
    // Возвращаем разницу между этими величинами, это и есть ширина scrollbar. Если его нет, то вернутся такие значения -1 или 0
    return windowWidth - documentWidth;
}

function fixedScrollbar(selector = null) {
    const container = selector ? document.querySelector(selector) : document.querySelector("body");
    if (calcScrollBarWidth() > 0) {
        container.style.paddingRight = `${calcScrollBarWidth()}px`;
    } else {
        container.style.removeProperty("padding-right");
    }
}

export default fixedScrollbar;