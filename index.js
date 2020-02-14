#!/usr/bin/env node

if (process.argv[2] === undefined) {
    console.log("ERROR: No tool selected.");
    process.exit(1);
}

// verify that the requested too actually exists.
const fs = require("fs");

// drop all dots and slashes
let tool = process.argv[2]; 
tool = tool.replace(/\./g, ""); // drop all dots
tool = tool.replace(/\//g, "-"); // replace all slashed with dashes

let file = null; 

try {
    file = fs.statSync(`./lib/${tool}.js`);
}
catch (err) {
    console.log("ERROR: invalid tool selected.");
    process.exit(1);
}

if (!file.isFile()) {
    console.log("ERROR: invalid tool selected.");
    process.exit(1);
}


require(`./lib/${tool}.js`)(process.argv.slice(3))
    .then(() => process.exit(0))
    .catch((err) => {
        // process.stderr.write(err.message);
        console.log(err); // eslint-disable-line no-console
        process.exit(1);
    });
