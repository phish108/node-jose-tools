import jose from "node-jose";
import { loadFile, loadKeyStore } from "./helper/readfile.js";

const algKeys = {
    H: "oct",
    R: "RSA",
    E: "EC",
    P: "OKP",
    n: "none"
};

export const requireArgs = true;

export const options = { boolean: [
    "N", "no-reference",
    "C", "compact", // this is default and therefore not needed
    "F", "flat", "flattened",
    "G", "general", "json", "JSON",
    "b", "beautify",
    "E", "embedkey",
    "h", "help"
]};

export default async function sign(args) {
    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const sub    = args.s || args.sub || iss;
    const talg   = args.l || args.alg;
    const kid    = args.k || args.kid;
    const exp    = args.x || args.exp;

    const fGeneral  = args.G || args.general || args.json || args.JSON;
    const fFlatened = args.F || args.flat || args.flattened;

    // option defaults
    const ref    = args.N || args["no-reference"] || false;

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const reference = args.E || args.embedkey ? "jwk" : !ref;
    const alg    = talg ? talg.toUpperCase() : "HS256";
    const typ    = "JWT";
    const format  = fFlatened ? "flattened" : fGeneral ? "general" : "compact";


    if (alg === "NONE") {
        throw new Error("unsecured JWS are not supported by node-jose");
    }

    if ("HS256 HS384 HS512 RS256 RS384 RS512 ES256 ES384 ES512 PS256 PS384 PS512".split(" ").indexOf(alg) < 0) {
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

    const rawPayload = args.p || args.payload || await loadFile(args._.shift());

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
        throw new Error("key not found for " + kid);
    }

    // verify that the key matches the algorithm
    if (algKeys[alg.charAt(0)] !== key.kty) {
        throw new Error("invalid key type for algorithm");
    }

    if (alg.charAt(0) === "H" && ksize > key.length) {
        throw new Error(`key size ${key.length} is too short for the requested signature algorithm ${alg}`);
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

    const epoc = Math.floor(Date.now() / 1000);

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

    const data = await jose.JWS.createSign({ fields, format }, { key, reference })
        .update(JSON.stringify(payload))
        .final();

    return format === "compact" ? `${data}\n` : JSON.stringify(data, null, beautyJSON);
}
