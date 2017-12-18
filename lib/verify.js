const jose = require("node-jose");
const { loadFile, loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args);
    const rawPayload = await loadFile(args._.shift() || "--");

    if (rawPayload.split(".").length !== 3) {
        throw new Error("Token is not a compact JWS");
    }

    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const sub    = args.s || args.sub;

    const epoc = Math.floor(Date.now() / 1000);

    const keystore = await loadKeyStore(jwksFn);

    const token = await jose.JWS.createVerify(keystore)
        .verify(rawPayload);

    const payload = JSON.parse(token.payload.toString());

    if (payload.iat > epoc) {
        throw new Error("token is too early");
    }

    if (payload.exp && payload.exp < epoc) {
        throw new Error("token is too old");
    }

    if (payload.aud !== aud) {
        throw new Error("token addresses the wrong audience");
    }

    if (payload.iss && payload.iss !== iss) {
        throw new Error("token is from the wrong issuer");
    }

    if (sub && payload.sub && payload.sub !== sub) {
        throw new Error("token is about the wrong subject");
    }

    if (!sub && payload.sub && payload.sub !== iss) {
        throw new Error("token is not about the issuer");
    }

    process.stdout.write(JSON.stringify(payload), "utf8");
};
