"use strict";


const tabMaxHeightHandler = (tabsSelector) => {

    const tabMaxSizeArray = [];
    const tabCollection = document.querySelectorAll(tabsSelector);

    if (tabCollection.length !== 0) {
        tabCollection.forEach(item => {
           if (item.style.display === "none" || getComputedStyle(item).getPropertyValue("display") === "none") {
               item.style.display = "block";
               tabMaxSizeArray.push(item.clientHeight);
               item.style.display = "none";
           } else {
               tabMaxSizeArray.push(item.clientHeight);
           }
        });

        return Math.max(...tabMaxSizeArray);
    }

};

export default tabMaxHeightHandler;