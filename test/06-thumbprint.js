/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

describe( "thumbprint tool tests", function() {
    it("thumbprint key sha1", async () => {});
    it("thumbprint key sha256", async () => {});
    it("thumbprint key sha384", async () => {});
    it("thumbprint key sha512", async () => {});

    it("thumbprint private key", async () => {});
    it("thumbprint missing kid", async () => {});
    it("thumbprint private key, which is actually public", async () => {});

    it("thumbprint with bad hashing function", async () => {});

    it("thumbprint key and update keystore", async () => {});
    it("thumbprint private key and update keystore", async () => {});
} );
