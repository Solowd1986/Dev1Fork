
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
//require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);

import {DomHelper} from "./components/helpers/DomHelper";
import {Request} from "./components/fetch/Request";

import {AdminInitPanel} from "./components/admin/AdminInitPanel";
import {CookieHelper} from "./components/helpers/CookieHelper";


//
// fetch("api/src")
//     .then((res) =>
//         res.text()
//             .then(res =>
//               //console.log(res)
//            ));


// fetch("/api/get")
//     .then((res) =>
//         res.text()
//             .then(res => console.log(res)));



new AdminInitPanel({
    shomListOfTablesBtn: ".show-tables",
    listOfTablesWrapper: ".admin__list-of-sections",
    listOfRecordsWrapper: ".admin__records-wrapper"
});

const app = document.querySelector(".app");

app.innerHTML = "APP";

const btn = document.querySelector(".show-btn");
const modal = document.querySelector(".show-modal");

btn.addEventListener("click", function (evt) {
    modal.classList.add("animate__animated", "animate__fadeIn");
    modal.style.display === "block" ?  modal.style.display = "none" :  modal.style.display = "block"
});


const form = document.querySelector(".form");

form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const file = document.querySelector("[data-file]");
    console.dir(file);

    const formData = new FormData(this);

    fetch("api/src", {
        method: "POST",
        body: formData
    }).then((res) => res.text().then(res => {
        console.log(res)

    }));

});


function overlay(elem) {
    let div = document.createElement("div");
    div.style.cssText = "" +
      "background-color: rgba(64, 64, 64, 0.5); " +
      "display: flex; " +
      "justify-content: center; " +
      "align-items: center; " +
      "position: fixed; " +
      "width: 100%; height: 100%";
    div.append(elem);
    document.body.append(div);
    document.body.style.overflow = "hidden";
    function remove() {
    }

    div.addEventListener("click", function (evt) {
        this.remove();
        document.body.style.removeProperty("overflow");
        div = null;
    });
}



const elem = document.createElement("div");
elem.style.backgroundColor = "green";
elem.style.cssText = "width: 500px; height: 400px; background-color: green";
elem.innerHTML = "Hello";
//overlay(elem);


const more = document.querySelector(".btn-more");

more.addEventListener("click", function (evt) {
    more.classList.add("active");
    document.body.style.overflow = "hidden";
    let overlay = document.createElement("div");
    overlay.classList.add("btn-overlay");
    document.body.append(overlay);



    const controller = new AbortController();
    const signal = controller.signal;

    setTimeout(() => controller.abort(), 5000);

    overlay.addEventListener("click", function (evt) {
        document.body.style.removeProperty("overflow");
        overlay.remove();
        overlay = null;
        controller.abort()
    });

    fetch("api/src", {signal}).then((res) => res.json().then(res => {
        more.classList.remove("active");
        document.body.style.removeProperty("overflow");

        overlay.remove();
        overlay = null;


        const parent = document.querySelector(".data-list");
        if (res.length === 0 ) {
            this.remove();
            return;
        }

        res.forEach(item => {
            const div = document.createElement("div");
            div.style.cssText = "height: 100px; background-color: green; text-align: center; margin: 10px";
            div.innerHTML = item;
            div.classList.add("animate__animated", "animate__fadeIn");
            parent.append(div);
        });
    })).catch(err => {
        more.classList.remove("active");
        console.log("abort from catch");
    }).finally(() => {
        console.log("abort from finally");


    });
});























































