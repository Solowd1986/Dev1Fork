"use strict";

import {DomHelper} from "../../core/DomHelper";

export class Excel {
    constructor({appSelector, options}) {
        this.$app = document.querySelector(appSelector);
        this.components = options.components || [];
    }

    /*  1. Создаем div, в который уйдут все созданные компоненты.
        2. Перезаписываем массив компонентов через метод map, это нужно для того,
           чтобы потом, когда элементы уже созданы и вставлены в DOM, ниже, в методе render, можно было подвесить события
           на все элементы, ведь пока компоненты не в DOM, события на них не подвесить.
        3. В самом цикле map мы просто создаем элемент с нужным именем класса, полученным от компонента на текущей итерации,
           потом создаем экзепляр самого компонента, забираем результат его метода-шиблонизатора toHTML прямо в этот созданный
           элемент и присоединяем этот элемент к общий div, содержащий все выбранные компоненты. И возвращаем элемент, чтобы
           пересобрать массив map, для последующего перебора и подвешивания событий. Напомню, для этого элементы уже
           должны быть в верстке.
    ================================
    */
    getRoot() {
        const $root = DomHelper.create("div", ["content"]);
        this.components = this.components.map(Component => {
            const $el = DomHelper.create("div", [Component.elementClassName]);
            const componentInstance = new Component($el);
            $el.innerHTML = componentInstance.toHTML();
            $root.append($el);
            return componentInstance;
        });
        return $root;
    }

    render() {
        this.$app.append(this.getRoot());
        this.components.forEach(Component => Component.init());

        // setTimeout(() => {
        //     this.components.forEach(Component => Component.destroy());
        // }, 2000)

    }




}
