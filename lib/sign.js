const jose = require("node-jose");
const { loadFile } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, { boolean: ["N", "no-reference"]});

    const epoc = Math.floor(Date.now() / 1000);

    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const talg   = args.l || args.alg;
    const kid    = args.k || args.kid;
    const exp    = args.e || args.exp;

    // flags
    const ref    = args.N || args["no-reference"];

    const reference = !ref;
    const alg    = talg ? talg.toUpperCase() : "HS256";
    const typ    = "JWT";
    const format  = "compact";

    if ("HS256 HS384 HS512 RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512 none".split(" ").indexOf(alg) < 0) {
        throw new Error("invalid signing method");
    }

    const fields = { alg, typ }; // typ is a global constant

    const rawPayload = await loadFile(args._.shift() || "--");

    let key;

    if (jwksFn === "--")  {
        throw new Error("keystore cannot be loaded from stdin");
    }

    let jwks;
    const ksize = alg.split("S").pop();

    try {
        const data = await loadFile(jwksFn);

        jwks = await jose.JWK.asKeyStore(data);

        if (kid) {
            key = jwks.get(kid);
        }
        else {
            key = jwks.get();
        }
    }
    catch (err) {
        if (!jwks) {
            jwks = jose.JWK.createKeyStore();
        }

        if (alg.charAt(0) === "H") {

            key = await jwks.generate("oct", ksize);
            jwks.add(key);
        }
    }

    if (!key) {
        throw new Error("key not found " + kid);
    }

    if (alg.charAt(0) === "H" && ksize > key.length) {
        throw new Error(`key size ${key.length} is too small for the requested signature strength`);
    }

    let payload = {};

    try {
        payload = JSON.parse(rawPayload);
    }
    catch(err) {
        // console.log(err.message);
        payload = {};
        if (rawPayload) {
            payload.extra = rawPayload;
        }
    }

    Object.assign(payload, {
        iss,
        aud,
        sub: iss,
        iat: payload.iat || epoc,
    });

    if (!payload.exp && exp > 0) {
        payload.exp = epoc + exp;
    }

    // singing could be done
    return jose.JWS.createSign({ fields, format }, {key, reference})
        .update(JSON.stringify(payload))
        .final()
        .then((data) => process.stdout.write(data, "utf8"))
        .catch((err) => process.stderr.write(err)) ;
};
