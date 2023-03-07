/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";
const expect = chai.expect;
import * as fs from "node:fs/promises";
import * as readfile from "../lib/helper/readfile.js";

import {execute} from "../lib/helper/sanitize.js";

describe( "rmkey tool tests", function() {
    it("remove keyid", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-j", "examples/example-pub.jwks", "foobar"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(3);
        expect(jsonKey.keys[0]).to.own.property("kid", "barfoo");
        expect(jsonKey.keys[1]).to.own.property("kid", "foorsa");
    });

    it("remove multiple keyids", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-j", "examples/example-pub.jwks", "foobar", "foorsa"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(2);
        expect(jsonKey.keys[0]).to.own.property("kid", "barfoo");
    });

    it("remove key with k flag", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-k", "foobar", "-j", "examples/example-pub.jwks"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(3);
        expect(jsonKey.keys[0]).to.own.property("kid", "barfoo");
        expect(jsonKey.keys[1]).to.own.property("kid", "foorsa");
    });

    it("remove multiple keys with extra kid flag", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-k", "foobar", "-j", "examples/example-pub.jwks",  "foorsa"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(2);
        expect(jsonKey.keys[0]).to.own.property("kid", "barfoo");
    });

    it("remove missing keyid via k flag", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-k", "barbaz", "-j", "examples/example-pub.jwks"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(4);
        expect(jsonKey.keys[0]).to.own.property("kid", "foobar");
        expect(jsonKey.keys[1]).to.own.property("kid", "barfoo");
        expect(jsonKey.keys[2]).to.own.property("kid", "foorsa");
    });

    it("remove missing keyid", async () => {
        let result, count = 0;

        try {
            result = await execute("rmkey", ["-j", "examples/example-pub.jwks", "barbaz"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKey = JSON.parse(result);

        expect(jsonKey).to.own.property("keys");
        expect(jsonKey.keys).to.have.length(4);
        expect(jsonKey.keys[0]).to.own.property("kid", "foobar");
        expect(jsonKey.keys[1]).to.own.property("kid", "barfoo");
        expect(jsonKey.keys[2]).to.own.property("kid", "foorsa");
    });

    describe("rmkey update tests", function() {
        // const filehelper = require("../lib/helper/readfile");

        let key1, key2;

        before(async () => {
            const k1 = await execute("newkey", ["-o", "-U", "-j", "test/files/tmp_rmkey.jwks"]);
            const k2 = await execute("newkey", ["-o", "-U", "-j", "test/files/tmp_rmkey.jwks"]);

            key1 = JSON.parse(k1);
            key2 = JSON.parse(k2);
        });

        after(async () => {
            await fs.unlink("test/files/tmp_rmkey.jwks");
        });

        it("update keystore", async () => {
            let result, count = 0;

            try {
                result = await execute("rmkey", ["-U", "-j", "test/files/tmp_rmkey.jwks", key1.kid]);
            }
            catch (err) {
                count += 1;
                console.log(err.message);
            }

            expect(count).to.equal(0);

            const jsonKey = JSON.parse(result);

            expect(jsonKey).to.own.property("keys");
            expect(jsonKey.keys).to.have.length(1);
            expect(jsonKey.keys[0]).to.own.property("kid", key2.kid);

            const jwksdata = await readfile.loadFile("test/files/tmp_rmkey.jwks");

            const jsonKS = JSON.parse(jwksdata);

            expect(jsonKS).to.be.an("object");
            expect(jsonKS).to.own.property("keys");

            expect(jsonKS.keys).to.have.length(1);
            expect(jsonKS.keys[0]).to.own.property("kid", key2.kid);
            expect(jsonKS.keys[0]).to.own.property("kty", key2.kty);
        });
    });
});
