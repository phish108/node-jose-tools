/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

const encrypttool = require("../lib/encrypt");
const tool = require("../lib/decrypt");

describe( "decrypt tool tests", function() {
    const pubkeys = "examples/example-pub.jwks";
    const prvkeys = "examples/example-priv.jwks";

    it.skip("decrypt without parameters", async () => {});

    it.skip("decrypt with key", async () => {});

    it.skip("decrypt without key", async () => {});

    it.skip("decrypt with bad kid", async () => {});

    it.skip("decrypt with kid to public key", async () => {});

    it.skip("enforce crit headers", async () => {});
} );
