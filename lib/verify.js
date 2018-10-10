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
                if (!cAl.hasOwnProperty(al[0])) {
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
                if (!xAl.hasOwnProperty(al[0])) {
                    xAl[al[0]] = [al[1]];
                }
                else if (typeof xAl[al[0]] !== "boolean") {
                    xAl[al[0]].push(al[1]);
                }
            }
            else if (al.length === 1) {
                xAl[al[0]] = false;
                if (!handlers.hasOwnProperty(al[0])) {
                    handlers[al[0]] = false;
                }
            }
        }
    }

    for (let al in cAl) {
        if (!handlers.hasOwnProperty(al) && cAl[al]) {
            handlers[al] = (sig) => {
                if (cAl[al].indexOf(sig.header[al]) < 0) {
                    return Promise.reject("bad crit member");
                }
            };
        }
    }
    for (let xl in xAl) {
        if (!handlers.hasOwnProperty(xl) && xAl[xl]) {
            handlers[xl] = (sig) => {
                if (xAl[xl].indexOf(sig.header[xl]) >= 0) {
                    return Promise.reject("bad crit member");
                }
            };
        }
    }

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
