/* eslint-env node, mocha */
/* eslint-disable require-jsdoc */

import chai from "chai";

const expect = chai.expect;

import * as fs from "node:fs/promises";
import {execute} from "../lib/helper/sanitize.js";

import * as filehelper from "../lib/helper/readfile.js";

describe( "core addkey tests", function() {
    const filestore = "test/files/";

    this.timeout(15000);

    it("load key from json", async () => {
        let result, count = 0;

        try {
            result = await execute("addkey", [
                "-j", filestore + "empty.jwks",
                filestore + "single_key.jwk"]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKS = JSON.parse(result);

        expect(jsonKS).to.be.an("object");
        expect(jsonKS).to.own.property("keys");
        expect(jsonKS.keys).to.have.length(1);
    });

    it.skip("load key from pem", async () => {

    });

    it.skip("load key from pkcs8", async () => {

    });

    it.skip("load key from x509", async () => {

    });

    it.skip("load key from pkix", async () => {

    });

    it.skip("load key from spki", async () => {

    });

    it("add multiple individual keys", async () => {
        let result, count = 0;

        try {
            result = await execute("addkey", [
                "-j", filestore + "empty.jwks",
                filestore + "single_key.jwk",
                filestore + "octet_key.jwk"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKS = JSON.parse(result);

        expect(jsonKS).to.be.an("object");
        expect(jsonKS).to.own.property("keys");
        expect(jsonKS.keys).to.have.length(2);

        if (jsonKS.keys[0].kid === "cgY12wKXDD2r-UFwS5eQDo2rUhI6TkIWIrr-DxNabWs") {
            // The order is based on timing, not on position in the arguments
            expect(jsonKS.keys[0].kty).to.equal("RSA");
            expect(jsonKS.keys[1].kty).to.equal("oct");
        }
        else {
            expect(jsonKS.keys[1].kty).to.equal("RSA");
            expect(jsonKS.keys[0].kty).to.equal("oct");
        }
    });

    it("add multiple keys by merging keystores", async () => {
        let result, count = 0;

        try {
            result = await execute("addkey", [
                "-j", filestore + "testing_rsa.jwks",
                filestore + "testing_octets.jwks"
            ]);
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKS = JSON.parse(result);

        expect(jsonKS).to.be.an("object");
        expect(jsonKS).to.own.property("keys");
        expect(jsonKS.keys).to.have.length(2);

        // check for the appropriate keys
        if (jsonKS.keys[0].kid === "DTT4fS7ctPeVih9KuqYtLTc7MDW3CohOHqSB3t7Imes") {
            expect(jsonKS.keys[0].kty).to.equal("RSA");
            expect(jsonKS.keys[1].kty).to.equal("oct");
            expect(jsonKS.keys[1].kid).to.equal("9cZErBEjsJWNN6z61pXrwo2OEABuDa-t5BXGRrtgkUU");
        }
        else {
            expect(jsonKS.keys[1].kty).to.equal("RSA");
            expect(jsonKS.keys[1].kid).to.equal("DTT4fS7ctPeVih9KuqYtLTc7MDW3CohOHqSB3t7Imes");
            expect(jsonKS.keys[0].kty).to.equal("oct");
            expect(jsonKS.keys[0].kid).to.equal("9cZErBEjsJWNN6z61pXrwo2OEABuDa-t5BXGRrtgkUU");
        }
    });

    it.skip("add multiple keys by merging keystores with overlapping keys", async () => {

    });

    it("add multiple keys by merging multiple keystores", async () => {
        let result, count = 0;

        try {
            result = await execute("addkey", [
                "-j", filestore + "testing_rsa.jwks",
                filestore + "testing_octets.jwks",
                filestore + "testing_rsa2.jwks"
            ]);            
        }
        catch (err) {
            count += 1;
            console.log(err.message);
        }

        expect(count).to.equal(0);

        const jsonKS = JSON.parse(result);

        expect(jsonKS).to.be.an("object");
        expect(jsonKS).to.own.property("keys");
        expect(jsonKS.keys).to.have.length(3);
        expect(jsonKS.keys[0].kty).to.equal("RSA");

        // this order is based on timing, not on argument position
        if (jsonKS.keys[1].kid === "9cZErBEjsJWNN6z61pXrwo2OEABuDa-t5BXGRrtgkUU") {
            expect(jsonKS.keys[2].kty).to.equal("RSA");
            expect(jsonKS.keys[2].kid).to.equal("vNieFjZ3b6Mt8khz-IvimaDtymlri3acmEnuIHZkOuU");
            expect(jsonKS.keys[1].kty).to.equal("oct");
        }
        else {
            expect(jsonKS.keys[1].kty).to.equal("RSA");
            expect(jsonKS.keys[1].kid).to.equal("vNieFjZ3b6Mt8khz-IvimaDtymlri3acmEnuIHZkOuU");
            expect(jsonKS.keys[2].kty).to.equal("oct");
            expect(jsonKS.keys[2].kid).to.equal("9cZErBEjsJWNN6z61pXrwo2OEABuDa-t5BXGRrtgkUU");
        }
    });

    it.skip("add multiple keys by merging multiple keystores with overlapping keys", async () => {

    });


    describe("addkey fs updates", async () => {
        const datastore = "tmp_store.jwks";

        before(async () => {
            await execute("newkey", ["-r", "-U", "-j", filestore + datastore]);
        });

        after(async () => {
            await fs.unlink(filestore + datastore);
            await fs.unlink(filestore + "tmp_newkey.jwks");
            // fs.unlinkSync(filestore + "tmp_newkey2.jwks");
        });

        it("update keystore with new key", async () => {
            let count = 0;

            try {
                await execute("addkey", [
                    "-U",
                    "-j", filestore + datastore,
                    filestore + "testing_octets.jwks",
                    // filestore + "testing_rsa.jwks"
                ]);                
            }
            catch (err) {
                count += 1;
                console.log(err.message);
            }

            expect(count).to.equal(0);

            // open the file store
            const jwksdata = await filehelper.loadFile(filestore + datastore);

            const jsonKS = JSON.parse(jwksdata);

            expect(jsonKS).to.be.an("object");
            expect(jsonKS).to.own.property("keys");

            expect(jsonKS.keys).to.have.length(2);
            expect(jsonKS.keys[0].kty).to.equal("RSA");
            expect(jsonKS.keys[1].kty).to.equal("oct");
        });

        it("create and store keystore with new key", async () => {
            let count = 0;

            try {
                await execute("addkey", [
                    "-U", 
                    "-C", 
                    "-j", filestore + "tmp_newkey.jwks",
                    filestore + "testing_octets.jwks"
                ]);
            }
            catch (err) {
                count += 1;
                console.log(err.message);
            }

            expect(count).to.equal(0);

            // open the file store
            const jwksdata = await filehelper.loadFile(filestore + "tmp_newkey.jwks");

            const jsonKS = JSON.parse(jwksdata);

            expect(jsonKS).to.be.an("object");
            expect(jsonKS).to.own.property("keys");

            expect(jsonKS.keys).to.have.length(1);
            expect(jsonKS.keys[0].kty).to.equal("oct");
        });

        it("store in non-existing keystore with new key", async () => {
            let count = 0;

            try {
                await execute("addkey", [
                    "-U", 
                    "-j", filestore + "tmp_newkey2.jwks",
                    filestore + "testing_octets.jwks"
                ]);
            }
            catch (err) {
                count += 1;
                // console.log(err.message);
            }

            expect(count).to.equal(1);

            // open the file store
            // const jwksdata = await filehelper.loadFile(filestore + "tmp_newkey2.jwks");

            // const jsonKS = JSON.parse(jwksdata);

            // expect(jsonKS).to.be.an("object");
            // expect(jsonKS).to.own.property("keys");

            // expect(jsonKS.keys).to.have.length(0);
        });
    });
});
