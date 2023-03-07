import * as fs from "node:fs/promises";
import * as path from "node:path";

import minimist from "minimist";

const basepath = getParent(import.meta.url, 2);

function getParent(url, levels) {
    const basepath = new Array(levels).fill().reduce((p) => path.dirname(p), new URL(url).pathname); // eslint-disable-line no-undef
    const aPath = basepath.split("/");

    return path.join(...aPath);
}

export async function sanitize(toolname) {
    if (!toolname) {
        throw new Error("missing toolname");
    }

    if (toolname === "--help" || toolname === "-h") {
        throw new Error("basic help");
    }

    toolname = toolname.replace(/\./g, ""); // drop all dots
    toolname = toolname.replace(/\//g, "-"); // replace all slashes with dashes

    const tool = await fs.stat(path.join(basepath,`${toolname}.js`));

    if (!tool.isFile()) {
        throw new Error("unknown tool name");
    }

    return toolname;
}

export async function execute(toolname, parameters) {
    const { default: tool, options, requireArgs } = await import(path.join(basepath,`${toolname}.js`));

    if (requireArgs && !parameters.length) {
        throw new Error("no options provided");
    }

    const args = parameters ? minimist(parameters, options) : minimist(parameters, {});

    if (args.h || args.help) {
        throw new Error("tool help");
    }

    return await tool(args);
}
