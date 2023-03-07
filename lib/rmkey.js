import { loadKeyStore, readStdin } from "./helper/readfile.js";
import * as fs from "node:fs/promises";

async function removeKey(kid, keystore) {
    const key = await keystore.get({kid: kid});

    if (key) {
        await keystore.remove(key);
    }
}

export const requireArgs = false;
export const options = {boolean: [
    "U", "update",
    "q", "quiet",
    "b", "beautify",
    "h", "help"
]};

export default async function rmkey(args) {
    const fn  = args.j || args.jwks || args.keystore;

    const tmpKid = args.k || args.kid;
    const beautyJSON = args.b || args.beautify ? 4 : 0;

    let stdinKids;

    if (args._.length) {
        stdinKids = args._;
    }
    else if (!tmpKid) {
        stdinKids = await readStdin();
    }

    if (typeof stdinKids === "string") {
        stdinKids = stdinKids.split(/\n\r|\n|\r/);
    }

    const kids = stdinKids || [];

    if (tmpKid) {
        kids.push(tmpKid);
    }

    const ks = await loadKeyStore(fn);

    await Promise.all(kids.map((k) => removeKey(k, ks)));

    const json = await ks.toJSON(true);

    if (args.U || args.update) {
        await fs.writeFile(fn, JSON.stringify(json, null, beautyJSON));
    }

    if (!(args.q || args.quiet)) {
        return JSON.stringify(json, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
    }

    return "";
}
