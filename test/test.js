var xslt = require('../');
var should = require('should');
var path = require('path');
var assert = require('stream-assert');
var gulp = require('gulp');
var fs = require('fs');
// var xsd = require('libxml-xsd');
var validator = require('xsd-schema-validator');
require('mocha');

var fixtures = function(glob) {
    return path.join(__dirname, 'fixtures', glob);
};

const validateXMLPromise = (xmlStr, schemaPath) => {
    return new Promise((resolve, reject) => {
        try {
          validator.validateXML(xmlStr, schemaPath,(err, result) => {
              if (err == null) {
                  resolve(result);
              } else {
                  reject(err);
              }
          });
        } catch(e) {
          reject(e);
        }
    });
};

const assertXML = (fixture) => {
    var schemaPath = fixtures(fixture);
    return async function(file) {
        var xmlStr = file.contents.toString();

        var validationErrors;
        var validationResult;

        try {
            const result = await validateXMLPromise(xmlStr, schemaPath);
        } catch(e) {
            console.log(e);
        }
        should(result.valid).equal(true);

    }
};

describe('gulp-xslt', function() {

    it('should throw, when arguments is missing', function() {
        (function () {
            xslt();
        }).should.throw('Template option missing');
    });

    it('should emit error on streamed file', function(done) {
        gulp.src(fixtures('1/data.xml'), { buffer: false })
            .pipe(xslt(fixtures('/1/template.xsl')))
            .on('error', function (err) {
                err.message.should.eql('Streaming not supported');
                done();
            });
    });

    it('should process one file', function(done) {
        gulp.src(fixtures('/1/data.xml'))
            .pipe(xslt(fixtures('/1/template.xsl')))
            .pipe(assert.length(1))
            .pipe(assert.first(assertXML('/1/schema.1.xsd')))
            .pipe(assert.end(done));
    });

    it('should process several files', function(done) {
        gulp.src(fixtures('/2/*.xml'))
            .pipe(xslt(fixtures('/2/template.xsl')))
            .pipe(assert.length(2))
            .pipe(assert.first(assertXML('/2/schema.1.xsd')))
            .pipe(assert.second(assertXML('/2/schema.2.xsd')))
            .pipe(assert.end(done));
    });

    it('should not fail if no files were input', function(done) {
        var stream = xslt(fixtures('/1/template.xsl'));
        stream.end();
        done();
    });

    it('should set text values to variables', function(done) {
        gulp.src(fixtures('/1/*.xml'))
            .pipe(xslt(fixtures('/1/template.xsl'), {elementName: '"norf"'}))
            .pipe(assert.length(1))
            .pipe(assert.first(assertXML('/1/schema.2.xsd')))
            .pipe(assert.end(done));
    });

    it('should set xpath values to variables', function(done) {
        gulp.src(fixtures('/1/*.xml'))
            .pipe(xslt(fixtures('/1/template.xsl'), {elementName: '/foo/bar'}))
            .pipe(assert.length(1))
            .pipe(assert.first(assertXML('/1/schema.3.xsd')))
            .pipe(assert.end(done));
    });

    it('should throw on nonexistent XSL', function() {
        (function () {
            xslt(fixtures('/4/template.xsl'));
        }).should.throw(/no such file or directory/);
    });

});
