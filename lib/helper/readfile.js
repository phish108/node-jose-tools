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

export function loadUri(uri) {
    return new Promise((resolve, reject) => {
        agent
            .get(uri)
            .end((err,result) => err ? reject(err) : resolve(result.body));
    });
}

export function loadFile(fn) {
    if (fn === undefined) {
        return null;
    }

    if (fn === "--") {
        return readStdin();
    }

    try {
        const uri = new URL(fn); // eslint-disable-line no-unused-vars
    }
    catch (err) {
        return new Promise((resolve, reject) => fs.readFile(fn, (err, data) => err ? reject(err) : resolve(data.toString())));
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
