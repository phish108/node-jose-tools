const { JWE } = require("node-jose");
const {loadFile, loadKeyStore} = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args);

    const jwksFn = args.j || args.jwks;
    // const aud    = args.a || args.aud;
    // const iss    = args.i || args.iss;

    const jwks = await loadKeyStore(jwksFn, false);

    if (!jwks) {
        throw new Error("no keystore");
    }

    const token = await loadFile(args._.length ? args._.shift() : "--");

    if (!token.split(".").length === 5 ) {
        throw new Error("no JWE found");
    }
    // console.log(token);

    const jwe = await JWE.createDecrypt(jwks).decrypt(token);

    // console.log(jwe);
    // console.log(jwe.payload.length);
    // console.log(jwe.payload.toString("utf8"));
    // console.log(jwe.plaintext.toString("utf8"));

    process.stdout.write(jwe.payload.toString(), "UTF8");
};
