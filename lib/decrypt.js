import jose from "node-jose";
import {loadFile, loadKeyStore} from "./helper/readfile.js";
import {checkCritMembers} from "./verify.js";

const { JWE } = jose;

export const requireArgs = true;

export const options = {
    boolean: [
        "h", "help"
    ]
};

export default async function decrypt(args) {
    const jwksFn = args.j || args.jwks;
    // const aud    = args.a || args.aud;
    // const iss    = args.i || args.iss;

    const jwks = await loadKeyStore(jwksFn, false);


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

    const handlers = checkCritMembers(args);

    const opts = {
        handlers
    };

    const jwe = await JWE.createDecrypt(jwks, opts).decrypt(token);

    return jwe.payload.toString();
}
