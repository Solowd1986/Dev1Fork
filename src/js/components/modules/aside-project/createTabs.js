"use strict";

import tabMaxHeightHandler from "./tabMaxHeightHandler.js";

const bindTabs = (tabControlSelector, tabsListSelector, tabControlActive, tabItemActive) => {
    const tabControls = document.querySelector(tabControlSelector);
    const tabsList = document.querySelectorAll(tabsListSelector);



    if (tabControls !== null && tabsList.length !== 0) {

        tabControls.addEventListener("click", function (evt) {
            if (evt.target.classList.contains("tabs-title")) {
                [].slice.call(this.children).forEach(item => item.classList.remove(tabControlActive));
                evt.target.classList.add(tabControlActive);

                [].slice.call(tabsList).forEach(item => item.classList.remove(tabItemActive));
                const targetTab = [].slice.call(tabsList).find(item => item.dataset.id === evt.target.id);

                if (targetTab !== undefined) {
                    if (targetTab.style.display === "none") {
                        targetTab.style.removeProperty("display");
                    }
                    targetTab.classList.add(tabItemActive);
                }
            } else {
                console.log("Tab element not have target class");
            }
        });
    }
};


export default bindTabs;
