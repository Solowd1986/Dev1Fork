"use strict";

import "./bugs.js";




let flag = true;
let run = false;


function scrollDelay({directionToBottom = false} = {}) {
    if (window.innerHeight + Math.round(window.pageYOffset) >= document.documentElement.scrollHeight) {
        window.scrollTo({"top": 0, behavior: "smooth"});
        cnt = 0;
        return;
    }

    if (run) {
        return;
    }

    run = true;
    let result = !directionToBottom ? window.innerHeight + Math.round(window.pageYOffset) : Math.round(window.pageYOffset) - window.innerHeight;
    window.scrollTo({"top": result, behavior: "smooth"});

    let timer = null;
    window.addEventListener('scroll', function() {
        if(timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            run = false;
        }, 150);
    });
}



let initialScroll = 0;

window.addEventListener("scroll", function (evt) {
    let maxScroll = Math.round(window.pageYOffset);
    if (maxScroll > initialScroll) {
        initialScroll = maxScroll;
        scrollDelay();
    } else {
        initialScroll = maxScroll;
        scrollDelay({directionToBottom: true})
    }
});





