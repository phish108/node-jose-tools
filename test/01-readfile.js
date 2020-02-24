/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;
const mockStdin = require("mock-stdin").stdin();

const readfile = require("../lib/helper/readfile");

describe( "readfile helper tests", function() {

    this.afterEach(function() {
        mockStdin.reset();
    });

    it("read from stdin", async () => {
        let result, count = 0;

        try {
            const foo = readfile.readStdin();

            mockStdin.send("hello world");
            mockStdin.end();
            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal("hello world");
    });

    it("load file from disk", async () => {
        let result, count = 0;

        const emptyKeys = "test/files/empty.jwks";

        try {
            const foo = readfile.loadFile(emptyKeys);

            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal("{\"keys\":[]}");
    });

    it("load file from stdin", async () => {
        let result, count = 0;
        const data = "{\"keys\":[]}";

        try {
            const foo = readfile.loadFile("--");

            mockStdin.send(data);
            mockStdin.end();
            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(data);
    });

    it.skip("load file from url", async () => {

    });

    it.skip("load uri directly", async () => {

    });

    it("load missing file from disk", async () => {
        let count = 0;

        const missingFile = "test/files/missing.jwks";

        try {
            const foo = readfile.loadFile(missingFile);

            await foo;
        }
        catch (err) {
            count += 1;
            // console.log(err.message);
            expect(err.message).to.equal("ENOENT: no such file or directory, open 'test/files/missing.jwks'");
        }

        expect(count).to.equal(1);
    });

    it.skip("load missing file from URI", async () => {

    });

    it("load keystore from stdin", async () => {
        let result, count = 0;
        const data = "{\"keys\":[]}";

        try {
            const foo = readfile.loadKeyStore("--");

            mockStdin.send(data);
            mockStdin.end();
            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.be.an("object");
        expect(result.all()).to.have.length(0);
    });

    it("load keystore from disk", async () => {
        let result, count = 0;

        const emptyKeys = "test/files/empty.jwks";

        try {
            const foo = readfile.loadKeyStore(emptyKeys);

            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.be.an("object");
        expect(result.all()).to.have.length(0);
    });

    it.skip("load keystore from URI", async () => {

    });

    it("load missing keystore from disk", async () => {
        // should fail
        let result, count = 0;

        const missingFile = "test/files/empty2.jwks";

        try {
            const foo = readfile.loadKeyStore(missingFile);

            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.be.null;
        // expect(result).to.be.an("object");
        // expect(result.all()).to.have.length(0);
    });

    it("load missing keystore from disk with autocreate", async () => {
        let result, count = 0;

        const missingFile = "test/files/empty2.jwks";

        try {
            const foo = readfile.loadKeyStore(missingFile, true);

            result = await foo;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        // expect(result).to.be.null;
        expect(result).to.be.an("object");
        expect(result.all()).to.have.length(0);
    });
});
