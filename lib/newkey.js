const { JWK } = require("node-jose");

module.exports = async function (args) {
    const keystore = await JWK.createKeyStore();

    const type = args.shift();
    const size = args.shift();

    const key = await keystore.generate(type === "rsa" ? type.toUpperCase() : type, size);

    process.stdout.write(JSON.stringify(key.toJSON(true)), "utf8");
};
