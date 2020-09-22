
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";


require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);


import {cnt} from "./data";
import info from "./data";


const data = {
  phone: {
      cnt: 12,
      price: 1000
  }
};


class Component {
    constructor(props) {
        this.props = props;
    }

    render() {

    }
}

const props = {
    range: ".range-quantity"
};

function f2() {
    const range = document.querySelector(".range-quantity");
    const rangeParent = document.querySelector(".range-quantity").parentElement;
    let rangeElem = null;
    range.addEventListener("change", function (evt) {
        if (rangeElem !== null) {
            return;
        }
        rangeElem = document.createElement("input");
        rangeElem.type = "range";
        rangeElem.min = "1";
        rangeElem.max = "6";
        rangeParent.appendChild(rangeElem);
        console.log(this.value);
    });
}

f2();


const base = new Component(props);


const orderButtnos = document.querySelectorAll(".select-quantity");

const orderParent = document.querySelector(".list-goods");


function normilize (val) {
    let value = parseInt(val);
    let max = 10;
    let min = 1;
    if (isNaN(value) || value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }
    return value;
}

// orderParent.addEventListener("click", function (evt) {
//   if (evt.target.classList.contains("select-quantity")) {
//       for (let item of evt.target.parentElement.children) {
//           if (item.classList.contains("goods-quantity")) {
//               item.value = normilize(item.value);
//           }
//       }
//   }
// }, true);
//
//
// orderParent.addEventListener("click", function (evt) {
//     if (evt.target.classList.contains("delete-item")) {
//         evt.target.parentElement.parentElement.remove();
//     }
// }, true);


const classes = {
    list: "list-goods",
    item: "goods-item",
    itemDesc: "goods-desc",
    orderWrapper: "wrapper-order",
    inputQuantity: "goods-quantity",
    btnChangeQuantity: "btn-order-cart select-quantity",
    btnDeleteItem: "btn-order-cart delete-item",
};

const dataItems = [
    {quantity: 1, price: 2000, title: "Samsung S20"},
    {quantity: 3, price: 4350, title: "Apple XL"},
    {quantity: 4, price: 6200, title: "Nokia 3100"},
];

const dataAll = {
    dataItems: dataItems,
    classes: classes

};




const request = fetch("data.php",
    {
        method: "POST"
    }
);

// request.then(result => result.json())
//     .then(result => {
//         console.log(result);
//     }
// );


const text = document.querySelector(".text");
text.tabIndex = 0;

const parentNode = document.querySelector(".parent");

//
// parentNode.addEventListener("focusin", function (evt) {
//
//     if (evt.target !== this) {
//         const textarea = document.createElement("textarea");
//         textarea.value = evt.target.innerText;
//         evt.target.replaceWith(textarea);
//         textarea.focus();
//     }
// });
//
// parentNode.addEventListener("focusout", function (evt) {
//
//     if (evt.target.nodeName !== "DIV") {
//         const div = document.createElement("div");
//         div.textContent += evt.target.value + '1';
//         evt.target.replaceWith(div);
//     }
// });


//
// function onfocusElem(evt) {
//         const textarea = document.createElement("textarea");
//         textarea.value = evt.target.innerText;
//         evt.target.replaceWith(textarea);
//         textarea.focus();
//         textarea.addEventListener("focusout", onblurElem);
// }
//
//
// function onblurElem(evt) {
//     const div = document.createElement("div");
//     div.textContent += evt.target.value;
//     div.tabIndex = 0;
//     evt.target.replaceWith(div);
//     div.addEventListener("focusin", onfocusElem);
// }
//
// text.addEventListener("focusin", onfocusElem);


const inp = document.querySelector("form>input:first-of-type");
const form = document.querySelector("form.fr");
inp.focus();

console.log(document.activeElement);
console.log(Array.from(form.elements).includes(document.activeElement));

document.addEventListener("keyup", function (evt) {


    if (evt.key === "Tab" && !Array.from(form.elements).includes(document.activeElement)) {
        form.elements[0].focus();
    } else {
        console.log(11);
    }

    console.log(document.activeElement);
    
    console.log(evt.key);
    
});

console.log(inp);



const table = document.querySelector("#bagua-table");
let flag = true;

table.addEventListener("click", function (evt) {
    if (evt.target.nodeName === "TD") {

        if (!flag) {
            return;
        }
        flag = false;

        const td = evt.target;
        let text = evt.target.innerHTML;
        const textarea = document.createElement("textarea");
        textarea.value = evt.target.innerHTML;
        textarea.style.height = `${evt.target.clientHeight}px`;
        textarea.style.width = `${evt.target.clientWidth}px`;

        //evt.target.parentElement.append(textarea);
        td.innerHTML = '';
        td.append(textarea);

        const ok = document.createElement("button");
        const cancel = document.createElement("button");

        ok.innerText = "OK";
        cancel.innerText = "Cancel";

        ok.style.cssText = "background-color: red; display: block; margin: 10px auto";
        cancel.style.cssText = "background-color: red; display: block; margin: 10px auto";

        td.append(ok);
        td.append(cancel);

        ok.addEventListener("click", function (evt) {
            flag = true;
            td.innerHTML = textarea.value;
            textarea.remove();
        });

        cancel.addEventListener("click", function (evt) {
            flag = true;
            td.innerHTML = text;
            textarea.remove();
        });



    }

});



















class Request {
    static sendRequest(url, options = {}) {
        return fetch(url, {
            method: options.method
        }).then(response => {
            if (!response.ok) {
                return response.text().then(error => {
                    throw new Error(`HTTP Request Error\nStatus: ${response.status}\nMessage: ${error.match(/<pre>(?<errorMsg>.*)<\/pre>/i) !== null 
                        ? error.match(/<pre>(?<errorMsg>.*)<\/pre>/i).groups.errorMsg
                        : "Error (RegExp returned null"}`);
                });
            } else {
                return response.json();
            }
        });
    }


    async getData() {
        await Request.sendRequest("data.php", {method: "POST"}).
        then(res => {
            //console.log(res);
        }).
        catch(e => {
            console.log(e)
        });
    }

    result() {
        //this.hre();

        this.getData().then(res => (res));

        //console.log(data);

        //return this.getData().then(res => res);

        //let r = data.then(res => res);
        //console.log(data);
        
        //return r;
    }
}

new Request().getData().then();











class Cart {
    constructor(props) {
        this.props = props;
    }

    static normalize(val) {
        let value = parseInt(val);
        let max = 10;
        let min = 1;
        if (isNaN(value) || value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;

    }

    cartListGenerator(className) {

        const ul = document.createElement("ul");
        ul.classList.add(className);
        return ul;
    }

    cartListItemGenerator(item) {
        const li = document.createElement("li");
        li.classList.add(this.props.classes.item);

        const span = document.createElement("span");
        span.classList.add(this.props.classes.itemDesc);
        span.textContent = item.title;

        li.appendChild(span);

        const divWrapper = document.createElement("div");
        divWrapper.classList.add(this.props.classes.orderWrapper);

        const input = document.createElement("input");
        input.classList.add(this.props.classes.inputQuantity);
        input.type = "text";
        input.value = item.quantity;

        input.addEventListener("blur", function (evt) {
            input.value = Cart.normalize(input.value);
        });

        divWrapper.appendChild(input);

        const btn = document.createElement("button");
        btn.classList.add(...this.props.classes.btnDeleteItem.split(" "));
        btn.textContent = "Delete";

        btn.addEventListener("click", function (evt) {
            li.remove();
        });

        divWrapper.appendChild(btn);

        li.appendChild(divWrapper);
        return li;
    }


    render() {
        const ul = document.createElement("ul");
        ul.classList.add(this.props.classes.list);

        for (let item of this.props.dataItems) {
            let li = this.cartListItemGenerator(item);
            ul.appendChild(li)
        }
        return ul;
    }
}



// const list = new Cart(dataAll).render();
//
// const t = document.querySelector(".inner-list");
// t.appendChild(list);




async function f1() {
    await new Promise(resolve => {
        setTimeout(() => {
            console.log("st");
            resolve();
            }, 2000);
    });
    console.log("done");
    return "all stuff";
}

//f1().then(data => console.log(data));

























