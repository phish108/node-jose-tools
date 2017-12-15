const { JWK } = require("node-jose");

const { loadFile } = require("./helper/readfile");

async function loadKeyStore(file) {
    const data = await loadFile(file);

    return JWK.asKeyStore(data);
}


module.exports = async function (args) {
    const fn  = args.shift();
    const kid = args.shift();

    const ks = await loadKeyStore(fn);

    const key = await ks.get({kid: kid});

    if (!key) {
        throw new Error("key not found");
    }

    process.stdout.write(JSON.stringify(key.toJSON(true)), "utf8");
};
