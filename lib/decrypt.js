const { JWE } = require("node-jose");
const {loadFile, loadKeyStore} = require("./helper/readfile");

module.exports = async function (args) {
    if (!args.length) {
        throw new Error("no options provided");
    }

    args = require("minimist")(args, {boolean: [
        "h", "help"
    ]});

    const jwksFn = args.j || args.jwks;
    // const aud    = args.a || args.aud;
    // const iss    = args.i || args.iss;

    const jwks = await loadKeyStore(jwksFn, false);

    if (args.h || args.help) {
        return require("./helper/loaddoc.js")("decrypt");
    }

    if (!jwks) {
        throw new Error("no keystore");
    }

    const tokenArg = args._.shift();

    let tokenString;

    if (tokenArg && tokenArg.startsWith("eyJ")) {
        tokenString = tokenArg;
    }

    const token = tokenString ? tokenString : await loadFile(args._.length ? args._.shift() : "--");

    if (!token.split(".").length === 5 ) {
        throw new Error("no JWE found");
    }
    // console.log(token);

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
                if (!Object.prototype.hasOwnProperty.call(cAl, al[0])) {
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
                if (!Object.prototype.hasOwnProperty.call(xAl, al[0])) {
                    xAl[al[0]] = [al[1]];
                }
                else if (typeof xAl[al[0]] !== "boolean") {
                    xAl[al[0]].push(al[1]);
                }
            }
            else if (al.length === 1) {
                xAl[al[0]] = false;
                if (!Object.prototype.hasOwnProperty.call(handlers, al[0])) {
                    handlers[al[0]] = false;
                }
            }
        }
    }

    for (let al in cAl) {
        if (!Object.prototype.hasOwnProperty.call(handlers, al) && cAl[al]) {
            handlers[al] = (sig) => {
                if (cAl[al].indexOf(sig.header[al]) < 0) {
                    return Promise.reject("bad crit member");
                }
            };
        }
    }
    for (let xl in xAl) {
        if (!Object.prototype.hasOwnProperty.call(handlers, xl) && xAl[xl]) {
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

    const jwe = await JWE.createDecrypt(jwks, opts).decrypt(token);

    // console.log(jwe);
    // console.log(jwe.payload.length);
    // console.log(jwe.payload.toString("utf8"));
    // console.log(jwe.plaintext.toString("utf8"));

    return jwe.payload.toString();
};
