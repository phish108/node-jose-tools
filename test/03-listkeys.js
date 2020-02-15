/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const tool = require('../lib/listkeys.js');

describe( "listkeys tool tests", function() {
    it("list all keys", async () => {
        let result, count = 0

        try { 
            result = await tool(["-j", "examples/example-pub.jwks"]);
        }
        catch (err) {
            count++;
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.a("string");

        const keyids = JSON.parse(result);

        expect(keyids).to.be.an("array");
        expect(keyids).to.have.length(3);
    });

    it("list keys of an empty store", async () => {
        let result, count = 0

        try { 
            result = await tool(["-j", "test/files/empty.jwks"]);
        }
        catch (err) {
            count++;
        }

        expect(count).to.be.equal(0);
        expect(result).to.be.a("string");

        const keyids = JSON.parse(result);

        expect(keyids).to.be.an("array");
        expect(keyids).to.have.length(0);
    });

    it("list all keys of a nonexisting store", async () => {
        let result, count = 0

        try { 
            result = await tool(["-j", "test/files/non-existant.jwks"]);
        }
        catch (err) {
            count++;
        }

        expect(count).to.be.equal(1);
        // expect(result).to.be.a("string");

        // const keyids = JSON.parse(result);

        // expect(keyids).to.be.an("array");
        // expect(keyids).to.have.length(3);
    });

    it("list all keys of a JWT", async () => {
        let result, count = 0

        try { 
            result = await tool(["-j", "examples/simple.jwe"]);
        }
        catch (err) {
            count++;
        }

        expect(count).to.be.equal(1);
        // expect(result).to.be.a("string");

        // const keyids = JSON.parse(result);

        // expect(keyids).to.be.an("array");
        // expect(keyids).to.have.length(3);
    });
} );
