const { JWE } = require("node-jose");
const { randomBytes } = require("crypto");

const {loadFile, loadKeyStore} = require("./helper/readfile");
const base64 = require("base64url");

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["F", "G", "flat", "flattened", "general", "json", "JSON", "p", "payload"]});

    let aud      = args.a || args.aud;
    const jwksFn = args.j || args.jwks;
    const kid    = args.k || args.kid;
    const alg    = args.l || args.alg;
    const enc    = args.e || args.enc;

    const fGeneral  = args.G || args.general || args.json || args.JSON;
    const fFlatened = args.F || args.flat || args.flattened;

    if (!alg && !enc) {
        throw new Error("alg or enc algorithm are missing");
    }

    if (Array.isArray(alg) || Array.isArray(enc)) {
        throw new Error("only one alg or enc algorithm is allowed");
    }

    const jwks = await loadKeyStore(jwksFn, false);

    if (!jwks) {
        throw new Error("no keyring");
    }

    const key = await jwks.get(kid);

    if (!key) {
        throw new Error("key not found");
    }

    const reference = true;
    const payload = args.p || args.payload ? await loadFile(args._.length ? args._.shift() : "--") : `${args._.shift() || ""}`;

    if (typeof payload !== "string") {
        throw new Error("no payload found for encryption");
    }

    const format = fFlatened ? "flattened" : fGeneral ? "general" : "compact";
    const fields = {
        cty: "JWT",
        alg,
        enc,
        aud
    };

    if (alg.startsWith("PBES2")) {
        fields.p2s = base64.encode(randomBytes(16));
        fields.p2c = 4096;
    }

    try {
        let json = {};

        if (payload.split(".").length === 3) {
            // in case of compact JWS, we want to get the aud
            json = JSON.parse(base64.decode(payload.split(".")[1]));
        }
        else {
            json = JSON.parse(payload);
            if (typeof json.payload === "object") {
                // one of the other JWS formats
                json = json.payload;
            }
        }

        if (json.aud) {
            fields.aud = json.aud;
        }

        if (json.iss) {
            fields.iss = json.iss;
        }
    }
    catch (err) {
        // ignore
        // console.log(err);
    }

    const token = await JWE.createEncrypt({ format, fields }, { key, reference })
        .update(payload)
        .final();

    process.stdout.write(format === "compact" ? token : JSON.stringify(token), "UTF8");
};
