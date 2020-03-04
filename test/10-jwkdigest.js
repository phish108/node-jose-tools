/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;
const mockStdin = require("mock-stdin");

const tool = require("../lib/digest");

describe( "digest tool tests", function() {
    this.timeout(5000);

    it("digest JWT implicit sha256", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek");
    });

    it("digest JWT 256", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "256",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek");
    });

    it("digest JWT 384", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "384",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("_b2OdaZ_KfcBpOBAOF4uI5hjA-oQI5IRr5B_y7g1eLPkF8txzmRu_QgZ3YwIjeG9");
    });

    it("digest JWT 512", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "512",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("MJ7MSJwS1utMxA9QyQLytNDtd-5RGnx6m808qG1M2G-YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw");
    });

    it("digest JWT sha-256", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha-256",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek");
    });

    it("digest JWT sha-384", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha-384",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("_b2OdaZ_KfcBpOBAOF4uI5hjA-oQI5IRr5B_y7g1eLPkF8txzmRu_QgZ3YwIjeG9");
    });
    it("digest JWT sha-512", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha-512",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("MJ7MSJwS1utMxA9QyQLytNDtd-5RGnx6m808qG1M2G-YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw");
    });

    it("digest JWT sha256", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha256",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek");
    });

    it("digest JWT sha384", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha384",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("_b2OdaZ_KfcBpOBAOF4uI5hjA-oQI5IRr5B_y7g1eLPkF8txzmRu_QgZ3YwIjeG9");
    });

    it("digest JWT sha512", async () => {
        let result, count = 0;

        try {
            result = await tool([
                "-s", "sha512",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("MJ7MSJwS1utMxA9QyQLytNDtd-5RGnx6m808qG1M2G-YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw");
    });

    it("digest JWT invalid sha", async () => {
        let count = 0;

        try {
            await tool([
                "-s", "sha128",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown digest algorithm: SHA-128");
        }

        expect(count).to.equal(1);
    });

    it("digest JWT invalid size", async () => {
        let count = 0;

        try {
            await tool([
                "-s", "128",
                "hello world"
            ]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown digest algorithm: SHA-128");
        }

        expect(count).to.equal(1);
    });

    it("digest from stdin", async () => {
        const stdin = mockStdin.stdin();

        let result, count = 0;

        try {
            const prom = tool([
                "-s", "256"
            ]);

            await new Promise((resolve) => setTimeout(resolve, 10));

            stdin.send("hello world");
            stdin.end();

            result = await prom;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        // console.log(result);
        expect(result).to.be.a("string");
        expect(result).not.to.have.length(0);
        expect(result).to.equal("uU0nuZNNPgilLlLX2n2r-sSE7-N6U4DukIj3rOLvzek");
    });
});
