"use strict";

/*  Функция для создания элемента overlay и добавления его на страницу.
================================
*/

import scrollBarFixed from "./scrollBarFixed.js";

const modal = () => {

    function createOverlay() {
        let overlay = document.createElement("div");
        let closeModalIcon = document.createElement("span");
        closeModalIcon.innerHTML = "&times;";

        overlay.classList.add("modal-overlay");
        closeModalIcon.classList.add("modal-close");

        /*
        Порядок важен, сначала вызов функциии для измерения скроллбара, потом фиксация body и,
        соответственно исчезновение скроллбара
        */

        scrollBarFixed(".container");
        document.body.classList.add("modal-overlay--body-fixed");

        overlay.appendChild(closeModalIcon);
        document.body.appendChild(overlay);



        overlay.addEventListener("click", function (evt) {

            evt.stopPropagation();

            document.body.removeChild(overlay);
            overlay = null;

            /*
            Сначала вызов функции замера скроллбара, потом его возврат, для того, чтоб до появления скроллбара
            убрать компенсирующий padding, иначе скроллбар будет осчитан и к нему еще и прибавится padding
            */
            scrollBarFixed(".container");
            document.body.classList.remove("modal-overlay--body-fixed");
        }, {once: true});

        closeModalIcon.addEventListener("click", function (evt) {
            evt.stopPropagation();
            document.body.removeChild(overlay);
            overlay = null;

            scrollBarFixed(".container");
            document.body.classList.remove("modal-overlay--body-fixed");
        }, {once: true});

        return overlay;
    }


    function createModal(modalName) {

        if (document.querySelector(modalName) === null){
            return;
        }

        const overlay = createOverlay();
        const modal = document.querySelector(modalName);
        modal.addEventListener("click", function (evt) {
            evt.stopPropagation();
        });

        overlay.appendChild(modal.cloneNode(true));
        modal.style.display = "block";
    }


    const authBtn = document.querySelector(".auth");

    if (authBtn !== null) {
        authBtn.addEventListener("click", function (evt) {
            createModal("." + this.dataset.modal);
        });
    }
};

export default modal;

