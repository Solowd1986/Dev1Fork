"use strict";

/*  Обработка ряда связанных форм, с переходом между ними
    1. Все формы изначально скрыты, по нажатию кнопки триггера первая получает класс видимости
    2. Каждой форме прописывает обработчик на событие отправки
    3. Выполняется сбор данных из формы в обьект и помещение их в общий обьект, свойством становится имя текущей формы
    4. Если следующий элемент формы существует, то удаляем у текущей формы класс активности и передаем его дальше
    5. Иначе - как-то обрабатываем полученные данные
================================
*/

const multipleFormHandler = (trigger, formsSelector, activeClass) => {

    const formTrigger = document.querySelector(trigger);
    const formsCollection = document.querySelectorAll(formsSelector);
    
    if (formTrigger !== undefined && formsCollection.length !== 0) {
        
        const state = {};

        formTrigger.addEventListener("click", function (evt) {
            formsCollection[0].classList.add(activeClass);
        });

        formsCollection.forEach(item => item.addEventListener("submit", function (evt) {
            evt.preventDefault();

            const formData = new FormData(this);
            const formDataObject = {};

            for (let [key,value] of formData.entries()) {
                formDataObject[key] = value;
            }

            state[this.name] = formDataObject;

            if (formsCollection[([].indexOf.call(formsCollection, this)+1)] !== undefined) {
                this.classList.remove(activeClass);
                formsCollection[([].indexOf.call(formsCollection, this)+1)].classList.add(activeClass);
            } else {
                console.log(state);
            }
        }));
    }
};


export default multipleFormHandler;