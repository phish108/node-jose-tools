import * as fs from "node:fs/promises";
// import * as path from "path";

export default async function sanitize(toolname) {
    if (!toolname) {
        throw new Error("missing toolname");
    }

    if (toolname === "--help" || toolname === "-h") {
        throw new Error("basic help");
    }

    toolname = toolname.replace(/\./g, ""); // drop all dots
    toolname = toolname.replace(/\//g, "-"); // replace all slashed with dashes

    try {
        const tool = await fs.stat(`./lib/${toolname}.js`);
        if (!tool.isFile()) {
            throw new Error("not a file");
        }
    }
    catch (err) {
        throw new Error("unknown tool name");
    }

    return toolname;
}
