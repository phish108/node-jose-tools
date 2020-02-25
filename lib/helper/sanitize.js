const fs = require("fs");

module.exports = async function sanitize(toolname) {
    if (!toolname) {
        throw new Error("missing toolname");
    }

    toolname = toolname.replace(/\./g, ""); // drop all dots
    toolname = toolname.replace(/\//g, "-"); // replace all slashed with dashes

    return new Promise((resolve, reject) => {
        fs.stat(`./lib/${toolname}.js`, (err, stats) => {
            if (err) {
                reject(new Error("unknown tool name"));
            }
            else if (stats.isFile()) {
                resolve(toolname);
            }
            else {
                reject(new Error("unknown tool name"));
            }
        });
    });
};
