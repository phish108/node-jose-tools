/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

describe( "thumbprint tool tests", function() {
    it.skip("thumbprint key sha1", async () => {});
    it.skip("thumbprint key sha256", async () => {});
    it.skip("thumbprint key sha384", async () => {});
    it.skip("thumbprint key sha512", async () => {});

    it.skip("thumbprint private key", async () => {});
    it.skip("thumbprint missing kid", async () => {});
    it.skip("thumbprint private key, which is actually public", async () => {});

    it.skip("thumbprint with bad hashing function", async () => {});

    it.skip("thumbprint key and update keystore", async () => {});
    it.skip("thumbprint private key and update keystore", async () => {});
} );
