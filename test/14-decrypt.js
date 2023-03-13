/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import * as fs from "node:fs/promises";

import chai from "chai";

const expect = chai.expect;

import mock from "mock-stdin";
import {execute} from "../lib/helper/sanitize.js";

// import newkey from "../lib/newkey.js";
// import encrypt from "../lib/encrypt.js";
// import decrypt from "../lib/decrypt.js";

describe( "decrypt tool tests", function() {
    const pubkeys = "examples/example-pub.jwks";
    const prvkeys = "examples/example-priv.jwks";
    const tmpkeys = "test/files/tmp-keystore.jwks";

    this.timeout(15000);

    // create temporary keystore and RSA and EC Keys
    before(async () => {
        await execute("newkey", ["-r", "-U", "-j", tmpkeys, "-k", "foobaz"]);
        // await execute("newkey", ["-e", "-U", "-j", tmpkeys, "-k", "fecbar"]);
    });

    // remove temporary keystore
    after(async () => {
        await fs.unlink(tmpkeys);
    });


    it("decrypt without parameters", async () => {
        let count = 0;

        try {
            await execute("decrypt", []);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("no options provided");
        }

        expect(count).to.be.equal(1);
    });

    it("dir decrypt with keystore", async () => {
        let result, token, count = 0;
        const alg = "dir";
        // const enc;
        const kid = "foobar";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", prvkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            result = await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(JSON.stringify(result));
        expect(count).to.be.equal(0);
        expect(result).to.equal(payload);
    });

    // for this test a temporary key store is needed
    it("decrypt with bad kid", async () => {
        let token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foobaz";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", tmpkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("no key found");
        }

        expect(count).to.be.equal(1);
    });

    it("rsa decrypt", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            result = await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.equal(payload);
    });

    it("rsa decrypt without payload", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        // const payload = "hello world";

        token = await execute("encrypt", [
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
        ]);

        try {
            result = await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.equal("");

    });

    it("rsa decrypt with kid to public key", async () => {
        let token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            await execute("decrypt", [
                "-j", pubkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("no key found");
        }

        expect(count).to.be.equal(1);
    });

    it("enforce crit headers on the receiver", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            result = await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.equal(payload);
    });

    it("include crit headers on the sender", async () => {
        let result, token, count = 0;
        const alg = "RSA-OAEP";
        const kid = "foorsa";
        const payload = "hello world";

        token = await execute("encrypt", [
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            result = await execute("decrypt", [
                "-j", prvkeys,
                token
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.equal(payload);
    });

    describe( "decrypt tool tests from stdin", function() {
        let mockStdin;

        this.timeout(15000);

        beforeEach(function() {
            // console.log("prep");
            mockStdin = mock.stdin();
        });

        afterEach(function() {
            // console.log("cleanup");
            mockStdin.reset();
        });


        it("rsa decrypt from stdin", async function () {
            let result, token, count = 0;
            const alg = "RSA-OAEP";
            const kid = "foorsa";
            const payload = "hello world";

            token = await execute("encrypt", [
                "-j", pubkeys,
                "-l", alg,
                "-k", kid,
                payload
            ]);

            try {
                const prom = execute("decrypt", [
                    "-j", prvkeys
                ]);

                // give the tool some time to set itself up
                await new Promise((resolve) => setTimeout(resolve, 10));

                mockStdin.send(token);
                mockStdin.end();

                result = await prom;
            }
            catch (err) {
                count += 1;
                console.log(err.message);
            }

            expect(count).to.be.equal(0);
            expect(result).to.equal(payload);
        });
    });
});
