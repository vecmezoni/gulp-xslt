'use strict';

var xsltProcessor = require('xslt-processor');
var xsltProcess = xsltProcessor.xsltProcess;
var xmlParse = xsltProcessor.xmlParse;
var es = require('event-stream');
var PluginError = require('plugin-error');
var fs = require('fs');

module.exports = function(template, config) {
    if (!template) throw new Error('Template option missing');

    var parameters = config || {};
    var stylesheet;

    try {
        var contents = fs.readFileSync(template, {encoding: 'UTF-8'});
        stylesheet = xmlParse(contents);
    } catch (e) {
        throw new Error(e.message);
    }

    function modifyContents(file, cb) {

        function throwError(message) {
            return cb(new PluginError('gulp-xslt', message));
        }

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return throwError('Streaming not supported');
        }

        if (file.isBuffer()) {
            try {
                var document = xmlParse(file.contents.toString());
                var output = xsltProcess(document, stylesheet);
                //stylesheet.apply(document, parameters, {outputFormat: 'string', noWrapParams: true});
                file.contents = Buffer.from(output);
            } catch (e) {
                return throwError(e.message);
            }

        }
        return cb(null, file);

    }

    return es.map(modifyContents);
};
