
export class Cart {
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


