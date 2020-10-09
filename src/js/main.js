

import "normalize.css";
import "../assets/scss/main.scss";
import "@babel/polyfill";
//require.context('../assets/img/', true, /\.jpe?g$|.png$|.svg$|.gif$/);

import {DomHelper} from "./components/helpers/DomHelper";
import {Request} from "./components/fetch/Request";





const showTablesBtn = document.querySelector(".show-tables");
const listOfTables = document.querySelector(".admin__list-of-sections");


if (showTablesBtn) {
    showTablesBtn.addEventListener("click", async function (evt) {
        evt.preventDefault();
        const request = await Request.send(`${evt.target.href.slice(evt.target.href.lastIndexOf("/") + 1)}`, {
            method: "GET"
        });

        try {
            listOfTables.innerHTML = "";
            JSON.parse(request).forEach(item => {
                const li = DomHelper.create({tag: "li"});
                const link = DomHelper.create({tag: "a", classes: ["admin__btn"], text: `${item.TABLE_COMMENT}`});
                link.addEventListener("click", renderTable);
                link.href = `table=${item.TABLE_NAME}`;
                li.append(link);
                listOfTables.append(li);
            });
        } catch (e) {
            console.log("error with get all tablees request", e.message);
        }
    });
}



const rootOfRecords = document.querySelector(".admin__records-wrapper");



async function renderTable(evt) {
    evt.preventDefault();
    const href = DomHelper.hrefParse(this.href);
    renderTableRecords(href).then();
}


async function deleteItem(evt) {
    evt.preventDefault();
    const href = DomHelper.hrefParse(this.href);

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
    const responce = await Request.send("/", options);
    renderTableRecords(href).then();
}


async function editItem (evt) {
    evt.preventDefault();
    const href = DomHelper.hrefParse(this.href);

    const request = await Request.send(`table=${href.table}&id=${href.id}`, {
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

    const request = await Request.send(`table=${href.table}&id=${href.id}`, {
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

    const request = await Request.send(`table=${href.table}`, {
        method: "POST",
        body: formData,
        headers: {
            "SubmitAddRecord": "Yes"
        }
    });
    renderTableRecords(href).then();
}


function renderItemEdit(parsedRequest, href) {
    const divWrapper = DomHelper.create({tag: "div", classes: ["admin__form-wrapper"]});

    const form = DomHelper.create({tag: "form", classes: ["admin__new-elem-form"]});
    form.addEventListener("submit", (evt) => evt.preventDefault());
    form.name = "admin__elem-form";

    const data = parsedRequest;

    for (const item in data) {
        const div = DomHelper.create({tag: "div"});
        const label = DomHelper.create({tag: "label", text: item});
        div.append(label);

        const input = DomHelper.create({tag: "input", classes: ["admin__form-input"]});
        input.type = "text";
        input.name = `${item}`;
        input.value = `${data[item]}`;
        input.required = true;
        div.append(input);
        form.append(div);
    }


    const submit = DomHelper.create({tag: "input", classes: ["admin__form-submit"]});
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
    const href = DomHelper.hrefParse(this.href);
    console.log(href);
    const request = await Request.send(`table=${href.table}`, {
        method: "GET",
        headers: {
            "AddRecord": "Yes"
        }
    });
    const parsedResponce = JSON.parse(request);

    rootOfRecords.innerHTML = "";
    const divWrapper = DomHelper.create({tag: "div", classes: ["admin__form-wrapper"]});

    const form = DomHelper.create({tag: "form", classes: ["admin__new-elem-form"]});
    form.addEventListener("submit", (evt) => evt.preventDefault());
    form.name = "admin__elem-form";


    parsedResponce.forEach(item => {
        if (!["id", "date"].includes(item)) {
            const div = DomHelper.create({tag: "div"});
            const label = DomHelper.create({tag: "label", text: item});
            div.append(label);

            const input = DomHelper.create({tag: "input", classes: ["admin__form-input"]});
            input.type = "text";
            input.name = `${item}`;
            input.required = true;
            div.append(input);
            form.append(div);
        }
    });

    const submit = DomHelper.create({tag: "input", classes: ["admin__form-submit"]});
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
    const request = await Request.send(`table=${href.table}`, {method: "GET"});
    const parsedRequest = JSON.parse(request);

    rootOfRecords.innerHTML = "";

    const addRecordBtn = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__add-item-btn"], text: "Добавить запись"});
    addRecordBtn.href = `table=${href.table}`;
    addRecordBtn.addEventListener("click", addRecord);
    rootOfRecords.prepend(addRecordBtn);


    const ul = DomHelper.create({tag:"ul", classes: ["admin__list-of-records"]});
    rootOfRecords.append(ul);

    parsedRequest.forEach(item => {
        const li = DomHelper.create({tag: "li"});
        for (const prop in item) {
            const p = DomHelper.create({tag: "p", classes: ["admin__field-record"], text: `${prop} : ${item[prop]}`});
            li.append(p);
        }
        const divControlsWrapper = DomHelper.create({tag: "div", classes: ["admin__table-controls"]});

        const ControlsBtnEdit = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__edit-item-btn"], text: "Edit"});
        ControlsBtnEdit.href = `table=${href.table}&action=edit&id=${item["id"]}`;
        ControlsBtnEdit.addEventListener("click", editItem, {once: true});
        divControlsWrapper.append(ControlsBtnEdit);

        const ControlsBtnDelete = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__delete-item-btn"], text: "Delete"});
        ControlsBtnDelete.href = `table=${href.table}&action=delete&id=${item["id"]}`;
        ControlsBtnDelete.addEventListener("click", deleteItem, {once: true});
        divControlsWrapper.append(ControlsBtnDelete);

        li.append(divControlsWrapper);
        ul.append(li);
    });
}





















