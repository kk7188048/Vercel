"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generate1;
const shortid_1 = __importDefault(require("shortid"));
function generate1() {
    const generateUniqueId = shortid_1.default.generate();
    console.log(generateUniqueId);
    return generateUniqueId;
}
