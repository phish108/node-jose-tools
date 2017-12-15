const fs = require("fs");
const rl = require("readline");

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

module.exports.readStdin = readStdin;

module.exports.loadFile = function loadFile(fn) {
    if (fn === "--") {
        return readStdin();
    }
    return new Promise((resolve, reject) => fs.readFile(fn, (err, data) => err ? reject(err) : resolve(data.toString())));
};
