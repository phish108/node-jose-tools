import * as fs from "node:fs/promises";
import jose from "node-jose";
import { loadFile, loadKeyStore } from "./helper/readfile.js";

export const requireArgs = true;

export const options = {boolean: [
    "b", "beautify",
    "h", "help"
]};

async function checkJws(jws) {
    if (!jws) {
        return undefined;
    }

    if (jws === "--") {
        return jws;
    }

    let result;

    try {
        const fileinfo = await fs.stat(jws);

        if (fileinfo.isFile()) {
            result = jws;
        }
    }
    catch(err) {
        // ignore the error
    }

    return result;
}

export default async function verify(args) {
    const beautyJSON = args.b || args.beautify ? 4 : 0;
    const jws =  args._.shift();

    const jwsFn = await checkJws(jws);

    const rawPayload = await loadFile(jwsFn) || jws;

    if (rawPayload.split(".").length !== 3) {
        throw new Error("Token is not a compact JWS");
    }

    const jwksFn = args.j || args.jwks;
    const aud    = args.a || args.aud;
    const iss    = args.i || args.iss;
    const sub    = args.s || args.sub;

    const algorithms = [];
    const handlers = checkCritMembers(args);

    const opts = {
        handlers
    };

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
    const keyInput = args.K || args.key;

    let keyOrStore;

    if (keyInput) {
        keyOrStore = await jose.JWK.asKey(keyInput);
    }

    if (!keyOrStore && jwksFn) {
        keyOrStore = await loadKeyStore(jwksFn);
    }

    if (!keyOrStore) {
        // verify that there is an empty keystore
        // allowing verification of embedded keys
        keyOrStore = jose.JWK.createKeyStore();
    }

    // THE JWS VALIDATION HAPPENS HERE
    const token = await jose.JWS.createVerify(keyOrStore, opts)
        .verify(rawPayload);

    const payload = JSON.parse(token.payload.toString());

    // some JWT validation
    if (payload.iat > epoc) {
        throw new Error("token is too early");
    }

    if (payload.exp && payload.exp < epoc) {
        throw new Error("token is too old");
    }

    if (aud && payload.aud !== aud) {
        throw new Error("token addresses the wrong audience");
    }

    if (iss && payload.iss && payload.iss !== iss) {
        throw new Error("token is from the wrong issuer");
    }

    if (sub && payload.sub && payload.sub !== sub) {
        throw new Error("token is about the wrong subject");
    }

    return JSON.stringify(payload, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
}

export function checkCritMembers(args) {
    const handlers = {};
    const cAl = {};
    const xAl = {};

    // crit and xcrit handling is complicated because users
    // may define more than one rule for the same crit member
    // The crit option overrides the xcrit option
    if (args.crit) {
        let crit = args["crit"];

        if (!Array.isArray(crit)) {
            crit = [crit];
        }

        for (let al of crit) {
            al = al.split("=");

            if (al.length === 2) {
                if (!(al[0] in cAl)) {
                    cAl[al[0]] = [al[1]];
                }
                else if (typeof cAl[al[0]] !== "boolean") {
                    cAl[al[0]].push(al[1]);
                }
            }
            else if (al.length === 1) {
                cAl[al[0]] = false;
                handlers[al[0]] = true;
            }
        }
    }
    if (args.xcrit) {
        let nocrit = args["xcrit"];

        if (!Array.isArray(nocrit)) {
            nocrit = [nocrit];
        }

        for (let al of nocrit) {
            al = al.split("=");
            if (al.length === 2) {
                if (!(al[0] in xAl)) {
                    xAl[al[0]] = [al[1]];
                }
                else if (typeof xAl[al[0]] !== "boolean") {
                    xAl[al[0]].push(al[1]);
                }
            }
            else if (al.length === 1) {
                xAl[al[0]] = false;
                if (!(al[0] in handlers)) {
                    handlers[al[0]] = false;
                }
            }
        }
    }

    for (let al in cAl) {
        if (!(cAl[al] in handlers) && cAl[al]) {
            handlers[al] = (sig) => {
                if (cAl[al].indexOf(sig.header[al]) < 0) {
                    return "bad crit member";
                }
            };
        }
    }

    for (let xl in xAl) {
        if (!(xl in handlers) && xAl[xl]) {
            handlers[xl] = (sig) => {
                if (xAl[xl].indexOf(sig.header[xl]) >= 0) {
                    return "bad crit member";
                }
            };
        }
    }

    return handlers;
}
