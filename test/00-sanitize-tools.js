/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

import sanitize from "../lib/helper/sanitize.js";

describe( "sanitize tool names", function() {
    const cwd = process.cwd();

    after(() => {
        process.chdir(cwd);
    });

    it("undefined toolname", async () => {
        let count = 0;

        try {
            await sanitize();
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
            await sanitize("");
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
            result =  await sanitize("addkey");
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
            result =  await sanitize("add.key");
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
            result =  await sanitize("no/op");
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
            await sanitize("missing");
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
            await sanitize("helper");
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
            await sanitize("helper/readfile");
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
            await sanitize("addkey.js");
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
            await sanitize("../../lib/addkey");
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unknown tool name");
        }

        expect(count).to.equal(1);
    });

    it("verify tool from a different path", async () => {
        let count = 0;

        process.chdir("docs");
        // console.log(process.cwd());

        try {
            await sanitize("addkey");
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
    })
});
