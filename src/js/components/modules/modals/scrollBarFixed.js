"use strict";

/*  Данную функцию нужно вызывать до появления модального окна, иначе она не успееет рассчитать ширину scollbar-а и расчеты не будут выполнены.
================================
*/

function scrollBarFixed(elementListSelector) {

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
            value.style.paddingRight = `${calcScrollBarWidth() + basePaddingRight}px`;

            // if (calcScrollBarWidth() > 0) {
            //     value.style.paddingRight = `${calcScrollBarWidth() + basePaddingRight}px`;
            // }
        });
    } else {
        containers.forEach(value => value.style.removeProperty("padding-right"));
    }
}

export default scrollBarFixed;
