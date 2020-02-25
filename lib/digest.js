const jose = require("node-jose");
const base64 = jose.util.base64url;

const { readStdin } = require("./helper/readfile");

module.exports = async function (args) {
    args = require("minimist")(args);

    const size = args.s || args.size;

    let alg = typeof size === "string" || typeof size === "number" ? size : "SHA-256";

    if (typeof size === "number") {
        alg = `SHA-${alg}`;
    }

    alg = alg.toUpperCase().replace(/SHA(\d)/, "SHA-$1"); // ensure proper naming

    if (["SHA-256", "SHA-384", "SHA-512"].indexOf(alg) < 0) {
        throw new Error("unknown digest algorithm: " + alg);
    }

    const shadata = args._.shift();

    if (!shadata) {
        const data = await readStdin();

        if (data) {
            return base64.encode(await jose.JWA.digest(alg, data));
        }
        throw new Error("data missing");
    }

    return base64.encode(await jose.JWA.digest(alg, shadata));
};
