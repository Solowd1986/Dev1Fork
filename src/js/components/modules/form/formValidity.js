"use strict";

export default function formValidity(form) {

    if (!form.checkValidity()) {

        const formErrors = {};
        [...form.elements].forEach((element) => {
            if (!element.checkValidity()) {
                formErrors[element.name] = `Введите значения поля ${element.dataset.label}`;
            }
        });
        return formErrors;
    } else {
        return true;
    }
}




