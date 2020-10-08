
export default class AdminInitPanel {
    constructor(selectors) {
        this.selectors = selectors;
    }

    static HrefProcessing (href) {
        return href.slice(href.lastIndexOf("/") + 1);
    }

    render() {

    }


}

