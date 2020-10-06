"use strict";

const generateListElements = (trigger, selector, itemClass, animateClassCollection) => {

    const btnShowMoreItems = document.querySelector(trigger);
    const listItems = document.querySelector(selector);

    if (btnShowMoreItems !== null && listItems !== null) {
        btnShowMoreItems.addEventListener("click", function (evt) {
            for (let i = 6; i--;) {
                const item = document.createElement("li");
                item.classList.add(itemClass);
                item.classList.add(...animateClassCollection);
                listItems.appendChild(item);
            }
        });
    }
};

export default generateListElements;