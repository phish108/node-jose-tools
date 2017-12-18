const { JWE } = require("node-jose");
const { randomBytes } = require("crypto");

const {loadFile, loadKeyStore} = require("./helper/readfile");
const base64 = require("base64url");

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
    console.log(jwe.payload.toString());
};
