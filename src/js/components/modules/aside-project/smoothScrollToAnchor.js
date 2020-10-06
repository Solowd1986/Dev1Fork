"use strict";


/*  При реализации планого скролла через якоря/ссылки помни, что нужно отменять поведенеи по-умолчанию, так как оно перекрывает
    собой попытку плавного скролла, по-умолчанию клик на ссылку с якорем тут же переносит нас к элементу, поэтому по клику на
    ссылку в первую очередь блокируется preventDefault.
================================
*/


function createGoUpBtn({styleClass, innerText, classActive, parentNode}) {
    const btnScrollUp = document.createElement("button");
    btnScrollUp.classList.add(styleClass);
    btnScrollUp.innerText = innerText;
    parentNode.appendChild(btnScrollUp);

    btnScrollUp.addActiveClass = () => {
        btnScrollUp.classList.add(classActive);
    };

    btnScrollUp.removeActiveClass = () => {
        btnScrollUp.classList.remove(classActive);
    };

    btnScrollUp.addEventListener("click", function (evt) {
        window.scrollTo({
            top: 0,
            behavior: "smooth"})
    });

    return btnScrollUp;
}


const smoothScrollToAnchor = ({controlsSelectors, goUpButtonOptions}) => {

    const controls = document.querySelectorAll(controlsSelectors);

    if (controls.length !== 0) {
        const btnScrollUp = createGoUpBtn(goUpButtonOptions);

        if (window.scrollY > window.innerHeight) {
            btnScrollUp.addActiveClass();
        }

        window.addEventListener("scroll", function (evt) {
            (window.scrollY > window.innerHeight) ? btnScrollUp.addActiveClass() : btnScrollUp.removeActiveClass();
        });

        controls.forEach(item => {
            item.addEventListener("click", function (evt) {
                evt.preventDefault();
                const targetAnchor = document.querySelector(evt.target.hash);
                if (targetAnchor !== null) {
                    window.scrollTo({
                        top: window.scrollY + Math.round(targetAnchor.getBoundingClientRect().top),
                        behavior: "smooth"})
                } else {
                    console.log("Target anchor hash is not found");
                }
            });
        });
    }
};

export default smoothScrollToAnchor;