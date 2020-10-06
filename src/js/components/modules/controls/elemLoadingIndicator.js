"use strict";


/*  Функция добавления на страницу элемента-индикатора для отображения выполнения хода некоего процесса.
================================
*/

function addLoadingCircle() {
    const btnLoader = document.querySelector(".btn-loader");

    if (btnLoader != null) {
        btnLoader.addEventListener("click", function (evt) {

            const section = document.createElement("section");
            section.classList.add("modal", "modal-inner", "modal-loader-icon");

            section.addEventListener("click", function (evt) {
                evt.stopPropagation();
            });

            const img = document.createElement("img");
            img.src = "/src/assets/img/oval3.svg";
            img.classList.add("svg-loader");
            section.appendChild(img);

            createOverlay().appendChild(section);
        });
    }
}

addLoadingCircle();