#!/usr/bin/env node

// drop all dots and slashes
require("./lib/helper/sanitize.js")(process.argv[2])
    // include and run the tool
    .then((tool) => require(`./lib/${tool}`)(process.argv.slice(3)))
    // gracefully fail on error
    .catch((err) => {
        // show mini help
        if (err.message === "missing toolname") {
            return require("./lib/helper/loaddoc.js")("00_help");
        }
        // show full help if requested
        else if (err.message === "basic help") {
            return require("./lib/helper/loaddoc.js")("00_INDEX");
        }
        else {
            throw err;
        }
    })
    // print on success
    .then((data) => process.stdout.write(data, "utf8"))
    .catch((err) => {
        // process.stderr.write(err.message);
        console.log(err.message); // eslint-disable-line no-console
        process.exit(1);
    });
