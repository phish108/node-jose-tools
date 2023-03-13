#!/usr/bin/env node

import loaddoc from "./lib/helper/loaddoc.js";
import {sanitize, execute} from "./lib/helper/sanitize.js";

let toolname = process.argv[2];

const errors = {
    "missing toolname": () => loaddoc("00_help"),
    "basic help": () => loaddoc("00_INDEX"),
    "tool help": () => loaddoc(toolname)
};

try {
    toolname = await sanitize(toolname);

    const argv = process.argv.slice(3);
    const data = await execute(toolname, argv);

    process.stdout.write(data, "utf8");
}
catch (err) {
    if (err.message in errors) {
        process.stderr.write(await errors[err.message](), "utf8");
    }
    else {
        process.stderr.write(err.message, "utf8");
        process.exit(1);
    }
}
