/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

const encrypttool = require("../lib/encrypt.js");
const signtool = require("../lib/sign.js");
const infotool = require("../lib/info.js");

describe( "info tool tests", function() {
    const pubkeys = "examples/example-pub.jwks";
    const prvkeys = "examples/example-priv.jwks";

    it("JWE header info compact", async () => {
        let result, count = 0;
        const alg = "dir";
        // const enc;
        const kid = "foobar";
        const payload = "hello world";

        const token = await encrypttool([
            "-j", prvkeys,
            "-l", alg,
            "-k", kid,
            payload
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "compact");
        expect(infodata).to.own.property("type", "JWE");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("cty", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        expect(infodata.header).to.own.property("enc", "A256GCM");
    });

    it.skip("JWE header info general alg = dir", async () => {
        let result, count = 0;
        const alg = "dir";
        // const enc;
        const kid = "foobar";
        const payload = "hello world";

        const token = await encrypttool([
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            "-G",
            payload
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "general");
        expect(infodata).to.own.property("type", "JWE");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("cty", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        expect(infodata.header).to.own.property("enc", "A256GCM");
    });

    it("JWE header info flattened alg = dir", async () => {
        let result, count = 0;
        const alg = "dir";
        // const enc;
        const kid = "foobar";
        const payload = "hello world";

        const token = await encrypttool([
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            "-F",
            payload
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "flattened");
        expect(infodata).to.own.property("type", "JWE");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("cty", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        expect(infodata.header).to.own.property("enc", "A256GCM");
    });


    it("JWE header info general alg = rsa-oaep", async () => {
        let result, count = 0;
        const alg = "RSA-OAEP";
        // const enc;
        const kid = "foorsa";
        const payload = "hello world";

        const token = await encrypttool([
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            "-G",
            payload
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "general");
        expect(infodata).to.own.property("type", "JWE");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("cty", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        expect(infodata.header).to.own.property("enc", "A128CBC-HS256");
    });

    it("JWE header info flattened alg = rsa-oaep", async () => {
        let result, count = 0;
        const alg = "RSA-OAEP";
        // const enc;
        const kid = "foorsa";
        const payload = "hello world";

        const token = await encrypttool([
            "-j", pubkeys,
            "-l", alg,
            "-k", kid,
            "-F",
            payload
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "flattened");
        expect(infodata).to.own.property("type", "JWE");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("cty", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        expect(infodata.header).to.own.property("enc", "A128CBC-HS256");
    });

    it("JWS header info compact", async () => {
        let result, count = 0;
        const alg = "HS256";
        // const enc;
        const kid = "foobar";

        const token = await signtool([
            "-j", prvkeys,
            "-l", alg,
            "-k", kid,
            // "-G",
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "compact");
        expect(infodata).to.own.property("type", "JWS");
        expect(infodata).to.own.property("header");

        expect(infodata.header).to.own.property("typ", "JWT");
        expect(infodata.header).to.own.property("alg", alg);
        expect(infodata.header).to.own.property("kid", kid);
        // expect(infodata.header).to.own.property("enc", "A256GCM");

    });

    it("JWS header info flattened", async () => {
        let result, count = 0;
        const alg = "HS256";
        // const enc;
        const kid = "foobar";

        const token = await signtool([
            "-j", prvkeys,
            "-l", alg,
            "-k", kid,
            "-F",
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "flattened");
        expect(infodata).to.own.property("type", "JWS");
        expect(infodata).to.own.property("header");

        expect(infodata.header.protected).to.own.property("typ", "JWT");
        expect(infodata.header.protected).to.own.property("alg", alg);
        expect(infodata.header.protected).to.own.property("kid", kid);

        expect(infodata.payload).to.own.property("iat");
    });

    it("JWS header info general", async () => {
        let result, count = 0;
        const alg = "HS256";
        // const enc;
        const kid = "foobar";

        const token = await signtool([
            "-j", prvkeys,
            "-l", alg,
            "-k", kid,
            "-G",
        ]);

        try {
            result = await infotool([token]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);

        const infodata = JSON.parse(result);

        expect(infodata).to.own.property("format", "general");
        expect(infodata).to.own.property("type", "JWS");
        expect(infodata).to.own.property("header");

        expect(infodata.header.protected).to.own.property("typ", "JWT");
        expect(infodata.header.protected).to.own.property("alg", alg);
        expect(infodata.header.protected).to.own.property("kid", kid);

        expect(infodata.payload).to.own.property("iat");
    });

    it("unrecognisable compact format", async () => {
        let count = 0;

        try {
            await infotool(["foobar"]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("Invalid JWT, unrecognizable compact");
        }
        expect(count).to.be.equal(1);
    });

    it("unrecognisable JSON format", async () => {
        let count = 0;

        try {
            await infotool(["{\"foo\":\"bar\"}"]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("Invalid JWT, unrecognizable JSON");
        }
        expect(count).to.be.equal(1);
    });
});
