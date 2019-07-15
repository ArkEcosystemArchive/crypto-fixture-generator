const { Managers } = require("@arkecosystem/crypto");

module.exports = network => Managers.configManager.setFromPreset(network);
