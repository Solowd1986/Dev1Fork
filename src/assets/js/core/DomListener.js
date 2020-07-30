"use strict";


/*  Это исходный класс подвешивания событий, иерархия: DomListener -> ExcelComponents -> Все отдельные компоненты для Excel
    На вход получем элемент-контейнер для каждого компонента, и массив слушателей для этого компонента.
    Этот же конструктор унаследует ExcelComponents, но будет дополнен своим, специфическим функционалом, а DomListener сейчас
    вполне универсален.
    1. $rootElement - наследуемый элемент, содержит в себе свой корневой элемент для каждого компонента
    2. listeners - наследуемый массив, для каждого компонента содержит свой набор слушателей
================================
*/


import {DomHelper} from "./DomHelper";

export class DomListener {
    constructor(rootElement, elemListeners = []) {
        if (!rootElement) {
            throw new Error("No root provided");
        }
        this.$rootElement = rootElement;
        this.listeners = elemListeners;
    }

    /*  Подвешивание событий, вызывается для каждого компонента, перебирается его массив слушателей и подвешивается на
        корневой элемент этого компонента, который есть у каждого компонента в свойстве. Так мы сразу используем делегирвоание
        событий для перехвата их в одной общей точке.
    ================================
    */
    initDomListeners() {
        if (this.listeners.length !== 0) {
            this.listeners.forEach(listener => {
                if (!this[DomHelper.capitalaize(listener)]) {
                    throw Error(`Method ${DomHelper.capitalaize(listener)} don't exist in class ${this.constructor.name}`);
                }
                const method = DomHelper.capitalaize(listener);
                this[method] = this[method].bind(this);
                DomHelper.on(this.$rootElement, listener, this[method]);
            });
        }
    }

    removeDomListeners() {
        if (this.listeners.length !== 0) {
            console.log("start remove listeners");
            this.listeners.forEach(listener => {
                const method = DomHelper.capitalaize(listener);
                DomHelper.off(this.$rootElement, listener, this[method]);
            });
            console.log("done removing");
        }
    }
}


class User {
    constructor() {
        this.listeners = [];
    }
    initDomListeners(elem, method, listener) {
        this.listeners[listener] = this[method].bind(this);
        elem.addEventListener(listener, this.listeners[listener]);
    }
    removeDomListeners(elem, listener) {
        elem.addEventListener(listener, this.listeners[listener]);
    }
}
