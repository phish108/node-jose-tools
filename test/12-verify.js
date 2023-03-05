/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

const tool = require("../lib/verify.js");
const signtool = require("../lib/sign.js");

describe( "verify tool tests", function() {
    this.timeout(15000);

    const signstore = "examples/example-priv.jwks";
    const verifystore = "examples/example-pub.jwks";

    it("verify without parameters", async () => {
        let result, count = 0;

        try {
            result = await tool([]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("no options provided");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("verify with key", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256"]);

        let result, count = 0;

        try {
            result = await tool(["-j", verifystore, jws]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.an("string");

        const payload = JSON.parse(result);

        expect(payload).to.own.property("iat");
    });

    it("verify aud header", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256", "-a", "foo"]);

        let result, count = 0;

        try {
            result = await tool(["-j", verifystore, "-a", "foo", jws]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.an("string");

        const payload = JSON.parse(result);

        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("aud", "foo");
    });

    it("verify iss header", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256", "-i", "foo"]);

        let result, count = 0;

        try {
            result = await tool(["-j", verifystore, "-i", "foo", jws]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.an("string");

        const payload = JSON.parse(result);

        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("iss", "foo");
    });

    it("verify sub header", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256", "-s", "foo"]);

        let result, count = 0;

        try {
            result = await tool(["-j", verifystore, "-s", "foo", jws]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.an("string");

        const payload = JSON.parse(result);

        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("sub", "foo");
    });

    it("verify exp times header", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256", "-s", "foo", "-x", "5"]);

        let result, count = 0;

        try {
            result = await tool(["-j", verifystore, "-s", "foo", jws]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.an("string");

        // console.log(result);
        const payload = JSON.parse(result);

        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("exp");
        expect(payload).to.own.property("sub", "foo");
    });

    it("verify outdated exp times header", async () => {
        // first prepare the signed jws
        const jws = await signtool(["-j", signstore, "-k", "foobar", "-l", "HS256", "-s", "foo", "-x", "1"]);

        let count = 0;

        await new Promise((result) => setTimeout(result, 2000));
        try {
            await tool(["-j", verifystore, "-s", "foo", jws]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("token is too old");
        }

        expect(count).to.be.equal(1);
    });
});
