"use strict";

/*
================================
*/
const animateObjectsHandler = (
    trigger,
    selector,
    event,
    classHideElement,
    animateClassCollection) => {


    const triggerElement = document.querySelector(trigger);
    const elem = document.querySelectorAll(selector);

    if (triggerElement !== null && elem.length > 0) {
        triggerElement.addEventListener(event, function (evt) {
            elem.forEach(item => {
                item.classList.add(...animateClassCollection);
                item.classList.remove(classHideElement);
                if (item.style.display === "none") {
                    item.style.removeProperty("display");
                }
            })
        });
    }
};


export default animateObjectsHandler;