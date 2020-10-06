"use strict";


export default class errorFormGenerator {
    constructor({formListSelector, containerSelector, errorTargetElement, errorElementClass = ""}) {
        this.formList = document.querySelectorAll(formListSelector);
        this.errorElementClass = errorElementClass;

        if (this.formList.length !== 0) {
            this.init();
        }
    }

    /*  Для каждой переданной формы мы забираем набор их полей ввода.
        После чего, если выборка успешна, блокируем поведение формы по-умолчанию, и для каждого поля формы
        вызываем метод, который закрепляет за этим полем механизм генерации ошибок. В этот метод мы передаем как само поле,
        так и форму, которой оно приналежит, для последующей обработки.
    ================================
    */
    init() {
        this.formList.forEach(formElement => {
            const formFields = errorFormGenerator.getFormFields(formElement);

            if (formFields) {
                errorFormGenerator.preventFormStandartBehavior(formElement);
                formFields.forEach(formField => this.attachErrorHandler(formElement, formField));
            }
        })
    }


    /*  Забираем в свойства все нужные поля формы. Метод возвращает результат логической операции, выявляющей,
        было ли найдено хоть одно поле по селектору. Если метод вернул false, то ни одного поля найдено не было.
        Иначе - можно ползоваться данным свойством formFields в дальнейшем.
    ================================
    */
    static getFormFields(form) {
        return form.querySelectorAll("input:not([type=submit]):not([type=checkbox]):not([type=radio])");
    }



    /*  Создание контейнера для вывода ошибки, при вызове возвращает готовый элемент
        1. targetElement - поле формы, для которого генерируется ошибка, от него мы возьмем высоту, для позиционирования
        2. type - тип элемента
        3. errorElementInnerText - текст ошибки
        4. errorElementClass - опционально - класс для генерируемого элемента, иначе пропишем инлайновые стили
    ================================
    */
    static createErrorElement({
                                  targetElement,
                                  type = "div",
                                  errorElementInnerText = "Ошибка поля ввода",
                                  errorElementClass = null,
                              }) {

        const errorElement = document.createElement(type);
        errorElement.innerText = errorElementInnerText;
        if (errorElementClass) {
            errorElement.classList.add(errorElementClass);
        } else {
            errorElement.style.cssText = `
                position: absolute;
                font-size: 20px;
                color: white;
                background-color: red;
                bottom: -${targetElement.clientHeight}px;
                left: 0px;
                padding: 5px 22px;
                border-radius: 6px;
            `;
        }
        return errorElement;
    }



    /*  Отключение для формы поведения по-умолчанию:
        1. Блокирование стандартной отправки
        2. Блокирование вывода нативных ошибок браузера для полей форм, они заменяются кастомными версиями ошибок
    ================================
    */
    static preventFormStandartBehavior(form) {
        form.addEventListener("submit", function (evt) {
            evt.preventDefault();
        });

        form.addEventListener("invalid", function (evt) {
            evt.preventDefault();
        }, true);
    }




    attachErrorHandler(formElement, formField) {
        const submitButton = formElement.querySelector("[type=submit]");
        submitButton.disabled = true;

        const formFieldWrapperElement = formField.parentElement;
        formFieldWrapperElement.style.cssText = `position: relative; margin-bottom: 60px; border: 1px solid red`;

        const errorField = errorFormGenerator.createErrorElement({
            targetElement: formField,
            errorElementClass: this.errorElementClass,
            type: "span",
            errorElementInnerText: "Ошибка",
        });


        function formFieldValidate() {
            if (formField.checkValidity()) {
                if (formFieldWrapperElement.contains(errorField)) {
                    formFieldWrapperElement.removeChild(errorField);
                }
                if (formElement.checkValidity()) {
                    submitButton.disabled = false;
                }
            } else {
                if (!formFieldWrapperElement.contains(errorField)) {
                    formFieldWrapperElement.appendChild(errorField);
                }
                submitButton.disabled = true;
            }
        }

        function formEventHandler() {
            new Promise((success) => {
                formField.addEventListener("change", function (evt) {
                    formFieldValidate();
                    success();
                });
            }).then(() => {
                formField.addEventListener("input", function (evt) {
                    formFieldValidate();
                });
            });
        }

        formEventHandler();
    }
}
