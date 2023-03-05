/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;

const tool = require("../lib/findkey.js");

describe( "findkey tool tests", function() {
    // This datastore has three keys: foobar (oct), barfoo (oct), foorsa (RSA)

    const datastore = "examples/example-priv.jwks";

    it("retrieve the first key from JWKS (without providing its kid)", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "foobar");
        expect(jsonKey).to.own.property("k", "QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4");
    });

    it("retrieve the first key from JWKS with its kid", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "foobar"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "foobar");
        expect(jsonKey).to.own.property("k", "QYPTbIwxRbVuCLU0T3lQWYGP05asffZLAuM1KiNyqj4");
    });

    it("retrieve the second key from JWKS with its kid", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("retrieve the second key from JWKS with its kid via k-flag", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "-k", "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("retrieve the second key from JWKS with its kid via kid-flag", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "--kid", "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("retrieve the second key from JWKS with its kid with multiple kids", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "barfoo", "foobar"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("retrieve the second key from JWKS with its kid with extra -k flag", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "-k", "foobar", "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });


    it("retrieve the second key from JWKS with its kid with extra --kid flag", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "--kid", "foobar", "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");
        expect(jsonKey).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("invalid keyid", async () => {
        let count = 0;

        try {
            await tool(["-j", datastore, "barrsa"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("key not found");
        }

        expect(count).to.equal(1);
    });

    it("get key from invalid jwks", async () => {
        let count = 0;

        try {
            await tool(["-j", "examples/example-fake.jwks", "foorsa"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("keystore not found");
        }

        expect(count).to.equal(1);
    });

    it("retrieve the third key from JWKS with its kid", async () => {
        let result, count = 0;

        try {
            result = await tool(["-j", datastore, "foorsa"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "RSA");
        expect(jsonKey).to.own.property("kid", "foorsa");
        expect(jsonKey).to.own.property("e", "AQAB");
        expect(jsonKey).to.own.property("d");
        expect(jsonKey).to.own.property("n");
        expect(jsonKey).to.own.property("q");
        expect(jsonKey).to.own.property("p");
        expect(jsonKey).to.own.property("dq");
        expect(jsonKey).to.own.property("dp");
        expect(jsonKey).to.own.property("qi");
    });

    it("retrieve key as public key", async () => {
        let result, count = 0;

        try {
            result = await tool(["-p", "-j", datastore, "foorsa"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "RSA");
        expect(jsonKey).to.own.property("kid", "foorsa");
        expect(jsonKey).to.own.property("e", "AQAB");
        expect(jsonKey).not.to.own.property("d");
        expect(jsonKey).to.own.property("n");
        expect(jsonKey).not.to.own.property("q");
        expect(jsonKey).not.to.own.property("p");
        expect(jsonKey).not.to.own.property("dq");
        expect(jsonKey).not.to.own.property("dp");
        expect(jsonKey).not.to.own.property("qi");
    });

    it("retrieve key as public key from a public key", async () => {
        let result, count = 0;

        try {
            result = await tool(["-p", "-j", "examples/example-pub.jwks", "foorsa"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "RSA");
        expect(jsonKey).to.own.property("kid", "foorsa");
        expect(jsonKey).to.own.property("e", "AQAB");
        expect(jsonKey).not.to.own.property("d");
        expect(jsonKey).to.own.property("n");
        expect(jsonKey).not.to.own.property("q");
        expect(jsonKey).not.to.own.property("p");
        expect(jsonKey).not.to.own.property("dq");
        expect(jsonKey).not.to.own.property("dp");
        expect(jsonKey).not.to.own.property("qi");
    });

    it("retrieve key and beautify", async () => {
        let result, count = 0;

        try {
            result = await tool(["-b", "-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("kty", "oct");
        expect(jsonKey).to.own.property("kid", "barfoo");

        const lines = result.split(/\n\r|\n|\r/);

        expect(lines.length).to.equal(6);
        expect(lines[0]).to.equal("{");
    });

    it("get confirmation key in cnf format", async () => {
        let result, count = 0;

        try {
            result = await tool(["-c", "-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("cnf");
        expect(jsonKey.cnf).to.own.property("jwk");
        expect(jsonKey.cnf.jwk).to.own.property("kty", "oct");
        expect(jsonKey.cnf.jwk).to.own.property("kid", "barfoo");
        expect(jsonKey.cnf.jwk).to.own.property("k", "-E_-rcOr6iesQ_BKO21DAuKdblhUmwciIx8Q6gUcUuG42Fw0zdPHPQtfZh19upvrh1Epevwz3Yc2a3YMGCJh1w");
    });

    it("get confirmation key reference", async () => {
        let result, count = 0;

        try {
            result = await tool(["-r", "-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("cnf");
        expect(jsonKey.cnf).to.own.property("kid", "barfoo");
    });


    it("get confirmation key reference for multiple keys", async () => {
        let result, count = 0;

        try {
            result = await tool(["-r", "-j", datastore, "barfoo", "foobar"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.be.an("object");
        expect(jsonKey).to.own.property("cnf");
        expect(jsonKey.cnf).to.own.property("kid", "barfoo");
    });

    it("get confirmation key reference without private key", async () => {
        let count = 0;

        try {
            await tool(["-r", "-j", "examples/example-pub.jwks", "foorsa"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("not a private key");
        }

        expect(count).to.equal(1);
    });

    it("get confirmation key reference without private key", async () => {
        let count = 0;

        try {
            await tool(["-c", "-j", "examples/example-pub.jwks", "foorsa"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("not a private key");
        }

        expect(count).to.equal(1);
    });

    it("invalid confirmation key ckecking", async () => {
        let count = 0;

        try {
            await tool(["-c", "-j", "examples/example-pub.jwks", "barrsa"]);
        }
        catch (err) {
            count += 1;
            expect(err.message).to.equal("key not found");
        }

        expect(count).to.equal(1);
    });

    it("get confirmation key reference quiet", async () => {
        let result, count = 0;

        try {
            result = await tool(["-q", "-r", "-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        expect(result).to.equal("");
    });

    it("get confirmation key reference quiet without private key", async () => {
        let result, count = 0;

        try {
            result = await tool(["-q", "-r", "-j", datastore, "barfoo"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        expect(result).to.equal("");
    });
} );
