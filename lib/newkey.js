const { loadKeyStore } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["U", "update", "q", "quiet", "K", "as-keystore" , "r", "rsa", "RSA", "e", "EC", "ec", "o", "oct", "OCT", "d", "OKP", "dh", "okp", "b", "beautify"]});

    const type = args.t || args.type;
    const size = args.s || args.c || args.size || args.curve;
    const use  = args.u || args.use;
    const beautyJSON = args.b || args.beautify ? 4 : 0;

    let flagtype;

    if (!type) {
        if (args.r || args.RSA || args.rsa) {
            flagtype = "RSA";
        }
        else if (args.e || args.EC || args.ec) {
            flagtype = "RSA";
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
        if(["sign", "encrypt", "sig", "enc"].indexOf(use) < 0) {
            throw new Error("unknow use " + use);
        }
        props.use = {"sig": "sig", "enc": "enc", "encrypt": "enc", "sign": "sig"}[use];
    }

    let ksize = size;

    if (typ === "RSA" && size < 2048) { // create rsa keys
        throw new Error("insufficient key length");
    }
    else if (typ === "oct" && size < 256) { // create octet keys
        throw new Error("insufficient key length");
    }
    else if (typ === "EC") { // create Elliptic Curve Keys
        if ("256 384 521 P-256 P-384 P-521".split(" ").indexOf(size) < 0) {
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
        if ("448 25519 Ed448 X448 Ed25519 X25519".split(" ").indexOf(size) < 0) {
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

    const jwksFn   = args.j || args.jwks || args.keystore || "--";
    const keystore = await loadKeyStore(jwksFn, true);
    const key      = await keystore.generate(typ, ksize, props);
    const json     = await keystore.toJSON(true);

    if (jwksFn !== "--" && (args.U || args.update)) {
        await new Promise((resolve, reject) => require("fs").writeFile(jwksFn, JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), (err) => err ? reject(err) : resolve()));
    }

    if (!(args.q || args.quiet)) {
        if (args.K || args["as-keystore"]) {
            process.stdout.write(JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), "utf8");
        }
        else {
            process.stdout.write(JSON.stringify(key.toJSON(true), null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), "utf8");
        }
    }
};
