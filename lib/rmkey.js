const { loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    const fn  = args.shift();
    const kid = args.shift();

    const ks = await loadKeyStore(fn);

    const key = await ks.get({kid: kid});

    if (!key) {
        throw new Error("key not found");
    }

    ks.remove(key);
    const json = await ks.toJSON(true);

    process.stdout.write(JSON.stringify(json), "utf8");
};
