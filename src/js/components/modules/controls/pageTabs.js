"use strict";




const pageTabs = () => {

        function tabsBuilder([tabLinksListSelector, tabBodyListSelector, tabActiveLinkClassSelector, tabActiveBodyClassSelector, tabDataAttrName]){

            const tabLinksList = document.querySelectorAll(tabLinksListSelector);
            const tabBodyList = document.querySelectorAll(tabBodyListSelector);
            const tabActiveLinkClass = tabActiveLinkClassSelector;
            const tabActiveBodyClass = tabActiveBodyClassSelector;
            const tabDataAttr = tabDataAttrName;


            tabLinksList.forEach((value) => value.addEventListener("click", function (e) {
                e.preventDefault();

                if (!this.classList.contains(tabActiveLinkClass)) {
                    [].find.call(tabLinksList, value => value.classList.contains(tabActiveLinkClass)).classList.remove(tabActiveLinkClass);
                    this.classList.add(tabActiveLinkClass);


                    tabBodyList.forEach((value) => {
                        if (value.classList.contains(tabActiveBodyClass)) {
                            value.classList.remove(tabActiveBodyClass);
                        }

                        if (value.dataset[tabDataAttr] === this.dataset[tabDataAttr]) {
                            value.style.cssText = "transition: .7s linear";
                            value.classList.add(tabActiveBodyClass);
                        }
                    });
                }
            }));
        }


    if (window.location.pathname.slice(1) === 'profile.html') {
        const tabs = tabsBuilder([
            ".profile-tab__item",
            ".profile-tab__content",
            "profile-tab__item--active",
            "profile-tab__content--active",
            "profiletab"
        ]);
    }

    if (window.location.pathname.slice(1) === 'single-item.html') {
        const tabs = tabsBuilder([
            ".movie-nav__item",
            ".tab",
            "movie-nav__item--active",
            "tab-active",
            "movietab"
        ]);
    }
};


export default pageTabs;



function slowTabs() {

    const tabs = document.querySelectorAll(".pageTabs-item");
    const tabsBtn = document.querySelectorAll(".tabsBtn");
    let isAnimationRunning = false;


    if (tabs.length !== 0 && tabsBtn !== undefined) {

        function calcTabsSizes(tabs) {
            const tabsSizes = {};

            tabs.forEach(value => {
                if (value.classList.contains("pageTabs-hide")) {
                    value.classList.remove("pageTabs-hide");
                    tabsSizes[value.dataset.tabsname] = value.clientHeight;
                    value.classList.add("pageTabs-hide");
                } else {
                    tabsSizes[value.dataset.tabsname] = value.clientHeight;
                }
            });

            tabsSizes.maxElemHeight = Math.max.call(...Object.values(tabsSizes));
            return tabsSizes;
        }

        const tabsSizes = calcTabsSizes(tabs);


        tabsBtn.forEach(value => {
            value.addEventListener("click", function (evt) {

                const activeTab = [].find.call(tabs, value => !value.classList.contains("pageTabs-hide"));
                const targetTab = [].find.call(tabs, tab => tab.dataset.tabsname === this.dataset.tabsname);


                if (targetTab.classList.contains("pageTabs-hide")) {

                    if (isAnimationRunning) {
                        return;
                    }
                    isAnimationRunning = true;


                    const loadTabs = new Promise((resolve) => {
                        activeTab.style.height = `${tabsSizes[activeTab.dataset.tabsname]}px`;
                        activeTab.addEventListener("transitionend", function (evt) {
                            resolve();
                        }, {once: true});
                        setTimeout(() => {
                            activeTab.style.height = "0";
                        }, 0);
                    });
                    loadTabs.then(() => {
                        activeTab.style.removeProperty("height");
                        activeTab.classList.add("pageTabs-hide");

                        targetTab.style.height = `${tabsSizes[targetTab.dataset.tabsname]}px`;
                        targetTab.classList.remove("pageTabs-hide");

                        targetTab.addEventListener("transitionend", function (evt) {
                            isAnimationRunning = false;
                        }, {once: true});
                    });
                }
            });
        })
    }


}

slowTabs();