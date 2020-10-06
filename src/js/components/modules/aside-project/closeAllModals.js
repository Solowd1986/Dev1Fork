"use strict";


/*  Вспомогательный класс, вызываем его, если при закрытии одного модального окна, нужно закрыть все открытые, проверка - по классу
================================
*/
const closeAllModals = (allModalsSelector, classHideModal) => {

    const modalsList = document.querySelectorAll(allModalsSelector);

    if (modalsList.length > 0) {
        modalsList.forEach(item => item.classList.add(classHideModal))
    }
};

export default closeAllModals;
