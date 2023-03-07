import { loadKeyStore } from "./helper/readfile.js";

export const requireArgs = false;
export const options = {boolean: [
    "b", "beautify",
    "h", "help"
]};

export default async function listkeys(args) {
    const fn  = args.j || args.jwks || args.keystore || args._[0] || "--";

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const ks = await loadKeyStore(fn);

    const keys = await ks.all();

    const kids = keys.map(k => k.kid);

    return JSON.stringify(kids, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
}
