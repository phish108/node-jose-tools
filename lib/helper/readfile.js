const fs = require("fs");

const { URL } = require("url");
const { JWK } = require("node-jose");

const agent = require("superagent");

function readStdin() {
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

function loadUri(url) {
    return new Promise((resolve, reject) => {
        agent
            .get(url)
            .end((err,result) => err ? reject(err) : resolve(result.body));
    });
}

function loadFile(fn) {
    if (fn === undefined) {
        return null;
    }

    if (fn === "--") {
        return readStdin();
    }

    try {
        const url = new URL(fn); // eslint-disable-line no-unused-vars
    }
    catch (err) {
        return new Promise((resolve, reject) => fs.readFile(fn, (err, data) => err ? reject(err) : resolve(data.toString())));
    }
    return loadUri(fn);
}

function loadKeyStore(fn, create = false) {
    if ((!fn || fn === "--") && create) {
        return JWK.createKeyStore();
    }

    return loadFile(fn)
        .then((data) => JWK.asKeyStore(typeof data === "string" ? JSON.parse(data) : data))
        .catch((err) => { // eslint-disable-line no-unused-vars
            return create ? JWK.createKeyStore() : null;
        });
}

module.exports.loadKeyStore = loadKeyStore;
module.exports.readStdin    = loadUri;
module.exports.readStdin    = readStdin;
module.exports.loadFile     = loadFile;
