import jose from "node-jose";
import { loadFile } from "./helper/readfile.js";

export const requireArgs = false;

export const options = {boolean: [
    "U", "update",
    "b", "beautify",
    "p", "private",
    "h", "help"
]};

export default async function thumbprint(args) {
    let keyinput = args._.shift() || args.k || args.key ;
    const sha = args.s || args.sha || 256;
    const beautyJSON = args.b || args.beautify ? 4 : 0;
    const priv = args.p || args.private;

    if ([1, 256, 384, 512].indexOf(sha) < 0) {
        throw new Error("invalid hashing size");
    }

    if (!keyinput || keyinput === "--") {
        keyinput = await loadFile("--");
    }

    let key;

    try {
        key = await jose.JWK.asKey(keyinput);
    }
    catch (err) {
        if (err.message === "unsupported key type") {
            throw err;
        }

        throw new Error("invalid key provided");
    }

    let result = jose.util.base64url.encode(await key.thumbprint(`SHA-${sha}`));

    if (args.U || args.update) {
        const updateKey = key.toJSON(priv);

        updateKey.kid = result;

        result = JSON.stringify(updateKey, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
    }
    else if (beautyJSON) {
        result += "\n";
    }

    return result;
};
