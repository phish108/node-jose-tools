const jose = require("node-jose");
const { loadFile } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args, {boolean: ["U", "update", "b", "beautify", "p", "private"]});

    let keyinput = args._.shift() || args.k || args.key ;
    const sha = args.s || args.sha || 256;
    const beautyJSON = args.b || args.beautify ? 4 : 0;
    const priv = args.p || args.private;

    switch (sha) {
            case 1:
            case 256:
            case 384:
            case 512:
                break;
            default:
                throw new Error("invalid thumbprint hash");
                // break;
    }

    if (!keyinput || keyinput === "--") {
        keyinput = await loadFile("--");
    }

    const key = await jose.JWK.asKey(keyinput);

    if (!key) {
        throw new Error("invalid key provided");
    }

    let result = jose.util.base64url.encode(await key.thumbprint(`SHA-${sha}`));

    if (args.U || args.update) {
        const updateKey = key.toJSON(priv);

        updateKey.kid = result;

        result = JSON.stringify(updateKey, null, beautyJSON) + (beautyJSON > 0 ? "\n" : "");
    }
    else {
        result += "\n";
    }

    process.stdout.write(result, "utf8");
};
