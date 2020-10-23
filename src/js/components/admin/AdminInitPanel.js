
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
 *
 * Стили:
 * admin.scss
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

    /**
     * Это инициализация, проверяем все ли селекторы можно забрать, если все ок - получаем элементы.
     * Потом первый шаг - привязываем к кнопке вызов метода показа списка таблиц БД.
     */
    init() {
        if (DomHelper.checkSelectors(this.selectors)) {
            this.shomListOfTablesBtn = document.querySelector(this.selectors.shomListOfTablesBtn);
            this.listOfTablesWrapper = document.querySelector(this.selectors.listOfTablesWrapper);
            this.listOfRecordsWrapper = document.querySelector(this.selectors.listOfRecordsWrapper);
            this.showTablesBtnHandler();
        }
    }


    /**
     *   На этом этапе сразу фиксируем контекст одним из способов, тут я выбрал bind, суть в том, что именно отсюда
     *   начинаются проблемы с потерями this у методов, так что фиксируй контекст.
     */
    showTablesBtnHandler() {
        this.shomListOfTablesBtn.addEventListener("click", this.showListOfTables.bind(this));
    }

    /**
     *  Данный метод получает на вход событие клика по кнопке показа таблиц, контекст сохранили, все нормально.
     *  Выполняется запрос на сервер, забираем список таблиц, hrefParse помогает забрать именно tables из запроса,
     *  без хоста и прочего, так как в самом методе Request.send мы уже все это прописали, для универсальности, чтоб
     *  не удлинять url запроса.
     *  Далее, при каждом клике очищаем содержимое блока вывода списка таблиц и выводим их в цикле, создавая элементы на лету.
     *  item.TABLE_COMMENT - там название таблицы нормальное, item.TABLE_NAME - там для базы, ну типа authors/Авторы
     *
     *  Каждая таблица в выводимом списке это ссылка, она в свою очередь тоже получаем callback, и нам опять нужно
     *  сохранить контекст передаваемого метода, опять же - используем bind.
     */

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

    /**
     *  Данный метод - посредник, он обрабатывает событие клика, получает данные из href ссылки и вызывает метод отрисовки
     *  списка элементов выбранной таблицы БД. По сути, его вроде как можно убрать и передавать данные сразу в
     *  renderTableRecords, но тогда нужно в самом renderTableRecords описывать логику обработки полученных данных,
     *  так как может поступить как evt от ссылки, с href или evt от кнопки submit (от операций вставки или удаления).
     *  Там данные уже в dataset.href, причем в JSON.stringify формате. Там же его приводят к удобному обьекту href,
     *  но мы то вроде как собирались получать на вход evt элемента. Короче, проще сохранить renderTableRecords
     *  универсальным, получающим на вход одно и то же.
     */
    async renderTable(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);
        this.renderTableRecords(href).then();
    }


    /**
     * Как было сказано, это универсальный метод, он генерирует разметку всех элементов выбранной таблицы БД.
     * По сути, ему можно просто передавать название таблицы, а не обьект с еще и другими данными, но для удобства
     * пусть будет, вдруг данные понадобятся.
     *
     * Также в данном методе подвешиваются обработчики на три действия: добавить запись в таблицу, редактировать, удалить.
     * Каждый метод тут опять же передается как callback, с использованием bind. То есть мы как бы пробрасываем this
     * постоянно, каждый addEventListener + callback - значит используем bind, и this всегда правильный.
     */
    async renderTableRecords(href) {
        const request = await Request.send(`table=${href.table}`, {method: "GET"});
        const parsedRequest = JSON.parse(request);

        // Всегда обнуляем содержимое блока записей таблицы БД перед новой отрисовкой
        this.listOfRecordsWrapper.innerHTML = "";

        // Кнопка добавления новой записи в таблицу
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

            // Кнопка редактирования записи в таблице
            const ControlsBtnEdit = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__edit-item-btn"], text: "Edit"});
            ControlsBtnEdit.href = `table=${href.table}&action=edit&id=${item["id"]}`;
            ControlsBtnEdit.addEventListener("click", this.editItem.bind(this), {once: true});
            divControlsWrapper.append(ControlsBtnEdit);

            // Кнопка удаления записи из таблицы
            const ControlsBtnDelete = DomHelper.create({tag: "a", classes: ["admin__btn", "admin__delete-item-btn"], text: "Delete"});
            ControlsBtnDelete.href = `table=${href.table}&action=delete&id=${item["id"]}`;
            ControlsBtnDelete.addEventListener("click", this.submitDeleteRecord.bind(this), {once: true});
            divControlsWrapper.append(ControlsBtnDelete);

            li.append(divControlsWrapper);
            ul.append(li);
        });
    }


    /**
     * Удаление элемента, отправляем данные на сервер, там они удаляются, потом вызываем метод отрисовки
     * таблицы еще раз, теперь уже с новым списокм элементов. renderTableRecords вызывается с then так как это
     * async метод, и его промис нужно перехватить, но по сути это нужно, чтобы там await работал, и then от
     * данного метода не нужен, но иначе выдается предупреждение, так что вот.
     */
    async submitDeleteRecord(evt) {
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


    /**
     * Добавить новую запись, на месте списка таблиц отрисовывается форма добавления новой записи.
     * Кстати, listOfRecordsWrapper - это как бы общее пространство, кажыдй вывод перезаписывает содержимое этой
     * обертки, будь там список элементов таблицы БД, append формы ввода или редактирования. Эта обертка отделена от
     * той, где выводится список таблиц БД, так как они всегда должны быть видны и доступны.
     *
     * Также выполняется следующее пробрасывание this - как callback подвешивается метод подтверждения вставки,
     * при клике на кнопку Send в выводимой ниже разметке.
     *
     * Кстати, до отрисовки формы ввода данных нового элемента таблицы мы выолняем запрос БД, чтобы получить список
     * имен столбцов для этой таблицы, типа там name, login и прочее.
     */
    async addRecord(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);
        const request = await Request.send(`table=${href.table}`, {
            method: "GET",
            headers: {
                "Request-Type" : "Record-Add-Get-Fields"
            }
        });
        const parsedResponce = JSON.parse(request);
        this.listOfRecordsWrapper.innerHTML = "";
        const divWrapper = DomHelper.create({tag: "div", classes: ["admin__form-wrapper"]});

        const form = DomHelper.create({tag: "form", classes: ["admin__new-elem-form"]});
        form.addEventListener("submit", (evt) => evt.preventDefault());
        form.name = "admin__elem-form";

        // Тут мы задаем проверочный массив, и если в него не входит имя поля - выводим его.
        // Это чтобы id не выводить и даты, это все же элемент на вставку, все это в базе сгенерируется.
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

    /**
     * Собираем данные из формы вставки нового элемента и отправляем на сервер. Потом перерисовываем таблицу.
     */
    async submitAddRecord(evt) {
        const href = JSON.parse(evt.target.dataset.href);
        const formData = new FormData(evt.target.form);
        formData.append("table", href.table);

        const request = await Request.send(`table=${href.table}`, {
            method: "POST",
            body: formData,
            headers: {
                "Request-Type" : "Record-Add"
            }
        });
        this.renderTableRecords(href).then();
    }


    /**
     * Блок редактирования записей. Он выполняет запрос базе, получает редактируемую запись и отдает ее
     * в переменной parsedRequest. А в href содержится имя таблицы, действие - edit и id записи. Все это
     * формиуется на этапе отрисовки кнопок для каждой записи таблицы, в методе renderTableRecords
     */
    async editItem(evt) {
        evt.preventDefault();
        const href = DomHelper.hrefParse(evt.target.href);
        const request = await Request.send(`table=${href.table}&id=${href.id}`, {
            method: "GET",
            headers: {
                "Request-Type" : "Record-Edit-Get-Item"
            }
        });

        const parsedRequest = JSON.parse(request);
        // Очищаем блок вывода данных, там теперь будет форма для редактирования выбранной записис
        this.listOfRecordsWrapper.innerHTML = "";
        // Вызываем метод рендеринга формы редактирования записи
        this.listOfRecordsWrapper.append(this.renderItemEdit(parsedRequest, href));
    }


    /**
     * Вывод формы редактирования записей из БД. Так как кнопка submit это не ссылка, то данные для подвешенного на
     * нее метода submitEditRecord мы передаем в блоке data-href, просто приводим его к строке через JSON.stringify.
     * Эти данные (имя таблицы и id записи) нужны, чтобы отправить данные на вставку при клике на кнопку submit.
     *
     */
    renderItemEdit(parsedRequest, href)  {
        const divWrapper = DomHelper.create({tag: "div", classes: ["admin__form-wrapper"]});

        const form = DomHelper.create({tag: "form", classes: ["admin__new-elem-form"]});
        form.addEventListener("submit", (evt) => evt.preventDefault());
        form.name = "admin__elem-form";

        for (const item in parsedRequest) {
            const div = DomHelper.create({tag: "div"});
            const label = DomHelper.create({tag: "label", text: item});
            div.append(label);

            const input = DomHelper.create({tag: "input", classes: ["admin__form-input"]});
            input.type = "text";
            input.name = `${item}`;
            input.value = `${parsedRequest[item]}`;
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


    /**
     * Данный метод вызыается при клике на кнопку submit в форме редактирования элемента из списка таблицы БД.
     * Вся нужная информация берется из блока data-href, потом таблица перерисовывается.
     *
     */
    async submitEditRecord(evt) {
        const href = JSON.parse(evt.target.dataset.href);

        const formData = new FormData(evt.target.form);
        formData.append("table", href.table);
        formData.append("id", href.id);

        const request = await Request.send(`table=${href.table}&id=${href.id}`, {
            method: "POST",
            body: formData,
            headers: {
                "Request-Type" : "Record-Edit"
            }
        });
        this.renderTableRecords(href).then();
    }
}

