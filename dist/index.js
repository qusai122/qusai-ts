"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getData, getHTML } = require("../utils/filesystem");
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    const data = getData("../data/users.json");
    const formattedUsersList = data.map((user) => {
        return `<li>${user.id} ${user.first_name} ${user.last_name} </li>`;
    }).join("");
    const html = getHTML("../static/html/page.html").replace('{{userList}}', formattedUsersList);
    res.send(html);
});
app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
