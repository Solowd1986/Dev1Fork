"use strict";

export class DomListener {
    constructor(rootElement) {
        if (!rootElement) {
            throw new Error("No root provided");
        }
        this.$rootElement = rootElement;
    }
}
