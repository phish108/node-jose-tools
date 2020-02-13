const fs = require("fs");
const rl = require("readline");
const { URL } = require("url");
const { JWK } = require("node-jose");

const agent = require("superagent");

function readStdin() {
    return new Promise(function (resolve, reject) {
        const inStream = rl.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        let data = "";

        inStream.on("line", (line) => data += line);
        inStream.on("close", () => resolve(data));
        inStream.on("error", () => reject("error!")); // wonder if this works?
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
