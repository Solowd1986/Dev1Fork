"use strict";


const ajaxRequest = function(url, responseContainerSelector) {

    const responseContainer = document.querySelector(responseContainerSelector);

    if (responseContainer !== null) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        //xhr.responseType = "json";

        xhr.addEventListener("readystatechange", function (evt) {
            if (this.status >= 400) {
                responseContainer.innerHTML = `<p>Запрос завершился с ошибкой: ${this.status} (${this.statusText})</p>`;
            }

            if (this.readyState === 4 && this.status === 200) {
                // for (const key in this.response) {
                //     responseContainer.innerHTML += `<p>${key} - ${this.response[key]}</p>`;
                // }


                responseContainer.innerHTML = `<p>${this.responseText}</p>`;

            }

        });


        xhr.open("POST", url);
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //const str = "name=Bob&age=17";
        //const obj = {name: "alex",name2:'Павел'};
        const form = document.querySelector(".form-base");

        //xhr.send(new URLSearchParams(obj).toString());
        xhr.send(new FormData(form));
    }
};


export default ajaxRequest;


