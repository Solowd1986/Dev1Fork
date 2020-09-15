
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

let str = "name ll";
if (str.indexOf(" ") !== -1) {
    console.log(...str);
}



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

    cartListGenetarot(className) {

        const ul = document.createElement("ul");
        ul.classList.add(className);
        return ul;
    }

    cartListItemGenetarot(item) {
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

        li.appendChild(divWrapper);
        return li;
    }


    render() {
        const ul = document.createElement("ul");
        ul.classList.add(this.props.classes.list);

        for (let item of this.props.dataItems) {
            let li = this.cartListItemGenetarot(item);
            ul.appendChild(li)
        }
        return ul;
    }
}


const list = new Cart(dataAll).render();

const t = document.querySelector(".inner-list");
t.appendChild(list);




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

























