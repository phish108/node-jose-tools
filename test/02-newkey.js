/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

const chai = require("chai");
const expect = chai.expect;

describe( "newkey tool tests", function() {

    it("plain new rsa 2048 key", async () => {});

    it("new rsa 2048 key as keystore", async () => {});

    it("new rsa 2048 key in existing keystore", async () => {});

    it("new rsa (bad) 1024 key ", async () => {});
    
    it("new rsa 4096 key ", async () => {});

    it("new ec 256 key ", async () => {});

    it("new oct 256 key ", async () => {});

    it("new oct invalidly small key ", async () => {});

    it("new okp key ", async () => {});

    it("new dh key ", async () => {});
    
    it("new key with beautify on", async () => {});

    it("new key for signing", async () => {});

    it("new key for encrypting", async () => {});
} );
