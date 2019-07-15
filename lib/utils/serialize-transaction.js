const { Transactions } = require("@arkecosystem/crypto");

module.exports = data => ({
    data,
    serialized: Transactions.Serializer.serialize(data).toString("hex"),
});
