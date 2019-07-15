const fs = require("fs");
const toJson = require("./to-json");

module.exports = (data, file) => {
    fs.writeFile(file, toJson(data), err => {
        if (err) {
            console.error(err);
        }
    });
};
