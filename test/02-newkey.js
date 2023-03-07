/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

import {execute} from "../lib/helper/sanitize.js";

describe( "newkey tests", function() {
    this.timeout(15000);

    it("no parameters", async () => {
        let counter = 0;
        try {
            await execute("newkey", []);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("missing type");
        }

        expect(counter).to.be.equal(1);
    });

    it("just type parameter, invalid type", async () => {
        let counter = 0;

        try {
             await execute("newkey", ["--type", "foo"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("unknown key type FOO");
        }

        expect(counter).to.be.equal(1);
    });

    it("just type parameter, valid type without size", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "rsa"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("kty");
        expect(jsonKey.kty).to.be.equal("RSA");

        expect(jsonKey).to.haveOwnProperty("kid");

        expect(jsonKey).to.haveOwnProperty("e");
        expect(jsonKey.e).to.be.equal("AQAB");
        expect(jsonKey).to.haveOwnProperty("n");
        expect(jsonKey).to.haveOwnProperty("p");
        expect(jsonKey).to.haveOwnProperty("q");
        expect(jsonKey).to.haveOwnProperty("dp");
        expect(jsonKey).to.haveOwnProperty("dq");
        expect(jsonKey).to.haveOwnProperty("qi");
    });

    it("new rsa 2048 key as keystore", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "rsa", "-K"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("keys");
        expect(jsonKey.keys).to.be.an("array");
        expect(jsonKey.keys.length).to.be.equal(1);
        expect(jsonKey.keys[0]).to.be.an("object");
        expect(jsonKey.keys[0].kty).to.be.equal("RSA");
    });

    it("new rsa 2048 key in existing keystore", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "rsa", "-K", "-j", "examples/example-priv.jwks"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("keys");
        expect(jsonKey.keys).to.be.an("array");
        expect(jsonKey.keys.length).to.be.equal(5);
    });

    it("new rsa (bad) 1024 key ", async () => {
        let counter = 0;

        try {
            result = await execute("newkey", ["--type", "rsa", "--size", "1024"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("insufficient key length");
        }

        expect(counter).to.be.equal(1);
    });

    it("new rsa 4096 key ", async function () {
        // this 1 minute timeout is needed because node version 8 on macOS is extremely slow.
        this.timeout(240000);

        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "rsa",  "--size", "4096"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("kty");
        expect(jsonKey.kty).to.be.equal("RSA");

        expect(jsonKey).to.haveOwnProperty("kid");

        expect(jsonKey).to.haveOwnProperty("e");
        expect(jsonKey.e).to.be.equal("AQAB");
        expect(jsonKey).to.haveOwnProperty("n");
        expect(jsonKey).to.haveOwnProperty("p");
        expect(jsonKey).to.haveOwnProperty("q");
        expect(jsonKey).to.haveOwnProperty("dp");
        expect(jsonKey).to.haveOwnProperty("dq");
        expect(jsonKey).to.haveOwnProperty("qi");
    });

    it("new oct 256 key ", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "256"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("kty");
        expect(jsonKey.kty).to.be.equal("oct");
        expect(jsonKey).to.haveOwnProperty("k");
        expect(jsonKey).to.haveOwnProperty("kid");
    });

    it("new ec 256 key ", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "ec", "--size", "256"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("kty");
        expect(jsonKey.kty).to.be.equal("EC");
        expect(jsonKey).to.haveOwnProperty("crv", "P-256");
        expect(jsonKey).to.haveOwnProperty("x");
        expect(jsonKey).to.haveOwnProperty("y");
        expect(jsonKey).to.haveOwnProperty("d");
        expect(jsonKey).to.haveOwnProperty("kid");
    });

    it("new ec 256 key via short cut", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["-e", "--size", "256"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("kty");
        expect(jsonKey.kty).to.be.equal("EC");
        expect(jsonKey).to.haveOwnProperty("crv", "P-256");
        expect(jsonKey).to.haveOwnProperty("x");
        expect(jsonKey).to.haveOwnProperty("y");
        expect(jsonKey).to.haveOwnProperty("d");
        expect(jsonKey).to.haveOwnProperty("kid");
    });

    it("new oct invalidly small key ", async () => {
        let counter = 0;

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "128"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("insufficient key length");
        }

        expect(counter).to.be.equal(1);
    });

    it("new okp key ", async () => {
        let counter = 0;

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "448"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("result is not defined");
        }

        expect(counter).to.be.equal(1);
        // expect(counter).to.be.equal(0);
        // expect(result.length).not.equal(0);

        // jsonKey = JSON.parse(result);
        // expect(jsonKey).to.be.an("object");
        // expect(jsonKey).to.haveOwnProperty("kty");
        // expect(jsonKey.kty).to.be.equal("OKP");
        // console.log(result);
    });

    it("new key with beautify on", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "256", "-b"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        let lines = result.split(/\r\n|\r|\n/).length;

        expect(lines).to.be.equal(6);
    });

    it("new key for signing", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "256", "--use", "sign"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("use");
        expect(jsonKey.use).to.be.equal("sig");
    });


    it("new key for encrypting", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "256", "--use", "enc"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("use");
        expect(jsonKey.use).to.be.equal("enc");
    });

    it("new key for bad usage", async () => {
        let counter = 0;

        try {
            result = await execute("newkey", ["--type", "oct", "--size", "256", "--use", "baz"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
            expect(err.message).to.be.equal("unknown use baz");
        }

        expect(counter).to.be.equal(1);
    });

    it("new key for encrypting with crafted kid", async () => {
        let counter = 0;

        let result = "";

        try {
            result = await execute("newkey", [
                "--type", "oct", 
                "--size", "256", 
                "--use", "enc",
                "--kid", "octopus"
            ]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.haveOwnProperty("use");
        expect(jsonKey.use).to.be.equal("enc");
        expect(jsonKey.kid).to.be.equal("octopus");
    });
} );
