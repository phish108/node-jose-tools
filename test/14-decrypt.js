/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const encrypttool = require("../lib/encrypt");
const tool = require("../lib/decrypt");

describe( "decrypt tool tests", function() {
    const pubkeys = "examples/example-pub.jwks";
    const prvkeys = "examples/example-priv.jwks";
    const tmpkeys = "test/files/tmp-keystore.jwks";

    // create temporary keystore and RSA and EC Keys
    before(async () => {});

    // remove temporary keystore
    after(async () => {});

    it.skip("decrypt without parameters", async () => {
        let result, token, count = 0;

        try {
            result = tool([]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("no options provided");
        }
        
        expect(count).to.be.equal(1);
    });

    it.skip("dir decrypt with keystore", async () => {
        let result, token, count = 0;
        const alg = "dir";
        // const enc;
        const kid = "foobar";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([
                
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }
        
        expect(count).to.be.equal(0);
    });

    // for this test a temporary key store is needed
    it.skip("decrypt with bad kid", async () => {
        let result, token, count = 0;
        const alg = "dir";
        const kid = "foobaz";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(1);
    });

    it.skip("rsa decrypt", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
    });


    it.skip("rsa decrypt without payload", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        // const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);

    });

    it.skip("rsa decrypt with kid to public key", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
    });

    it.skip("enforce crit headers on the receiver", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
    });

    it.skip("include crit headers on the sender", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await encrypttool([

        ]);

        try {
            result = tool([

            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
    });
} );
