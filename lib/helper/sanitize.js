import * as fs from "node:fs/promises";
import * as path from "node:path";
import { basename } from "node:path";

const basepath = getParent(import.meta.url, 2);

function getParent(url, levels) {
    return new Array(levels).fill().reduce((p) => path.dirname(p), (new URL(url)).pathname);
}

export default async function sanitize(toolname) {
    if (!toolname) {
        throw new Error("missing toolname");
    }

    if (toolname === "--help" || toolname === "-h") {
        throw new Error("basic help");
    }

    toolname = toolname.replace(/\./g, ""); // drop all dots
    toolname = toolname.replace(/\//g, "-"); // replace all slashes with dashes

    try {
        const tool = await fs.stat(`${basepath}/${toolname}.js`);
        if (!tool.isFile()) {
            throw new Error("not a file");
        }
    }
    catch (err) {
        throw new Error("unknown tool name");
    }

    return toolname;
}
