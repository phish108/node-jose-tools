/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const tool = require("../lib/thumbprint");
// const findtool = require("../lib/findkey");

describe( "thumbprint tool tests", function() {
    const key = "{\"kty\":\"oct\",\"kid\":\"foobar\",\"k\":\"QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4\"}";
    const key0 = "{\"kty\":\"oct\",\"k\":\"QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4\"}";

    this.timeout(15000);

    it("thumbprint key sha256 implicit", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw";

        let result, count = 0;

        try {
            result = await tool([key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp256);
    });

    it("thumbprint key sha1", async () => {
        const tp1 = "GAPlOzS75jvoiJmV47gmR3qIiPo";

        let result, count = 0;

        try {
            result = await tool(["-s", "1", key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp1);
    });

    it("thumbprint key sha256 explicit", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw";

        let result, count = 0;

        try {
            result = await tool(["-s", "256", key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp256);
    });

    it("thumbprint key sha256 explicit with beautyfication", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw\n";

        let result, count = 0;

        try {
            result = await tool(["-s", "256", "-b", key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp256);
    });

    it("thumbprint key sha384", async () => {
        const tp384 = "I2H35GOpifGXW7WbmyusyD6u6875CNLX3EnCJSfhHqEgTslaQb-GrcwMlPWdFi9Q";

        let result, count = 0;

        try {
            result = await tool(["-s", "384", key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp384);
    });

    it("thumbprint key sha512", async () => {
        const tp512 = "uJfpNIMwynsQ6oHbHuPpcffJjsu-SDbTNoAO7-8Lkoljxa1vXEtvhTC6xf7zyQyGNGQcdLQlH9l24Kwd4ISJzw";

        let result, count = 0;

        try {
            result = await tool(["-s", "512", key]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp512);
    });

    it("thumbprint missing kid", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw";

        let result, count = 0;

        try {
            result = await tool(["-s", "256", key0]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp256);
    });

    it("thumbprint with bad hashing function", async () => {
        let count = 0;

        try {
            await tool(["-s", "1024", key0]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("invalid hashing size");
        }

        expect(count).to.equal(1);
    });

    it("thumbprint with unsupported key type", async () => {
        let count = 0;

        try {
            const result = await tool(["-s", "256", "{\"kty\":\"OKP\"}"]);

            console.log(result);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unsupported key type");
        }

        expect(count).to.equal(1);
    });

    it("thumbprint with invalid key type", async () => {
        let count = 0;

        try {
            const result = await tool(["-s", "256", "{\"kty\":\"nono\"}"]);

            console.log(result);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("unsupported key type");
        }

        expect(count).to.equal(1);
    });

    it("thumbprint with invalid key", async () => {
        let count = 0;

        try {
            const result = await tool(["-s", "256", "thisisnotakey"]);

            console.log(result);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("invalid key provided");
        }

        expect(count).to.equal(1);
    });


    it("thumbprint key and update kid", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw";

        let result, count = 0;

        try {
            result = await tool(["-s", "256", "-U", key0]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.be.a("string");
        expect(result.length).not.to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey.kid).to.equal(tp256);

    });

    it("thumbprint key sha256 from stdin", async () => {
        const tp256 = "gGKfJUyAshkpKJvVbUJM-kwW0QfS3KxlzOzSagUiAgw";
        const mockStdin = require("mock-stdin").stdin();

        let result, count = 0;

        try {
            const prom = tool(["-s", 256]);

            await new Promise((resolve) => setTimeout(resolve, 10));

            mockStdin.send(key);
            mockStdin.end();

            result = await prom;
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);
        expect(result).to.equal(tp256);
    });

    it.skip("thumbprint private key", async () => {});
    it.skip("thumbprint private key, that is actually public", async () => {});
    it.skip("thumbprint private key and update kid", async () => {});
});
