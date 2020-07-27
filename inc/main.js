"use strict";

console.log(12);

async function f1() {
    await Promise.resolve();
}

f1().then(() => console.log(5451));