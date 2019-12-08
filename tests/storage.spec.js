"use strict";
const path = require("path");
//load up env variables
require("../services/env.service").load(path.join(__dirname, "../.env"));

const StorageService = require("../services/storage.service");

const assert = require("chai").assert;

var fs = require("fs");

describe("Storage service", function() {
    this.timeout(0);
    const file = {
        mimetype: "application/pdf",
        buffer: fs.readFileSync(__dirname + "/testResume.pdf")
    };
    it("Should upload new file", (done) => {
        const gcfilename = "resumes/testResume.pdf";
        StorageService.upload(file, gcfilename)
            .then((addr) => {
                assert.equal(addr, StorageService.getPublicUrl(gcfilename));
                done();
            })
            .catch(done);
    });
    it("should get test file", (done) => {
        StorageService.download("resumes/testResume.pdf")
            .then((buffer) => {
                assert.deepEqual(
                    buffer[0],
                    file.buffer,
                    "Two buffers are not equal"
                );
                done();
            })
            .catch(done);
    });
    it("should delete test file", (done) => {
        StorageService.delete("resumes/testResume.pdf")
            .then(() => {
                StorageService.exists("resumes/testResume.pdf")
                    .then((exists) => {
                        assert.isFalse(exists[0]);
                        done();
                    })
                    .catch(done);
            })
            .catch(done);
    });
});
