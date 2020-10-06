"use strict";

const formHadler = (formSelector, url, callback) => {

    const formCollection = document.querySelectorAll(formSelector);

    if (formCollection.length !== 0) {
        formCollection.forEach(formItem => {

            formItem.addEventListener("submit", async function (evt) {
                evt.preventDefault();

                const form = new FormData(formItem);

                const send = async (url, data) => {
                    return await fetch(url, {
                        method: "POST",
                        body: data
                    }).then(responce => responce.json());
                };

                send(url, form).then(data => {
                    callback(data);
                });
            });
        })
    }
};


export default formHadler;
