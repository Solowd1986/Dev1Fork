"use strict";

import formValidity from "./formValidity.js";
import formDataGrabber from "./formDataGrabber.js";


export default function formHandler (selector) {

    const form = document.querySelector(selector);
    const formData = {};

    if (form) {
        form.addEventListener("invalid", function (evt) {

            //evt.preventDefault();
            evt.target.setCustomValidity("Error");

            console.log(evt.target.validity);
            for (const key in evt.target.validity) {
                if (evt.target.validity[key] === true) {
                    console.log(key);
                }
            }

            evt.target.placeholder = "Error";



            // evt.preventDefault();
            // console.log(this.reportValidity());
            //
            // formData.validity = formValidity(this);
            // formData.data = formDataGrabber(this);
            // console.log(formData);
        }, true);
    }


    form.addEventListener("submit", function (evt) {
        if (!this.checkValidity()) {

            // console.dir(this);
            // console.dir(this.elements);
            // console.dir(this.elements["auth-submit"]);

            for (const formElement of this.elements) {
                if (formElement.nodeName === "INPUT" && formElement.type === "text") {
                    if (!formElement.checkValidity()) {
                        for (const key in formElement.validity) {
                            if (formElement.validity[key] === true) {
                                console.log(key);
                            }
                        }
                    }
                }

            }
            evt.preventDefault();
        }
    });


};








