"use strict";

export class Excel {
    constructor({appSelector, options}) {
        this.$app = document.querySelector(appSelector);
        this.components = options.components || [];
    }

    /*  1. Вызов создает элемент-контейнер для вставки в базовый контейнер метода render
        2. При создании эксземпляр класса Excel получает все компоненты, которые нужно вставить внутрь этого элемента-контейнера
        3. Этот массив из компонентов мы обходим в цикле, для каждого компонента создаем контейнер
        4. Этот контейнер получает класс компонента, это статика, экземпляр не нужен
        5. Создаем эземпляр, он нужен для вызова своего метода toHTML() для каждого компонента
        6. Вставялет внутрь элемента-контейнера то, что вернул вышеописанный метод.
        7. Добавляем на каждой итерации все компоненты внутрь элемента контейнера
    ================================
    */
    getRoot() {
        const $root = document.createElement("div");
        $root.classList.add("content");
        this.components.forEach(Component => {
            const $el = document.createElement("div");
            $el.classList.add(Component.elementClassName);
            const componentInstance = new Component($el);
            $el.innerHTML = componentInstance.toHTML();
            $root.append($el);
        });
        return $root;
    }

    render() {
        this.$app.append(this.getRoot());
    }
}
