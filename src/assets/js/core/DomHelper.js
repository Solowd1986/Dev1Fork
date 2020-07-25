"use strict";

export class DomHelper {
    static create(tagName, classList = []) {
        const $el = document.createElement(tagName);
        $el.classList.add(...classList);
        return $el;
    }
    /*  Данный метод подвешивает событие на нужный элемент. Поскольку тут мы работаем с методами, this хочется сохранить,
        но и событие оставить. Для этого callback оборачивается в стрелочную функцию, она получает на вход событие evt и
        передает его в callback. У нас это методы компонентов, типа onClick и так далее. Также, передаваемый сюда метод нужно
        закрпить через bind, так как при вызове даже со стрелочнйо функцией, this будет DomHelper, а не нужный компонент.
        Так что в DomListener нудно закрепить метод за его контекстом, там это происходит в контексте каждого
        компонента, вызванного методом класса-родителя DomListener
    ================================
    */
    static on(elem, eventType, callback) {
        elem.addEventListener(eventType, callback);
    }

    static off(elem, eventType, callback) {
        elem.removeEventListener(eventType, callback);
    }
    static capitalaize(listener) {
        if (typeof listener !== 'string') {
            return '';
        }
        return `on${listener.charAt(0).toUpperCase() + listener.slice(1).toLowerCase()}`;
    }
}


