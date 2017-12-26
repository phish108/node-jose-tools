const { loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args);

    const fn  = args.j || args.jwks || args.keystore || args._[0] || "--";
    const ks = await loadKeyStore(fn);

    const keys = await ks.all();

    const kids = keys.map(k => k.kid);

    process.stdout.write(kids.join("\n"), "utf8");
};
