#!/usr/bin/env node

import loaddoc from "./lib/helper/loaddoc.js";
import sanitize from "./lib/helper/sanitize.js";

import minimist from "minimist";

try {
    const toolmodule = await sanitize(process.argv[2]);
    const { default: tool, options, requireArgs } = await import(`./lib/${toolmodule}.js`);

    const argv = process.argv.slice(3);

    if (requireArgs && !argv.length) {
        throw new Error("no options provided");
    }

    const args = minimist(argv, options);

    if (args.h || args.help) {
        console.log(await loaddoc(toolmodule));
        process.exit(0);
    }

    const data = await tool(args);

    process.stdout.write(data, "utf8");
}
catch (err) {
    // show mini help
    let doc = "";

    if (err.message === "missing toolname") {
        doc = await loaddoc("00_help");
    }
    // show full help if requested
    else if (err.message === "basic help") {
        doc = await loaddoc("00_INDEX");
    }
    else {
        console.log(err.message); // eslint-disable-line no-console
        process.exit(1);
    }

    console.log(doc);
}
