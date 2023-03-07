import { loadKeyStore } from "./helper/readfile.js";

/**
 * finds a key id in a keystore and returns the JWK
 *
 * SYNOPSIS:
 *
 * findkey [-q -r -k -p --cnfkey --cnfref --public --quiet] [-j KEYSTORE] KEYID
 *
 * findkey finds and returns a key from a keystore. If the key is present, then
 * the JWK is returned in the requested format. If the keyid is not found, then
 * findkey returns an error.
 *
 * By default findkey returns the key as it is stored in the keystore.
 *
 * findkey accepts different options to manipulate the output.
 *
 * -j, --jwks, --keystore loads the given keystore. If no keystore is provided,
 *     the keystore is loaded from STDIN.
 *
 * -c, --cnfkey returns a RFC7800 confirmation key. This will include the key
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
 * -k, --kid KEYID - OPTIONAL the key id to return. This option is for
 *     compliance with other tools.
 *
 * If no keystore is provided, findkey will load the the keystore from STDIN,
 * this allows to pipe directly from the addkey tool.
 */

export const requireArgs = false;

export const options = {boolean: [
    "q", "quiet",
    "r", "cnfref",
    "c", "cnfkey",
    "p", "public",
    "b", "beautify",
    "h", "help"
]};

export default async function findkey (args) {
    const fn  = args.j || args.jwks || args.keystore || "--";
    const kid = args._.shift() || args.k || args.kid;
    const quiet = args.q || args.quiet;
    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const ks = await loadKeyStore(fn);

    if (!ks) {
        throw new Error("keystore not found");
    }

    const key = await ks.get({kid: kid});

    if (!key) {
        throw new Error("key not found");
    }

    if (!quiet) {
        const cnfref = args.r || args.cnfref;
        const cnfkey = args.c || args.cnfkey;
        const pubkey = args.c || args.cnfkey || args.p || args.public;

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

        return JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
    }

    return "";
}
