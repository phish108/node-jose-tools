// helper for the tests

import minimist from "minimist";

export default async function calltool(toolname, args) {

    const { default: tool, options, requireArgs } = await import(`../${toolname}.js`);
    
    if (requireArgs && !argv.length) {
        throw new Error("no options provided");
    }

    args = parameters ? minimist(args, options) : {};

    return {
        tool,
        args
    };
}