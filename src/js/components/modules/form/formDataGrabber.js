"use strict";

export default function formDataGrabber(form) {

    const formData = new FormData(form);

    const formFieldsObject = {};
    for (let [key, value] of formData.entries()) {
        formFieldsObject[key] = value;
    }
    return formFieldsObject;
}
