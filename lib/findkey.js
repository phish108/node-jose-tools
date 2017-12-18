const { loadKeyStore } = require("./helper/readfile");

/**
 * finds a key id in a keystore and returns the JWK
 *
 * SYNOPSIS:
 *
 * findkey [KEYSTORE] KEYID [-q -r -k -p --cnfkey --cnfref --public --quiet]
 *
 * findkey finds and returns a key from a keystore. If the key is present, then
 * the JWK is returned in the requested format. If the keyid is not found, then
 * findkey returns an error.
 *
 * By default findkey returns the key as it is stored in the keystore.
 *
 * findkey accepts different options to manipulate the output.
 *
 * -k, --cnfkey returns a RFC7800 confirmation key. This will include the key
 *     of octet keys. For all other keys the public key is returned. This will
 *     throw an error, if the keyid does not refer to a private key.
 *
 * -p, --public returns the public key instead of a private key. If the key is a
 *    public key, this option does nothing.
 *
 * -q, --quiet generates no output. This flag is ideal to verify the presence
 *     of a key without obtaining it.
 *
 * -r, --cnfref returns a RFC7800 confirmation key reference. This will
 *     throw an error, if the keyid does not refer to a private key.
 *
 * If no keystore is provided, findkey will load the the keystore from STDIN,
 * this allows to pipe directly from the addkey tool.
 */
module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["q", "r", "k", "p", "cnfkey", "cnfref", "public", "quiet"]});
    const fn  = args._.length > 1 ? args._[0] : "--";
    const kid = args._.length > 1 ? args._[1] : args._[0];
    const quiet = args.q || args.quiet;

    const ks = await loadKeyStore(fn);

    const key = await ks.get({kid: kid});

    if (!key) {
        throw new Error("key not found");
    }
    if (!quiet) {
        const cnfref = args.r || args.cnfref;
        const cnfkey = args.k || args.cnfkey;
        const pubkey = args.k || args.cnfkey || args.p || args.public;

        if ((cnfref || cnfkey) && key.kty !== "oct" && !key.privateKey) {
            throw new Error("not a private key");
        }

        let json;

        if (cnfref) {
            json = { cnf: {kid: key.kid}};
        }
        else if (cnfkey) {
            json = { cnf: { jwk: key.toJSON(key.kty === "oct")}};

        }
        else {
            json =  key.toJSON(!pubkey);
        }

        process.stdout.write(JSON.stringify(json), "utf8");
    }
};
