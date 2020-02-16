/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const tool = require("../lib/verify");
const signtool = require("../lib/sign");

describe( "verify tool tests", function() {
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

    it.skip("verify with key", async () => {

    });

    it.skip("verify with kid", async () => {
        
    });

    it.skip("verify without key", async () => {

    });

    it.skip("verify aud header", async () => {

    });

    it.skip("verify iss header", async () => {

    });

    it.skip("verify sub header", async () => {

    });

    it.skip("verify iat times header", async () => {

    });

    it.skip("verify exp times header", async () => {

    });

    it.skip("verify aud payload", async () => {

    });

    it.skip("verify iss payload", async () => {

    });

    it.skip("verify sub payload", async () => {

    });

    it.skip("verify iat times payload", async () => {

    });

    it.skip("verify exp times payload", async () => {

    });

    it.skip("determine alg", async () => {

    });
} );
