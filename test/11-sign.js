/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const { util } = require("node-jose");
const base64 = util.base64url;


const tool = require("../lib/sign");

describe( "sign tool tests", function() {

    it("signing without parameters", async () => {
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

    it("basic HS (OCT key) signing implicit alg", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it("unsigned token with alg none", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "none"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unsecured JWS are not supported by node-jose");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("basic HS (OCT key) signing explicit alg", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it("basic HS (OCT key) signing wrong key size", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "hs512"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("key size 256 is too short for the requested signature algorithm HS512");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("basic HS (OCT key) signing missing key", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobaz",
                "-l", "hs512"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("key not found for foobaz");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("basic RSA signing with JSON payload", async () => {
        const extrapayload = "{\"hello\": \"world\"}";

        let result, count = 0;

        try {
            result = await tool([
                "-p", extrapayload,
                "-j", "examples/example-priv.jwks",
                "-k", "foorsa",
                "-l", "rs256"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "RS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foorsa");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("hello", "world");
    });

    it("basic RSA signing with extra payload", async () => {
        const extrapayload = "hello world";

        let result, count = 0;

        try {
            result = await tool([
                "-p", extrapayload,
                "-j", "examples/example-priv.jwks",
                "-k", "foorsa",
                "-l", "rs256"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "RS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foorsa");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("extra");
        expect(payload.extra).to.be.a("string");
        expect(payload.extra).to.be.equal(extrapayload);

    });

    it("basic RSA signing bad kid", async () => {
        const payload = "{\"hello\": \"world\"}";

        let result, count = 0;

        try {
            result = await tool([
                "-p", payload,
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "rs256"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("invalid key type for algorithm");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("basic RSA signing missing key for kid", async () => {
        const payload = "{\"hello\": \"world\"}";

        let result, count = 0;

        try {
            result = await tool([
                "-p", payload,
                "-j", "examples/example-priv.jwks",
                "-k", "foobaz",
                "-l", "rs256"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("key not found for foobaz");
        }

        expect(count).to.equal(1);
        expect(result).to.be.undefined;
    });

    it("basic HMAC signing flattend format", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-F"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = JSON.parse(result);

        expect(parts).to.own.property("payload");
        expect(parts).to.own.property("protected");
        expect(parts).to.own.property("signature");
        expect(parts.payload.length).to.be.greaterThan(0);
        expect(parts.protected.length).to.be.greaterThan(0);
        expect(parts.signature.length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts.protected));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts.payload));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it("basic HMAC signing general format", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-G"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = JSON.parse(result);

        expect(parts).to.own.property("payload");
        expect(parts).to.own.property("signatures");
        expect(parts.signatures.length).to.equal(1);
        expect(parts.payload.length).to.be.greaterThan(0);
        expect(parts.signatures[0]).to.be.an("object");

        expect(parts.signatures[0]).to.own.property("signature");
        expect(parts.signatures[0]).to.own.property("protected");
        expect(parts.signatures[0].protected.length).to.be.greaterThan(0);
        expect(parts.signatures[0].signature.length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts.signatures[0].protected));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts.payload));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it.skip("sign with multiple keys in general format", async () => {});

    it.skip("basic ES (EC key) signing", async () => {});

    it("add issuer", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-i", "me"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("iss", "me");
        expect(payload).not.to.own.property("extra");
    });

    it("add token experiration", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-x", String(5 * 60)
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("exp");

        expect(payload.exp).to.equal(Number(payload.iat) + 5 * 60);
        expect(payload).not.to.own.property("extra");
    });

    it("add audience", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-a", "you"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("aud", "you");
        expect(payload).not.to.own.property("extra");

    });

    it("add subject", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "-s", "it"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");

        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).to.own.property("sub", "it");
        expect(payload).not.to.own.property("extra");
    });

    it("basic RSA signing with one extended header", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "--header", "hello=world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");
        expect(header).to.own.property("hello", "world");


        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it("basic RSA signing with extended headers", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-j", "examples/example-priv.jwks",
                "-k", "foobar",
                "-l", "HS256",
                "--header", "hello=world",
                "--header", "foo=bar",
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        // console.log(result);
        expect(count).to.equal(0);
        expect(result).to.be.a("string");

        const parts = result.split(".");

        expect(parts.length).to.equal(3);
        expect(parts[0].length).to.be.greaterThan(0);
        expect(parts[1].length).to.be.greaterThan(0);
        expect(parts[2].length).to.be.greaterThan(0);

        // unprocess part[0]
        const header = JSON.parse(base64.decode(parts[0]));

        expect(header).to.be.an("object");
        expect(header).to.own.property("alg", "HS256");
        expect(header).to.own.property("typ", "JWT");
        expect(header).to.own.property("kid", "foobar");
        expect(header).to.own.property("hello", "world");
        expect(header).to.own.property("foo", "bar");


        // unprocess part[1]
        const payload = JSON.parse(base64.decode(parts[1]));

        expect(payload).to.be.an("object");
        expect(payload).to.own.property("iat");
        expect(payload).not.to.own.property("extra");
    });

    it.skip("basic RSA signing with extended headers one header with two values", async () => {});
    it.skip("basic RSA signing with one crit header", async () => {});
    it.skip("basic RSA signing with multiple crit headers", async () => {});

});
