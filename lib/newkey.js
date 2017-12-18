const { JWK } = require("node-jose");

module.exports = async function (args) {
    const keystore = await JWK.createKeyStore();

    const type = args.shift();
    const size = args.shift();
    const use  = args.shift(); // optional

    const typ = type !== "oct" ? type.toUpperCase() : type;

    const props = {};

    if (use && use.length) {
        props.use = use;
    }

    let ksize = size;

    if (typ === "RSA" && size < 2048) { // create rsa keys
        throw new Error("insufficient key length");
    }
    else if (typ === "oct" && size < 256) { // create octet keys
        throw new Error("insufficient key length");
    }
    else if (typ === "EC") { // create Elliptic Curve Keys
        if ("256 384 521 25519 448 P-256 P-384 P-521".split(" ").indexOf(size) < 0) {
            throw new Error("invalid curve parameter");
        }

        if ("P-256 P-384 P-521 Ed25519 X25519 Ed448 X448".split(" ").indexOf(size) < 0) {
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
            ksize = use === "sign" ? "Ed" : "X";
            ksize += size;
        }
        // FIXME Remove as soon node-jose supports rfc8037 EdDSA signatures
        throw new Error("RFC8037 encryption and signatures are currently not supported");
    }

    const key = await keystore.generate(typ, ksize, props);

    process.stdout.write(JSON.stringify(key.toJSON(true)), "utf8");
};
