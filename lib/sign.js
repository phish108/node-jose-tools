const jose = require("node-jose");
const { loadFile, loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, { boolean: ["N", "no-reference", "C", "compact", "F", "flat", "flattened", "G", "general", "json", "JSON", "b", "beautify", "E", "embedkey"]});

    const epoc = Math.floor(Date.now() / 1000);

    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const sub    = args.s || args.sub || iss;
    const talg   = args.l || args.alg;
    const kid    = args.k || args.kid;
    const exp    = args.x || args.exp;

    const fGeneral  = args.G || args.general || args.json || args.JSON;
    const fFlatened = args.F || args.flat || args.flattened;
    // flags
    const ref    = args.N || args["no-reference"] || false;

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const reference = args.E || args.embedkey ? "jwk" : !ref;
    const alg    = talg ? talg.toUpperCase() : "HS256";
    const typ    = "JWT";
    const format  = fFlatened ? "flattened" : fGeneral ? "general" : "compact";

    if ("HS256 HS384 HS512 RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512 none".split(" ").indexOf(alg) < 0) {
        throw new Error("invalid signing method");
    }

    const fields = { alg, typ }; // typ is a global constant

    let xheader = args.header;

    if (xheader) {
        if (!Array.isArray(xheader)) {
            xheader = [xheader];
        }
        for (let xh of xheader) {
            const xhd = xh.split("=");

            if (xhd.length === 2) {
                let val = xhd.pop();

                try {
                    val = JSON.parse(val);
                }
                catch (err) {
                    // noop
                }
                fields[xhd[0]] = val;
            }
        }
    }

    const rawPayload = args.p || args.payload || await loadFile(args._.shift() || "--");

    let key;

    if (jwksFn === "--")  {
        throw new Error("keystore cannot be loaded from stdin");
    }

    let jwks;
    const ksize = alg.split("S").pop();

    try {
        if (jwksFn) {
            jwks = await loadKeyStore(jwksFn);

            if (kid) {
                key = jwks.get(kid);
            }
            else {
                key = jwks.get();
            }
        }
    }
    catch (err) {
        if (!jwks) {
            jwks = jose.JWK.createKeyStore();
        }

        if (!(args.K || args.key) && alg.charAt(0) === "H") {

            key = await jwks.generate("oct", ksize);
            jwks.add(key);
        }
    }

    if (args.K || args.key) {
        key = await jose.JWK.asKey(args.K || args.key);
    }

    if (!key) {
        throw new Error("key not found " + kid);
    }

    if (alg.charAt(0) === "H" && ksize > key.length) {
        throw new Error(`key size ${key.length} is too small for the requested signature algorithm`);
    }

    let payload = {};

    if (rawPayload) {
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
    }

    Object.assign(payload, {
        iat: payload.iat || epoc,
    });

    if (iss) {
        payload.iss = iss;
    }
    if (aud) {
        payload.aud = aud;
    }
    if (sub) {
        payload.sub = sub;
    }

    if (!payload.exp && exp > 0) {
        payload.exp = epoc + exp;
    }

    const data = await jose.JWS.createSign({ fields, format }, {key, reference})
        .update(JSON.stringify(payload))
        .final();

    process.stdout.write(format === "compact" ? `${data}\n` : JSON.stringify(data, null, beautyJSON), "utf8");
};
