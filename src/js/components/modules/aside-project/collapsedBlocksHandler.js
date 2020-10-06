"use strict";


/*  Передаем на вход функции деструктурируемый обьект, содержащий селекторы кнопок, селекторы контентных блоков, класс
    отвечающий за демонстрацию активности/неактивности и класс, отвечающий за анимации. При клике на каждую кнопку удаляются
    все классы активности и нилайновая высота, причем класс активности удаляется для всех кнопок, кроме той, на которую
    кликнули. Это нужно для того, чтобы взаимодействие всегда шло лишь с одним элементом, прочие элементы кроме текущего
    теряют класс активности и высоту при клике на элементы управления.

    Код привязан к верстке и опирается на то, что каждый заголовок предваряет свой контентый блок.
    .collapsed-block {height: 0;overflow: hidden;} - класс скрытых контентных блоков

    1. triggerSelector - кнопки демонстрации контентных блоков
    2. collapsedItemsSelector - селекторы самих контентных блоков
    3. activeClass - класс активности, на его основе решается, показывать контентый блок или нет
    4. animatedClassCollection - массив из классов для пользовательских анимаций контентных блоков

================================
*/
const collapsedBlocksHandler = ({triggerSelector, collapsedItemsSelector, activeClass, animatedClassCollection = []}) => {

    const trigger = document.querySelectorAll(triggerSelector);
    const collapsedElements = document.querySelectorAll(collapsedItemsSelector);

    if (trigger.length !== 0 && collapsedElements.length !== 0) {
        trigger.forEach(item => item.nextElementSibling.classList.add(...animatedClassCollection));
        trigger.forEach(item => {
            item.addEventListener("click", function (evt) {

                trigger.forEach(item => {
                    if (item !== this) {
                        item.classList.remove(activeClass);
                    }
                    item.nextElementSibling.style.removeProperty("height");
                });

                this.classList.toggle(activeClass);

                if (this.classList.contains(activeClass)) {
                    this.nextElementSibling.style.height = `${this.nextElementSibling.scrollHeight}px`;
                } else {
                    this.nextElementSibling.style.removeProperty("height");
                }
            });
        });
    }
};

export default collapsedBlocksHandler;
