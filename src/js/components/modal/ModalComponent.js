import {DomHelper} from "../helpers/DomHelper";


export class ModalComponent {
    constructor(options) {
        this.options = options;
    }


    static createOverlay(childElem, classList = []) {
        const overlay = DomHelper.create({tag: "div"});
        if (classList.length) {
            overlay.classList.add(...classList);
        } else {
            overlay.style.cssText = `display: none;
                                     position: fixed;
                                     width: 100%;
                                     height: 100%;
                                     top: 0;
                                     left: 0;
                                     z-index: 100; 
                                     background-color: rgba(0,0,0, .5);`;
        }

        childElem.addEventListener("click", (evt) => evt.stopPropagation());
        overlay.addEventListener("click", function (evt) {
            this.innerHTML = "";
            this.remove();
        });
        overlay.append(childElem);
        document.body.append(overlay);
    }

    static bodyFixed(classList = []) {
        classList.length ? document.body.classList.add(...classList) : document.body.style.cssText = "overflow: hidden;";
    }

    static  scrollBarFixed() {

    }


    initInnerModalHandlers(elem, handlers = []) {

    }

    initModalBtn(btn) {
        btn.addEventListener("click", this.initInnerModalHandlers.bind(this));
    }



}


