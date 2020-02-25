#!/usr/bin/env node

// drop all dots and slashes
require("./lib/helper/sanitize.js")(process.argv[2])
    // include and run the tool
    .then((tool) => require(`./lib/${tool}`)(process.argv.slice(3)))
    // print on success
    .then((data) => process.stdout.write(data, "utf8"))
    // gracefully fail on error
    .catch((err) => {
        // process.stderr.write(err.message);
        console.log(err.message); // eslint-disable-line no-console
        process.exit(1);
    });
