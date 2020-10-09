
import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
import formHandler from "./components/modules/form/formHandler";


require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);





const df = {days: 12, hours: 2, minutes: 30, seconds: 30};

function dateOffsetHelper(offset) {

    let dateInitial = Date.now();

    if ("days" in offset) {
        dateInitial += parseInt(offset.days) * 24 * 60 * 60 * 1000;
    }
    if ("hours" in offset) {
        dateInitial += parseInt(offset.hours) * 60 * 60 * 1000;
    }
    if ("minutes" in offset) {
        dateInitial += parseInt(offset.minutes) * 60 * 1000;
    }
    if ("seconds" in offset) {
        dateInitial += parseInt(offset.seconds) * 1000;
    }
    return new Date(dateInitial);
}





class CookieHelper {

    static hasCookie(cookieName) {
        if (document.cookie.length > 0) {
            return document.cookie.split(";").map(item => item.trim().match(/(?<name>.*?)=/).groups.name).includes(cookieName);
        } else {
            return  false;
        }
    }

    static cookieDateExpireHelper(milliseconds, toUTCString = false) {
        return !toUTCString
            ? new Date(milliseconds)
            : (new Date(milliseconds + Math.abs(new Date().getTimezoneOffset() * 60 * 1000))).toUTCString();
    }


    static getCookie(name) {
        if (CookieHelper.hasCookie(name)) {
            const cookieMatch = document.cookie.split(";").find(item => decodeURIComponent(item.trim().match(/(?<name>.*?)=/).groups.name) === name).split("=");
            try {
                const cookieParsedValue = JSON.parse(decodeURIComponent(cookieMatch[1]));
                return {name: decodeURIComponent(cookieMatch[0]), value: cookieParsedValue};
            } catch (e) {
                return {name: decodeURIComponent(cookieMatch[0]), value: decodeURIComponent(cookieMatch[1])};
            }
        } else {
            return false;
        }
    }

    static setCookie(name, value, options = {}) {
        let opt = "";
        if (Object.keys(options).length !== 0) {
            Object.keys(options).forEach((item, key, array) => {
                opt += (array.indexOf(item) + 1 !== array.length) ? item + "=" + options[item] + "; " : item + "=" + options[item] + "";
            });
        }
        //console.log(opt);
        document.cookie = `${encodeURIComponent(name)}= ${encodeURIComponent(JSON.stringify(value))};` + opt;
    }
}





(function () {
    if (CookieHelper.hasCookie("auth")) {
        const data = CookieHelper.getCookie("auth");

        const au = document.querySelector(".user-auth");
        const form = document.querySelector(".form");
        form.replaceWith((UserAccountForm(data)));
    }
})();





function UserAccountForm(data) {

    const div = document.createElement("div");
    div.style.cssText = "padding: 5px 10px; margin: 20px auto; width: 30%; border: 2px solid black";
    const p = document.createElement("p");
    p.innerText = `Hello ${data.value.name}`;
    p.style.cssText = "margin-right: 10px";
    const button = document.createElement("button");
    button.innerText = "Exit";
    button.style.cssText = "background-color: red; color: white; padding: 2px 10px; align-self: center";

    div.append(p);
    div.append(button);

    return div;
}



function render(form) {
    if (CookieHelper.hasCookie("auth")) {
        const data = CookieHelper.getCookie("auth");

        console.log(data);

        // const div = document.createElement("div");
        // div.style.cssText = "padding: 5px 10px; margin: 20px auto; width: 30%; border: 2px solid black";
        // const p = document.createElement("p");
        // p.innerText = `Hello ${data.value.name}`;
        // p.style.cssText = "margin-right: 10px";
        // const button = document.createElement("button");
        // button.innerText = "Exit";
        // button.style.cssText = "background-color: red; color: white; padding: 2px 10px; align-self: center";


        const div = UserAccountForm(data);

        div.children[1].addEventListener("click", () => {
            userExit(data.name, div, form).then()
        });

        // div.append(p);
        // div.append(button);


        form.replaceWith(div);
    }
}


function ins($token) {
    const wrp = document.querySelector(".profile-block");
    const user = {name: "Bob"};
    const data = UserAuth.decodeSignedData($token);
    const p = document.createElement("p");
    (data.login !== "undefined") ? p.innerText = data.login : p.innerText = "John Doe";
    wrp.append(p);
}






class LocalStorageHelper {
    
    static getItem(key) {
        if (localStorage.getItem(key)) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        } else {
            console.log("Элемента с таким ключом в localStorage не найдено");
        }
    }


    static setItem(key, value) {
        if (localStorage.getItem(key)) {
            console.log("Элемент с таким ключом уже есть в localStorage");
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }

}




async function userExit(name, div, form) {
    const responce = await Request.sendRequest("/dist/data.php", {
        method: "GET",
        headers: {
            "User-Exit": "auth"
        }
    });
    div.replaceWith(form);
}


const bresp = document.querySelector(".get-data");
const exitBtn = document.querySelector(".exit-data");
const answer = document.querySelector(".resp");

if (exitBtn && bresp) {
    exitBtn.addEventListener("click", function (evt) {
        if (localStorage.getItem("token-key")) {
            localStorage.removeItem("token-key");
        }
    });
    bresp.addEventListener("click", async function (evt) {
        if (localStorage.getItem("token-key")) {

            const reg = LocalStorageHelper.getItem("token-key");
            const ans = await UserAuth.tokenResponce(reg);


            if (UserAuth.decodeSignedData(ans).allowed) {
                if (UserAuth.decodeSignedData(ans)["has-expired"]) {
                    localStorage.removeItem("token-key");
                    console.log("token has removed like expired");
                } else {
                    console.log(UserAuth.decodeSignedData(ans));
                    const data = UserAuth.decodeSignedData(reg);
                    console.dir(data);
                    answer.innerText = data.login;
                }
            } else {
                localStorage.removeItem("token-key");
                answer.innerText = "User not auth";
            }
        } else {
            answer.innerText = "User not auth";
        }
    });


}





class ModalComponent {
    constructor(modalOptions) {
        this.options = modalOptions;
    }

    createOverlay(parentElement, childElement) {
        let elemOverlay = document.createElement("div");
        this.options.overlayClass ? elemOverlay.classList.add(this.options.overlayClass) : elemOverlay.style.csstest = "position: relative;";

        elemOverlay.addEventListener("click", function (evt) {
            this.remove();
            elemOverlay = null;
        });

        elemOverlay.append(childElement);
        parentElement.append(elemOverlay);
    }
}





class Delete {

    static async formHandler(id, table) {
        const formData = new FormData();
        formData.append("table", table);
        formData.append("id", id);
        const options = {
            method: "POST",
            body: formData,
            headers: {
                "Request-Type" : "Record-Delete"
            }
        };
        const responce = await Request.sendRequest("/", options);
        console.dir(responce);
    }
}


class Edit {
    constructor (parent, target, data) {
        this.parent = parent;
        this.target = Edit.URIHelper(target);
        this.data = this.dataIdHelper(data);
    }

    dataIdHelper(data) {
        for (const item of Object.values(data)) {
            if (item.id === parseInt(this.target.id)) {
                return item;
            }
        }
    }

    static URIHelper(uri) {
        const obj = {};
        uri.slice(uri.lastIndexOf("/") + 1).split("&").forEach(item => {
            obj[item.split("=")[0]] = item.split("=")[1];
        });
        return obj;
    }


    formHandler(elem, table) {
        elem.addEventListener("click", async function (evt) {
            evt.preventDefault();
            const formData = new FormData(elem.form);
            formData.append("table", table);
            const options = {
                method: "POST",
                body: formData,
                headers: {
                    "Request-Type" : "Record-Edit"
                }
            };
            const responce = await Request.sendRequest("/", options);
            console.dir(responce);
        });
    }

    render() {

        const divWrapper = document.createElement("div");
        divWrapper.classList.add("admin__form-wrapper");

        divWrapper.addEventListener("click", function (evt) {
            evt.stopPropagation();
        });


        const h3 = document.createElement("h3");
        h3.classList.add("admin__title-of-element");
        h3.innerText = "Новый элемент";
        divWrapper.append(h3);

        const form = document.createElement("form");
        form.classList.add("admin__new-elem-form");
        form.name = "admin__elem-form";


        for (const item in this.data) {
            const div = document.createElement("div");

            const label = document.createElement("label");
            label.innerText = item;
            div.append(label);

            const input = document.createElement("input");
            input.classList.add("admin__form-input");
            input.type = "text";
            input.name = `${item}`;
            input.value = `${this.data[item]}`;
            input.required = true;
            div.append(input);
            form.append(div);

        }


        const submit = document.createElement("input");
        submit.classList.add("admin__form-submit");
        submit.type = "submit";
        submit.name = "auth-submit";
        submit.value = "Send";

        this.formHandler(submit, this.target.table);

        form.append(submit);

        form.addEventListener("submit", function (evt) {
            evt.preventDefault();

        });
        divWrapper.append(form);
        this.parent.append(divWrapper);
    }
}


const dataSet = {name: "bob", id: 12};
const wrp = document.querySelector(".wrp");

// new Edit(wrp, "", dataSet).render();



const rootElem = document.querySelector("div");


rootElem.addEventListener("clic1k", async function (evt) {
    evt.preventDefault();
    //console.dir(evt.target);

    if (evt.target.href && evt.target.href.includes("tablename")) {
        //console.log(evt.target.href);

        const request = await Request.sendRequest(`${evt.target.href.slice(evt.target.href.lastIndexOf("/") + 1)}`, {
            method: "GET"
        });

        try {
            //console.log(JSON.parse(request));
            const data = JSON.parse(request);
            rootOfRecords.innerHTML = "";

            rootOfRecords.addEventListener("click", function (evt) {
                evt.preventDefault();
                if (evt.target.href) {
                    const href = Edit.URIHelper(evt.target.href);
                    if (href.action === "edit") {
                        console.dir(evt.target);

                        listOfElemWrapper.innerHTML = "";

                        //console.log(data);

                        //let singleItemData =
                        new Edit(listOfElemWrapper, evt.target.href, data).render();
                    }

                    if (href.action === "delete") {
                        //Delete.formHandler(href.id, href.table);
                        console.log("delete");
                    }

                    if (href.action === "insert") {
                        console.log("insert");
                    }

                }
            }, {once: true});


            const tableName = evt.target.href.match(/tablename=(?<name>.*)/).groups.name;



            const recordsTableTitle = document.createElement("h3");
            recordsTableTitle.classList.add("admin__table-title");
            recordsTableTitle.innerText = "Таблица: " +  data.table;
            delete data.table;

            //rootOfRecords.prepend(recordsTableTitle);
            rootOfRecords.prepend(recordsTableTitle);



            const listOfElemWrapper = document.createElement("div");
            const tableListOfElem = document.createElement("ul");
            tableListOfElem.classList.add("admin__list-of-records");


            const recordsAddBtn = document.createElement("a");
            recordsAddBtn.classList.add("admin__btn", "admin__add-item-btn");
            recordsAddBtn.href = `table=${tableName}&action=insert`;
            recordsAddBtn.innerText = "Добавить новый элемент";
            listOfElemWrapper.prepend(recordsAddBtn);


            listOfElemWrapper.append(tableListOfElem);
            rootOfRecords.append(listOfElemWrapper);

            for (const item of Object.values(data)) {

                const li = document.createElement("li");

                for (const prop in item) {
                    const p = document.createElement("p");
                    p.classList.add("admin__field-record");
                    p.innerText = `${prop} : ${item[prop]}`;
                    li.append(p);
                }


                const divControlsWrapper = document.createElement("div");
                divControlsWrapper.classList.add("admin__table-controls");


                const ControlsBtnEdit = document.createElement("a");
                ControlsBtnEdit.classList.add("admin__btn", "admin__edit-item-btn");
                ControlsBtnEdit.innerText = "Edit";
                ControlsBtnEdit.href = `table=${tableName}&action=edit&id=${item["id"]}`;





                const ControlsBtnDelete = document.createElement("a");
                ControlsBtnDelete.classList.add("admin__btn", "admin__delete-item-btn");
                ControlsBtnDelete.href = `table=${tableName}&action=delete&id=${item["id"]}`;
                ControlsBtnDelete.innerText = "Delete";


                divControlsWrapper.append(ControlsBtnEdit, ControlsBtnDelete);
                li.append(divControlsWrapper);
                // for (let i = 12; i--;) {
                //     tableListOfElem.appendChild(li.cloneNode(true));
                // }
                tableListOfElem.append(li);
            }


        } catch (e) {
            console.log("error with get all tablees request", e.message + e.lineNumber);
        }
    }
}, {once: true});










function URIHelper(href) {
    const obj = {};
    obj.fullQuery = href.slice(href.lastIndexOf("/") + 1);
    href.slice(href.lastIndexOf("/") + 1).split("&").forEach(item => {
        obj[item.split("=")[0]] = item.split("=")[1];
    });
    return obj;
}


function createElem({tag, classes = [], text = ""} = {}) {
    const elem = document.createElement(tag);
    classes.length > 0 ? elem.classList.add(...classes) : null;
    text !== "" ? elem.innerText = text : null;
    return elem;
}



const showTablesBtn = document.querySelector(".show-tables");
const listOfTables = document.querySelector(".admin__list-of-sections");
showTablesBtn.addEventListener("click", async function (evt) {
    evt.preventDefault();
    const request = await Request.sendRequest(`${evt.target.href.slice(evt.target.href.lastIndexOf("/") + 1)}`, {
        method: "GET"
    });

    try {
        listOfTables.innerHTML = "";
        JSON.parse(request).forEach(item => {
            const li = createElem({tag: "li"});
            const link = createElem({tag: "a", classes: ["admin__btn"], text: `${item.TABLE_COMMENT}`});
            link.addEventListener("click", renderTable);
            link.href = `table=${item.TABLE_NAME}`;
            li.append(link);
            listOfTables.append(li);
        });
    } catch (e) {
        console.log("error with get all tablees request", e.message);
    }
});



const rootOfRecords = document.querySelector(".admin__records-wrapper");


async function renderTable(evt) {
    evt.preventDefault();
    const href = URIHelper(this.href);
    renderTableRecords(href).then();
}




async function deleteItem(evt) {
    evt.preventDefault();
    const href = URIHelper(this.href);

    const formData = new FormData();
    formData.append("table", href.table);
    formData.append("id", href.id);
    const options = {
        method: "POST",
        body: formData,
        headers: {
            "Request-Type" : "Record-Delete"
        }
    };
    const responce = await Request.sendRequest("/", options);
    renderTableRecords(href).then();
}


async function editItem (evt) {
    evt.preventDefault();
    const href = URIHelper(this.href);
    
    const request = await Request.sendRequest(`table=${href.table}&id=${href.id}`, {
        method: "GET",
        headers: {
            "Delete": "Yes"
        }
    });
    
    const parsedRequest = JSON.parse(request);
    rootOfRecords.innerHTML = "";
    rootOfRecords.append(renderItemEdit(parsedRequest, href));
}


async function submitEditRecord(evt) {
    const href = JSON.parse(this.dataset.href);

    const formData = new FormData(this.form);
    formData.append("table", href.table);
    formData.append("id", href.id);

    const request = await Request.sendRequest(`table=${href.table}&id=${href.id}`, {
        method: "POST",
        body: formData,
        headers: {
            "Edit": "Yes"
        }
    });
    renderTableRecords(href).then();
}


async function submitAddRecord(evt) {
    const href = JSON.parse(this.dataset.href);

    const formData = new FormData(this.form);
    formData.append("table", href.table);

    const request = await Request.sendRequest(`table=${href.table}`, {
        method: "POST",
        body: formData,
        headers: {
            "SubmitAddRecord": "Yes"
        }
    });
    renderTableRecords(href).then();
}


function renderItemEdit(parsedRequest, href) {
    const divWrapper = createElem({tag: "div", classes: ["admin__form-wrapper"]});

    const form = createElem({tag: "form", classes: ["admin__new-elem-form"]});
    form.addEventListener("submit", (evt) => evt.preventDefault());
    form.name = "admin__elem-form";

    const data = parsedRequest;
    console.log(12);
    
    for (const item in data) {
        const div = createElem({tag: "div"});
        const label = createElem({tag: "label", text: item});
        div.append(label);

        const input = createElem({tag: "input", classes: ["admin__form-input"]});
        input.type = "text";
        input.name = `${item}`;
        input.value = `${data[item]}`;
        input.required = true;
        div.append(input);
        form.append(div);
    }


    const submit = createElem({tag: "input", classes: ["admin__form-submit"]});
    submit.type = "submit";
    submit.name = "auth-submit";
    submit.value = "Send";
    submit.dataset.href = JSON.stringify(href);
    submit.addEventListener("click", submitEditRecord, {once: true});

    form.append(submit);
    divWrapper.append(form);
    return divWrapper;
}





async function addRecord(evt) {
    evt.preventDefault();
    const href = URIHelper(this.href);
    console.log(href);
    const request = await Request.sendRequest(`table=${href.table}`, {
        method: "GET",
        headers: {
            "AddRecord": "Yes"
        }
    });
    const parsedResponce = JSON.parse(request);

    rootOfRecords.innerHTML = "";
    const divWrapper = createElem({tag: "div", classes: ["admin__form-wrapper"]});

    const form = createElem({tag: "form", classes: ["admin__new-elem-form"]});
    form.addEventListener("submit", (evt) => evt.preventDefault());
    form.name = "admin__elem-form";


    parsedResponce.forEach(item => {
        if (!["id", "date"].includes(item)) {
            const div = createElem({tag: "div"});
            const label = createElem({tag: "label", text: item});
            div.append(label);

            const input = createElem({tag: "input", classes: ["admin__form-input"]});
            input.type = "text";
            input.name = `${item}`;
            input.required = true;
            div.append(input);
            form.append(div);
        }
    });

    const submit = createElem({tag: "input", classes: ["admin__form-submit"]});
    submit.type = "submit";
    submit.name = "auth-submit";
    submit.value = "Send";
    submit.dataset.href = JSON.stringify(href);
    submit.addEventListener("click", submitAddRecord, {once: true});
    form.append(submit);
    divWrapper.append(form);
    rootOfRecords.append(divWrapper);
}


async function renderTableRecords(href) {
    const request = await Request.sendRequest(`table=${href.table}`, {method: "GET"});
    const parsedRequest = JSON.parse(request);

    rootOfRecords.innerHTML = "";

    const addRecordBtn = createElem({tag: "a", classes: ["admin__btn", "admin__add-item-btn"], text: "Добавить запись"});
    addRecordBtn.href = `table=${href.table}`;
    addRecordBtn.addEventListener("click", addRecord);
    rootOfRecords.prepend(addRecordBtn);
    
    
    const ul = createElem({tag:"ul", classes: ["admin__list-of-records"]});
    rootOfRecords.append(ul);

    parsedRequest.forEach(item => {
        const li = createElem({tag: "li"});
        for (const prop in item) {
            const p = createElem({tag: "p", classes: ["admin__field-record"], text: `${prop} : ${item[prop]}`});
            li.append(p);
        }
        const divControlsWrapper = createElem({tag: "div", classes: ["admin__table-controls"]});

        const ControlsBtnEdit = createElem({tag: "a", classes: ["admin__btn", "admin__edit-item-btn"], text: "Edit"});
        ControlsBtnEdit.href = `table=${href.table}&action=edit&id=${item["id"]}`;
        ControlsBtnEdit.addEventListener("click", editItem, {once: true});
        divControlsWrapper.append(ControlsBtnEdit);

        const ControlsBtnDelete = createElem({tag: "a", classes: ["admin__btn", "admin__delete-item-btn"], text: "Delete"});
        ControlsBtnDelete.href = `table=${href.table}&action=delete&id=${item["id"]}`;
        ControlsBtnDelete.addEventListener("click", deleteItem, {once: true});
        divControlsWrapper.append(ControlsBtnDelete);

        li.append(divControlsWrapper);
        ul.append(li);
    });
}


















class UserAuth {
    static decodeSignedData(str) {
        return JSON.parse(window.atob(str.substr(0, str.indexOf("|"))));
    }

    static async tokenResponce(token) {
        const tokenData = new FormData();
        tokenData.append("token", token);

        const options = {method: "POST", body: tokenData, headers: {
                'Token-Status': token,
            }};
        return await Request.sendRequest("data.php", options);
    }

    static formHandler(form) {
        if (form !== null && form.nodeType === 1 && form.nodeName === "FORM") {
            form.addEventListener("submit", async function (evt) {
                evt.preventDefault();

                const formDataSet = new FormData(evt.target);
                const options = {method: "POST", body: formDataSet, headers: {
                        'Data-Type': 'fetch/form-data',
                    }};


                try {
                    if (!Request.hasPersistentHeader("dame")) {
                        Request.definePersistentHeaders({dame: "next"},options)
                    }

                    const responce = await Request.sendRequest(form.action.match(/\..*?(?<action>\/.*)/).groups.action, options);



                    const div = document.querySelector(".result");

                    //div.innerHTML = responce;

                    div.innerHTML = UserAuth.decodeSignedData(responce);

                    ins(responce);
                    LocalStorageHelper.setItem("token-key", responce);
                    
                    console.log(UserAuth.decodeSignedData(responce));

                    //const ch2 = await UserAuth.tokenResponce(responce);
                    //console.dir(ch2);

                } catch (e) {
                    console.log("error when request to form:" ,e);
                }
            });
        }
    }
}
UserAuth.formHandler(document.querySelector(".form"));






class Request {
    static sendRequest(url, options, responceType = "text") {
        // Выносим сюда авторизацию, то есть каждый запрос отправит такой заголовок. Добавляем обьекту options обьект headers, на случай, если
        // запрос заголовков вообще не передал. Это чтоб пустому обьекту не присвоить заголовок.

        if (!('headers' in options)) {
          options.headers = {};
        }
        //options.headers.authUser = "<random_key>";


        let controller = new AbortController();
        setTimeout(() => controller.abort(), 4000);
        options.signal = controller.signal;

        /**
         * Тут исходим из того, что в url параметр передали /, при этом в href может быть что-то другое,
         * это нужно проверять на стороне запроса их функции
         * @type {string}
         */
        url = url === "/" ? "/dist/data.php" : "/dist/data.php?" + url;

        return fetch(url, options).then(response => {
            if (!response.ok) {
                return response.text().then(error => {
                    throw new Error(`HTTP Request Error\nStatus: ${response.status}\nMessage: ${error.match(/<pre>(?<errorMsg>.*)<\/pre>/i) !== null 
                        ? error.match(/<pre>(?<errorMsg>.*)<\/pre>/i).groups.errorMsg
                        : response.statusText}`);
                });
            } else {
                return response[responceType]();
            }
        });
    }
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




























