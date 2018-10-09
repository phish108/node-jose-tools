const { loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args,{boolean: ["b", "beauty"]});

    const fn  = args.j || args.jwks || args.keystore || args._[0] || "--";

    const beautyJSON = args.b || args.beauty ? 4 : 0;

    const ks = await loadKeyStore(fn);

    const keys = await ks.all();

    const kids = keys.map(k => k.kid);

    process.stdout.write(JSON.stringify(kids, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), "utf8");
};
