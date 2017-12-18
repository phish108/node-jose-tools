const { JWK } = require("node-jose");

const { loadFile, loadKeyStore } = require("./helper/readfile");

async function loadKey(fn, keystore) {
    let key;

    try {
        key = await loadFile(fn);
    }
    catch (err) {
        return false;
    }

    try {
        await keystore.add(key);
    }
    catch (err) {
        try {
            await keystore.add(key, "pem");
        }
        catch (err) {
            try {
                await keystore.add(key, "pkcs8");
            }
            catch (err) {
                try {
                    await keystore.add(key, "x509");
                }
                catch (err) {
                    try {
                        await keystore.add(key, "pkix");
                    }
                    catch (err) {
                        try {
                            await keystore.add(key, "spki");
                        }
                        catch(err) {
                            // merge key stores
                            const ks = await JWK.asKeyStore(key);

                            await Promise.all(ks.all().map((k) => keystore.add(k)));
                        }
                    }
                }
            }
        }
    }

    return true;
}

module.exports = async function (args) {
    // tool [kstore [keyfile ...]]
    const jwksFn = args.shift();
    const jwks = await loadKeyStore(jwksFn, true);

    // const jwks = await loadOrCreate(jwksFn);

    await Promise.all(args.map((fn) => loadKey(fn, jwks)));
    const json = await jwks.toJSON(true);

    process.stdout.write(JSON.stringify(json), "utf8");
};
