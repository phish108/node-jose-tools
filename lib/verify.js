const jose = require("node-jose");
const { loadFile, loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args,{boolean: ["b", "beautify"]});

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const rawPayload = await loadFile(args._.shift() || "--");

    if (rawPayload.split(".").length !== 3) {
        throw new Error("Token is not a compact JWS");
    }

    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const sub    = args.s || args.sub;

    const algorithms = [];
    const opts = {};

    if (args.alg) {
        let algs = args.alg;

        if (!Array.isArray(algs)) {
            algs = [algs];
        }

        for (let al of algs) {
            algorithms.push(al);
        }
    }

    if (args["noalg"]) {
        let algs = args["noalg"];

        if (!Array.isArray(algs)) {
            algs = [algs];
        }

        for (let al of algs) {
            algorithms.push("!" + al);
        }
    }

    if (algorithms.length) {
        opts.algorithms = algorithms;
    }

    const epoc = Math.floor(Date.now() / 1000);

    const keystore = await loadKeyStore(jwksFn);

    const token = await jose.JWS.createVerify(keystore, opts)
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

    process.stdout.write(JSON.stringify(payload, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), "utf8");
};
