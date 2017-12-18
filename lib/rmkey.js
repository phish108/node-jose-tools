const { loadKeyStore, readStdin } = require("./helper/readfile");

async function removeKey(kid, keystore) {
    const key = await keystore.get({kid: kid});

    if (key) {
        await keystore.remove(key);
    }
}

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["U", "update", "q", "quiet"]});
    const fn  = args.j || args.jwks || args.keystore;

    const stdinKids = await readStdin();
    const kids = args._.length ? args._ : stdinKids.split("\n\r");

    const ks = await loadKeyStore(fn);

    await Promise.all(kids.map((k) => removeKey(k, ks)));

    const json = await ks.toJSON(true);

    if (args.U || args.update) {
        await new Promise((resolve, reject) => require("fs").writeFile(fn, JSON.stringify(json), (err) => err ? reject(err) : resolve()));
    }

    if (args.q || args.quiet) {
        process.stdout.write(JSON.stringify(json), "utf8");
    }
};
