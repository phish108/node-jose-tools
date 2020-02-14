/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const tool = require("../lib/newkey.js");

describe( "newkey tool tests", function() {

    it("no parameters", async () => {
        let counter = 0;

        try {
            await tool([]);
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
            await tool(["--type", "foo"]);
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
            result = await tool(["--type", "rsa"]);
        }
        catch (err) {
            // this should complain about a missing type.
            counter = 1;
        }

        expect(counter).to.be.equal(0);
        expect(result.length).not.equal(0);
    });

    it("plain new rsa 2048 key", async () => {

    });

    it("new rsa 2048 key as keystore", async () => {});

    it("new rsa 2048 key in existing keystore", async () => {});

    it("new rsa (bad) 1024 key ", async () => {});
    
    it("new rsa 4096 key ", async () => {});

    it("new ec 256 key ", async () => {});

    it("new oct 256 key ", async () => {});

    it("new oct invalidly small key ", async () => {});

    it("new okp key ", async () => {});

    it("new dh key ", async () => {});
    
    it("new key with beautify on", async () => {});

    it("new key for signing", async () => {});

    it("new key for encrypting", async () => {});
} );
