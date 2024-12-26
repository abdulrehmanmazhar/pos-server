"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateBill = (cart) => {
    let total = 0;
    for (const item of cart) {
        total += item.qty * (item.product.price);
    }
    return total;
};
exports.default = calculateBill;
