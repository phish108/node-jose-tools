import * as fs from "node:fs/promises";
import url from 'node:url';

import jose from "node-jose";

import * as agent from "superagent";

const { JWK }  = jose;

export function readStdin() {
    return new Promise(function (resolve) {
        let data = "";

        process.stdin.on("data", (chunk) => {
            if (typeof chunk === "string") {
                data += chunk;
            }
            else {
                data += chunk.toString();
            }
        });

        process.stdin.on("end", () => resolve(data));
    });
}

export async function loadUri(uri) {
    const result = await agent.get(uri);
    return result;
}

export async function loadFile(fn) {
    if (fn === undefined) {
        return null;
    }

    if (fn === "--") {
        return readStdin();
    }

    try {
        const uri = new URL(fn); 
    }
    catch (err) {
        return (await fs.readFile(fn)).toString();
    }
    return loadUri(fn);
}

export function loadKeyStore(fn, create = false) {
    if ((!fn || fn === "--") && create) {
        return JWK.createKeyStore();
    }

    return loadFile(fn)
        .then((data) => JWK.asKeyStore(typeof data === "string" ? JSON.parse(data) : data))
        .catch((err) => { // eslint-disable-line no-unused-vars
            return create ? JWK.createKeyStore() : null;
        });
}
