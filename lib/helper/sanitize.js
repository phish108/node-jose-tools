import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";
import os from "node:os";

import minimist from "minimist";

const basepath = getParent(import.meta.url, 2);

function getParent(location, levels) {
    return url.pathToFileURL(new Array(levels)
        .fill()
        .reduce(
            (p) => path.dirname(p),
            url.fileURLToPath(new URL(location))
        ));
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

    let tool;

    try {
        tool = await fs.stat(path.resolve(url.fileURLToPath(basepath),`${toolname}.js`));
    }
    catch (err) {
        throw new Error("unknown tool name");
    }

    if (!tool?.isFile()) {
        throw new Error("unknown tool name");
    }

    return toolname;
}

export async function execute(toolname, parameters) {
    const toolpath = `${basepath.href}/${toolname}.js`;
    const importpath = os.type() === "Windows_NT" ? toolpath : url.fileURLToPath(toolpath);
    const { default: tool, options, requireArgs } = await import(importpath);

    if (requireArgs && !parameters.length) {
        throw new Error("no options provided");
    }

    const args = parameters ? minimist(parameters, options) : minimist(parameters, {});

    if (args.h || args.help) {
        throw new Error("tool help");
    }

    return await tool(args);
}
