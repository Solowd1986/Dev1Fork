"use strict";

export default class classFormHandler {
    constructor ({formSelector}) {
        this.formList = document.querySelectorAll(formSelector);
        if (this.formList.length !== 0) {
            this.init(this.formList);
        }
    }

    init (formList) {

        let form = formList[0];
        let sendBtn = form.document.querySelector("[type=submit]");
        sendBtn.disable = true;
    }










}