// provides information about flat JWT

const { util } = require("node-jose");
const base64 = util.base64url;
const { loadFile } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["b", "beautify"]});

    const beautyJSON = args.b || args.beautify ? 4 : 0;

    const token = await loadFile(args._.length ? args._.shift() : "--");
    const rawToken = token.split(".");

    const result = {};

    switch (rawToken.length) {
            case 5:
                result.type = "JWE";
                break;
            case 3:
                result.type = "JWS";
                break;
            default:
                throw new Error("Invalid JWT");
    }

    try {
        result.header = JSON.parse(base64.decode(rawToken[0]));
    }
    catch (err) {
        throw new Error("Invalid JWT Header");
    }

    if (rawToken.length === 3) {
        try {
            result.body = JSON.parse(base64.decode(rawToken[1]));
        }
        catch (err) {
            throw new Error("Invalid JWT Body");
        }

        result.signature = rawToken[2];
    }

    process.stdout.write(JSON.stringify(result, null, beautyJSON) + (beautyJSON > 0 ? "\n" : ""), "UTF8");
};
