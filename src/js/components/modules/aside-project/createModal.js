"use strict";

import fixedScrollbar from "./fixedScrollBar.js";
import closeAllModals from "./closeAllModals.js";

/*  1. selectorOpenModal - кнопка, при клике на которую открывается окно
    2. selectorModal - селектор самого модального окна
    3. classOverlay - класс для оверлея, передается без точки
    4. classCloseModal - класс для элемента закрывающего окно, кнопка-крестик, например
    5. classHideModal - класс для скрытия модального окна, его удаляем, при клике на кнопку демонстрации окна, потом возвращаем
    6. classBodyFixed - класс для фиксации body, чтобы не было возможности прокрутки
================================
*/

const createModalOverlay = (selectorOpenModal,
                            selectorModal,
                            classOverlay,
                            classCloseModal,
                            classHideModal,
                            classBodyFixed) => {

    let openModalBtn = document.querySelector(selectorOpenModal);
    let modal = document.querySelector(selectorModal);

    if (modal !== null && openModalBtn !== null) {

        openModalBtn.addEventListener("click", function (evt) {

            let overlay = document.createElement("div");
            overlay.classList.add(classOverlay);

            modal.addEventListener("click", (evt) => evt.stopPropagation());

            if (modal.style.display === "none") {
                modal.style.removeProperty("display");
            }
            modal.classList.remove(classHideModal);


            /*  С помощью делегирования перехватываем клик на сам оверлей и на кнопку закрытия модального окна.
                Заметь, что ловим событие на спуске, это потому, что кнопка закрытия окна внутри него, а само окно запрещает
                всплытие, поэтому перехватить такой клик можно только на этапе спуска.
            ================================
            */
            overlay.addEventListener("click", (evt) => {
                if (evt.target.classList.contains(classCloseModal) || evt.target.classList.contains(classOverlay)) {
                    // Закрываем все открытые на данный момент модальные окна, по селектору
                    closeAllModals(selectorModal, classHideModal);
                    overlay.removeChild(modal);
                    document.body.removeChild(overlay);
                    overlay = null;

                    /*  Если скролла нет и модалка закрывается, значит, нужно убрать компенсацию перед возвращением скролла
                    ================================
                    */
                    fixedScrollbar();
                    document.body.classList.remove("aside-overlay-body");
                }
            }, true);

            /*  1. Проверяем наличие скролла, если он был - компенсируем отступ
                2. На втором шаге даем body свойство fixed, скролл исчезает
                3. Заданный выше отступ не дает контекту прыгнуть вправо
            ================================
            */
            fixedScrollbar();
            document.body.classList.add(classBodyFixed);
            document.body.appendChild(overlay);
            overlay.appendChild(modal);




        });
    }
};

export default createModalOverlay;

