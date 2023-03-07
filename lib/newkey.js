import { loadKeyStore } from "./helper/readfile.js";
import * as fs from "node:fs/promises";

export const requireArgs = false;

export const options = {boolean: [
    "U", "update",
    "q", "quiet",
    "K", "as-keystore",
    "r", "rsa", "RSA",
    "e", "EC", "ec",
    "o", "oct", "OCT",
    "d", "OKP", "dh", "okp",
    "b", "beautify",
    "h", "help"
]};

export default async function newkey(args) {
    const type = args.t || args.type;
    const size = args.s || args.c || args.size || args.curve;
    const use  = args.u || args.use;
    const alg  = args.a || args.alg;
    const kid  = args.k || args.kid;

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    let flagtype;

    if (!type) {
        if (args.r || args.RSA || args.rsa) {
            flagtype = "RSA";
        }
        else if (args.e || args.EC || args.ec) {
            flagtype = "EC";
        }
        else if (args.o || args.oct || args.OCT) {
            flagtype = "oct";
        }
        else if (args.d || args.OKP || args.dh || args.okp) {
            flagtype = "OKP";
        }
        else {
            throw new Error("missing type");
        }
    }

    const typ = flagtype ? flagtype : type !== "oct" ? type.toUpperCase() : type;

    if (!typ || ["oct", "RSA", "EC", "OKP"].indexOf(typ) < 0) {
        throw new Error("unknown key type " + typ);
    }

    const props = {};

    if (use) {
        const tuse = {"sig": "sig", "enc": "enc", "encrypt": "enc", "sign": "sig"}[use];

        if (tuse === undefined) {
            throw new Error("unknown use " + use);
        }
        props.use = tuse;
    }

    let ksize = size;

    if (typ === "RSA" && size < 2048) { // create rsa keys
        throw new Error("insufficient key length");
    }
    else if (typ === "oct" && size < 256) { // create octet keys
        throw new Error("insufficient key length");
    }
    else if (typ === "EC") { // create Elliptic Curve Keys
        if ("256 384 521 P-256 P-384 P-521".split(" ").indexOf(String(size)) < 0) {
            throw new Error("invalid curve parameter");
        }

        if ("P-256 P-384 P-521".split(" ").indexOf(size) < 0) {
            if ([256, 384, 521].indexOf(ksize) >= 0) {
                ksize = `P-${ksize}`;
            }
        }
    }
    else if (typ === "OKP") { // create EdDSA keys..
        // NOTE: RFC8037 OKP Keys are currently not supported by node-jose
        if ("448 25519 Ed448 X448 Ed25519 X25519".split(" ").indexOf(String(size)) < 0) {
            throw new Error("invalid curve parameter");
        }
        if ("Ed448 X448 Ed25519 X25519".split(" ").indexOf(size) < 0) {
            ksize = use === "sig" ? "Ed" : "X";
            if (use !== "sig") {
                props.use = "enc";
            }

            ksize += size;
        }
        // FIXME Remove as soon node-jose supports rfc8037 EdDSA signatures
        throw new Error("RFC8037 encryption and signatures are currently not supported");
    }

    if (typeof alg === "string") {
        // TODO alg verification for keytype, size and use
        // not all keytypes are suitable for all algs
        props.alg = alg;
    }

    if (typeof kid === "string") {
        props.kid = kid;
    }

    const jwksFn   = args.j || args.jwks || args.keystore || "--";
    const keystore = await loadKeyStore(jwksFn, true);
    const key      = await keystore.generate(typ, ksize, props);
    const json     = await keystore.toJSON(true);

    if (jwksFn !== "--" && (args.U || args.update)) {
        await fs.writeFile(jwksFn, JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""));
    }

    if (!(args.q || args.quiet)) {
        if (args.K || args["as-keystore"]) {
            return JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
        }
        else {
            return JSON.stringify(key.toJSON(true), null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
        }
    }
};
