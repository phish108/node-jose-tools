const { JWE } = require("node-jose");
const {loadFile, loadKeyStore} = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args);

    const jwksFn = args.j || args.jwks;
    // const aud    = args.a || args.aud;
    // const iss    = args.i || args.iss;

    const jwks = await loadKeyStore(jwksFn, false);

    if (!jwks) {
        throw new Error("no keyring");
    }

    const token = await loadFile(args._.length ? args._.shift() : "--");

    if (!token.split(".").length === 5 ) {
        throw new Error("no JWE found");
    }

    const jwe = await JWE.createDecrypt(jwks).decrypt(token);

    // console.log(jwe);
    process.stdout.write(jwe.payload.toString(), "UTF8");
};
