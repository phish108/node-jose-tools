/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

import jose from "node-jose";

const { util } = jose;
const base64 = util.base64url;

const tool = require("../lib/encrypt.js");

describe( "encrypt tool tests", function() {
    const pubkeys = "examples/example-pub.jwks";

    it("encrypt without parameters", async () => {
        let count = 0;

        try {
            await tool([]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("no options provided");
        }

        expect(count).to.be.equal(1);
    });

    it("encrypt for aud with kid with alg and enc missing", async () => {
        let count = 0;

        try {
            await tool(["-k", "foorsa", "-j", pubkeys, "hello world"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("alg or enc algorithm are missing");
        }

        // console.log(result);
        expect(count).to.be.equal(1);
    });

    it("encrypt for aud with kid and alg=dir auto enc with 256-bit key", async () => {
        const alg = "dir";
        const key = "foobar";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        //console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", "A256GCM");

    });

    it("encrypt for aud with kid and alg=dir auto enc with 512-bit key", async () => {
        const alg = "dir";
        const key = "barfoo";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", "A256CBC-HS512");
    });

    it("encrypt for aud with kid and alg=dir explicit enc with 256-bit key", async () => {
        const alg = "dir";
        const enc = "A256GCM";
        const key = "foobar";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                // "-k", "foobar",
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=dir explicit enc with 256-bit key", async () => {
        const alg = "dir";
        const enc = "A128CBC-HS256";
        const key = "foobar";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=dir explicit enc with 512-bit key", async () => {
        const alg = "dir";
        const enc = "A256CBC-HS512";
        const key = "barfoo";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=dir explicit enc with 512-bit key", async () => {
        const alg = "dir";
        const enc = "A256GCM";
        const key = "barfoo";

        let count = 0;

        try {
            await tool([
                "-l", alg,
                "-e", enc,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("unsupported algorithm");
        }

        // console.log(result);
        expect(count).to.be.equal(1);
    });

    it("encrypt with enc", async () => {
        // fail without alg
        const alg = "A256KW"; // because we use a key enc, node-jose is choosing this for us
        const enc = "A256GCM";
        const key = "foobar";

        let result, count = 0;

        try {
            result = await tool([
                // "-l", alg,
                "-e", enc,
                "-k", key,
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("unsupported algorithm");
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).not.to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", key);
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=dir auto enc with rsa key", async () => {
        const alg = "dir";

        let count = 0;

        try {
            await tool([
                "-l", alg,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("unsupported algorithm");
        }

        // console.log(result);
        expect(count).to.be.equal(1);
    });

    it("encrypt for aud with kid and alg=RSA1_5 auto enc with rsa key", async () => {
        const alg = "RSA1_5";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", "A128CBC-HS256");
    });

    it("encrypt for aud with kid and alg=RSA-OAEP auto enc with rsa key", async () => {
        const alg = "RSA-OAEP";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", "A128CBC-HS256");
    });

    it("encrypt for aud with kid and alg=RSA-OAEP-256 auto enc with rsa key", async () => {
        const alg = "RSA-OAEP-256";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", "A128CBC-HS256");
    });


    it("encrypt for aud with kid and alg=RSA-OAEP-256 set enc with rsa key", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A128CBC-HS256";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=RSA-OAEP-256 set CBC enc with rsa key", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A256CBC-HS512";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=RSA-OAEP-256 set 256GCM enc with rsa key", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A256GCM";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt for aud with kid and alg=RSA-OAEP-256 set 128GCM enc with rsa key", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A128GCM";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.not.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt to general with dir (no encrypted key)", async () => {
        const alg = "dir";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-G",
                "-k", "barfoo",
                "-j", pubkeys,
                "hello world",
                // "-b"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(1);
        // expect(parts[1]).to.have.length(0);
        const token = JSON.parse(result);

        expect(token).to.own.property("protected");
        expect(token).to.own.property("iv");
        expect(token).to.own.property("ciphertext");
        expect(token).to.own.property("tag");

        // expect(token).to.own.property("recipients");
        // expect(token.recipients).to.be.an("array");

        const header = JSON.parse(base64.decode(token.protected));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "barfoo");
        expect(header).to.ownProperty("enc", "A256CBC-HS512");
    });

    it("encrypt to flattened", async () => {
        const alg = "dir";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                "-F",
                "-k", "barfoo",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(1);
        // expect(parts[1]).to.have.length(0);
        const token = JSON.parse(result);

        expect(token).to.own.property("protected");
        expect(token).to.own.property("iv");
        expect(token).to.own.property("ciphertext");
        expect(token).to.own.property("tag");

        expect(token).not.to.own.property("recipients");
        // expect(token.recipients).to.be.an("array");

        const header = JSON.parse(base64.decode(token.protected));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "barfoo");
        expect(header).to.ownProperty("enc", "A256CBC-HS512");
    });

    it("encrypt to general with rsa and enc", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A128GCM";

        let result, count = 0;

        try {
            result = await tool([
                "-G",
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world",
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(1);
        // expect(parts[1]).to.have.length(0);
        const token = JSON.parse(result);

        expect(token).to.own.property("protected");
        expect(token).to.own.property("iv");
        expect(token).to.own.property("ciphertext");
        expect(token).to.own.property("tag");

        expect(token).to.own.property("recipients");
        expect(token.recipients).to.be.an("array");
        expect(token.recipients[0]).to.own.property("encrypted_key");
        expect(token.recipients[0].encrypted_key).to.have.not.length(0);

        const header = JSON.parse(base64.decode(token.protected));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });


    it("encrypt to flattened with rsa and enc", async () => {
        const alg = "RSA-OAEP-256";
        const enc = "A128GCM";

        let result, count = 0;

        try {
            result = await tool([
                "-F",
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                "hello world",
                "-b"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(1);
        // expect(parts[1]).to.have.length(0);
        const token = JSON.parse(result);

        expect(token).to.own.property("protected");
        expect(token).to.own.property("iv");
        expect(token).to.own.property("ciphertext");
        expect(token).to.own.property("tag");
        expect(token).to.own.property("encrypted_key");

        expect(token).not.to.own.property("recipients");

        const header = JSON.parse(base64.decode(token.protected));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });

    it("encrypt without key (node-joe auto key selection)", async () => {
        const alg = "dir";

        let result, count = 0;

        try {
            result = await tool([
                "-l", alg,
                // "-k", "foobar",
                // "-k", "foorsa",
                "-j", pubkeys,
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
            // expect(err.message).to.equal("unsupported algorithm");
        }

        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(5);
        expect(parts[1]).to.have.length(0);

        const header = JSON.parse(base64.decode(parts[0]));

        //console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foobar");
        expect(header).to.ownProperty("enc", "A256GCM");
    });

    it("encrypt with empty payload", async () => {
        // when decrypting the cipher this should return an empty string
        const alg = "RSA-OAEP-256";
        const enc = "A128GCM";

        let result, count = 0;

        try {
            result = await tool([
                "-F",
                "-l", alg,
                "-e", enc,
                "-k", "foorsa",
                "-j", pubkeys,
                // "hello world",
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.be.equal(0);
        const parts = result.split(".");

        expect(parts).to.have.length(1);
        // expect(parts[1]).to.have.length(0);
        const token = JSON.parse(result);

        expect(token).to.own.property("protected");
        expect(token).to.own.property("iv");
        expect(token).to.own.property("ciphertext");
        expect(token).to.own.property("tag");
        expect(token).to.own.property("encrypted_key");

        expect(token).not.to.own.property("recipients");

        const header = JSON.parse(base64.decode(token.protected));

        // console.log(JSON.stringify(header));

        expect(header).to.be.an("object");
        expect(header).to.ownProperty("cty", "JWT");
        expect(header).to.ownProperty("alg", alg);
        expect(header).to.ownProperty("kid", "foorsa");
        expect(header).to.ownProperty("enc", enc);
    });
});
