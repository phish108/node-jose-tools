const { loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    const fn  = args.shift() || "--";
    const ks = await loadKeyStore(fn);

    const keys = await ks.all();

    const kids = keys.map(k => k.kid);

    process.stdout.write(kids.join("\n"), "utf8");
};
