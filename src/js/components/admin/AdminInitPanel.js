
import {DomHelper} from "../helpers/DomHelper";
import {Request} from "../fetch/Request";

/**
 * При передаче селекторов, предпочительный вид - обьект с полями:
 * shomListOfTablesBtn - кнопка для вывода таблиц БД
 * listOfTablesWrapper - блок, где выведется список таблиц
 * listOfRecordsWrapper - блок, где выведутся все записи выбранной таблицы и формы добавления/редактирования элементов
 *
 * Вид разметки:
 * <a class="show-tables" href="tables">Вывести таблицы</a>
 * <ul class="admin__list-of-sections"></ul>
 * <div class="admin__records-wrapper"></div>
 */

export class AdminInitPanel {
    constructor(selectors) {
        this.selectors = selectors;
        this.init();
    }

    /**
     * Общая идея для предотвращения потери контекста при вкладывании коллбеков в обработчики событий
     * заключалась тут в том, что мы фиксируем контекст изначально, при передаче первого колбека в первый
     * обработчик клика покнопке демонстрации всех таблиц БД
     * И потом это нужно делать каждый раз при создании следующего обраотчика, как бы пробасывая контекст дальше
     * не давая его подменять в последующий addEventListener
     *
     *
     * Способы всегда пользоваться методами без потери контекста
     * 1. this.renderTable = this.renderTable.bind(this) - фиксируем контекст метода
     * 2. renderTable = async (evt) => {};
     *
     * Теперь методы можно передавать внутрь обработчиков событий и потери контекста не будет
     * Если нужно что-то от элемента, то доступ выполняется через evt.target
     */

    init() {
        if (DomHelper.checkSelectors(this.selectors)) {
            this.shomListOfTablesBtn = document.querySelector(this.selectors.shomListOfTablesBtn);
            this.listOfTablesWrapper = document.querySelector(this.selectors.listOfTablesWrapper);
            this.listOfRecordsWrapper = document.querySelector(this.selectors.listOfRecordsWrapper);
            this.showTablesBtnHandler();
        }
    }


    async renderTable(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);
        this.renderTableRecords(href).then();
    }


    
    // addRecord = async (evt) => {
    //     evt.preventDefault();
    //     console.log(12);
    //
    // };
    //


    async addRecord(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);
        const request = await Request.send(`table=${href.table}`, {
            method: "GET",
            headers: {
                "AddRecord": "Yes"
            }
        });
        const parsedResponce = JSON.parse(request);

        this.listOfRecordsWrapper.innerHTML = "";
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
        submit.addEventListener("click", this.submitAddRecord.bind(this), {once: true});
        form.append(submit);
        divWrapper.append(form);
        this.listOfRecordsWrapper.append(divWrapper);
    }

    async submitAddRecord(evt) {
        const href = JSON.parse(evt.target.dataset.href);
        const formData = new FormData(evt.target.form);
        formData.append("table", href.table);

        const request = await Request.send(`table=${href.table}`, {
            method: "POST",
            body: formData,
            headers: {
                "SubmitAddRecord": "Yes"
            }
        });
        this.renderTableRecords(href).then();
    }


    async editItem(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);

        const request = await Request.send(`table=${href.table}&id=${href.id}`, {
            method: "GET",
            headers: {
                "Delete": "Yes"
            }
        });

        const parsedRequest = JSON.parse(request);
        this.listOfRecordsWrapper.innerHTML = "";
        this.listOfRecordsWrapper.append(this.renderItemEdit(parsedRequest, href));
    }


    renderItemEdit(parsedRequest, href)  {
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
        submit.addEventListener("click", this.submitEditRecord.bind(this), {once: true});

        form.append(submit);
        divWrapper.append(form);
        return divWrapper;
    }


    async submitEditRecord(evt) {
        const href = JSON.parse(evt.target.dataset.href);

        const formData = new FormData(evt.target.form);
        formData.append("table", href.table);
        formData.append("id", href.id);

        const request = await Request.send(`table=${href.table}&id=${href.id}`, {
            method: "POST",
            body: formData,
            headers: {
                "Edit": "Yes"
            }
        });
        this.renderTableRecords(href).then();
    }



    async deleteItem(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);

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
        this.renderTableRecords(href).then();
    }



    async renderTableRecords(href) {
        const request = await Request.send(`table=${href.table}`, {method: "GET"});
        const parsedRequest = JSON.parse(request);

        this.listOfRecordsWrapper.innerHTML = "";

        const addRecordBtn = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__add-item-btn"], text: "Добавить запись"});
        addRecordBtn.href = `table=${href.table}`;
        addRecordBtn.addEventListener("click", this.addRecord.bind(this));
        this.listOfRecordsWrapper.prepend(addRecordBtn);


        const ul = DomHelper.create({tag:"ul", classes: ["admin__list-of-records"]});
        this.listOfRecordsWrapper.append(ul);

        parsedRequest.forEach(item => {
            const li = DomHelper.create({tag: "li"});
            for (const prop in item) {
                const p = DomHelper.create({tag: "p", classes: ["admin__field-record"], text: `${prop} : ${item[prop]}`});
                li.append(p);
            }
            const divControlsWrapper = DomHelper.create({tag: "div", classes: ["admin__table-controls"]});

            const ControlsBtnEdit = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__edit-item-btn"], text: "Edit"});
            ControlsBtnEdit.href = `table=${href.table}&action=edit&id=${item["id"]}`;
            ControlsBtnEdit.addEventListener("click", this.editItem.bind(this), {once: true});
            divControlsWrapper.append(ControlsBtnEdit);

            const ControlsBtnDelete = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__delete-item-btn"], text: "Delete"});
            ControlsBtnDelete.href = `table=${href.table}&action=delete&id=${item["id"]}`;
            ControlsBtnDelete.addEventListener("click", this.deleteItem.bind(this), {once: true});
            divControlsWrapper.append(ControlsBtnDelete);

            li.append(divControlsWrapper);
            ul.append(li);
        });
    }

    async showListOfTables(evt) {
        evt.preventDefault();
        const request = await Request.send(`${(DomHelper.hrefParse(evt.target.href)).fullQuery}`, {method: "GET"});

        try {
            this.listOfTablesWrapper.innerHTML = "";
            JSON.parse(request).forEach(item => {
                const li = DomHelper.create({tag: "li"});
                const link = DomHelper.create({tag: "a", classes: ["admin__btn"], text: `${item.TABLE_COMMENT}`});
                link.addEventListener("click", this.renderTable.bind(this));
                link.href = `table=${item.TABLE_NAME}`;
                li.append(link);
                this.listOfTablesWrapper.append(li);
            });
        } catch (e) {
            console.log("error with get all tablees request", e.message);
        }
    };


    showTablesBtnHandler() {
        this.shomListOfTablesBtn.addEventListener("click", this.showListOfTables.bind(this));
    }


}

