/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const tool = require("../lib/helper/sanitize");

describe( "sanitize tool names", function() {
    it("undefined toolname", async () => {
        let count = 0;

        try {
            await tool();
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("missing toolname");
        }
        expect(count).to.equal(1);
    });

    it("empty toolname", async () => {
        let count = 0;

        try {
            await tool("");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("missing toolname");
        }
        expect(count).to.equal(1);
    });

    it("valid tool name", async () => {
        let result, count = 0;

        try {
            result =  await tool("addkey");
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal("addkey");
    });

    it("dotted tool name", async () => {
        let result, count = 0;

        try {
            result =  await tool("add.key");
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal("addkey");
    });

    it("pathlike tool name", async () => {
        let result, count = 0;

        try {
            result =  await tool("no/op");
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal("no-op");
    });

    it("invalid non existing tool name", async () => {
        let count = 0;

        try {
            await tool("missing");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });

    it("invalid tool name for existing path", async () => {
        let count = 0;

        try {
            await tool("helper");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });

    it("invalid pathlike tool name", async () => {
        let count = 0;

        try {
            await tool("helper/readfile");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });

    it("invalid dotted tool name", async () => {
        let count = 0;

        try {
            await tool("addkey.js");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });

    it("invalid parent pathlike tool name", async () => {
        let count = 0;

        try {
            await tool("../../lib/addkey");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });
});