// provides information about flat JWT
const fs = require("fs");
const { util } = require("node-jose");
const base64 = util.base64url;
const { loadFile } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: [
        "b", "beautify",
        "h", "help"
    ]});

    if (args.h || args.help) {
        return require("./helper/loaddoc.js")("info");
    }

    const beautyJSON = args.b || args.beautify ? 4 : 0;
    const tmpToken = args._.shift();

    let tokenstring;

    if (typeof tmpToken === "string" && tmpToken.startsWith("eyJ")) {
        tokenstring = tmpToken;
    }
    else {
        const bIsFile = await new Promise((resolve) => {
            fs.stat(tmpToken, (err, stats) => {
                if (err || !stats) {
                    resolve(false);
                }
                else {
                    resolve(stats.isFile);
                }
            });
        });

        if (!bIsFile) {
            tokenstring = tmpToken;
        }
    }

    const token = tokenstring ? tokenstring : await loadFile(args._.length ? tmpToken : "--");
    const result = {};

    let rawToken, jToken;

    try {
        jToken = JSON.parse(token);
    }
    catch (err) {
        rawToken = token.split(".");
    }

    if (rawToken) {
        result.format = "compact";
        switch (rawToken.length) {
                case 5:
                    result.type = "JWE";
                    break;
                case 3:
                    result.type = "JWS";
                    break;
                default:
                    throw new Error("Invalid JWT, unrecognizable compact");
        }

        try {
            result.header = JSON.parse(base64.decode(rawToken[0]));
        }
        catch (err) {
            throw new Error("Invalid JWT Header");
        }

        if (rawToken.length === 3) {
            result.signature = rawToken[2];
            result.payload = JSON.parse(base64.decode(rawToken[1]));
        }
    }
    else if (jToken) {
        if (Object.prototype.hasOwnProperty.call(jToken, "ciphertext")) {
            result.type = "JWE";
            if (Object.prototype.hasOwnProperty.call(jToken, "recipients")) {
                result.format = "general";
            }
            else {
                result.format = "flattened";
            }

            result.header = JSON.parse(base64.decode(jToken.protected));
        }
        else if (Object.prototype.hasOwnProperty.call(jToken, "payload")) {
            result.type = "JWS";
            if (Object.prototype.hasOwnProperty.call(jToken, "signatures")) {
                result.format = "general";
                result.header = jToken.signatures.map((e) => {
                    return {
                        unprotected: e.header,
                        protected: JSON.parse(base64.decode(e.protected))
                    };
                });
                result.signature = jToken.signatures.map((e) => e.signature);
                if (result.header.length === 1) {
                    result.header = result.header[0];
                    result.signature = result.signature[0];
                }
            }
            else {
                result.format = "flattened";
                result.header = {
                    unprotected: jToken.header,
                    protected: JSON.parse(base64.decode(jToken.protected))
                };

            }

            result.payload = JSON.parse(base64.decode(jToken.payload));
        }
        else {
            throw new Error("Invalid JWT, unrecognizable JSON");
        }

    }
    else {
        throw new Error("Invalid JWT, wrong format");
    }

    return JSON.stringify(result, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
};
