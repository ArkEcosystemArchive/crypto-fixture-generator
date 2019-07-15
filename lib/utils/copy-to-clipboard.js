const clipboardy = require("clipboardy");
const toJson = require("./to-json");

module.exports = data => clipboardy.writeSync(toJson(data));
