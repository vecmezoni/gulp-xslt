'use strict';

var libxslt = require('libxslt');
var es = require('event-stream');
var gutil = require('gulp-util');
var fs = require('fs');

module.exports = function(template, config) {
    if (!template) throw new Error('Template option missing');

    var parameters = config || {};
    var stylesheet;

    try {
        var contents = fs.readFileSync(template);
        // XXX: using #parse() directly fails with a coredump ...
        var stylesheetRaw = libxslt.libxmljs.parseXml(contents);
        stylesheet = libxslt.parse(stylesheetRaw);
    } catch (e) {
        throw new Error(e.message);
    }

    function modifyContents(file, cb) {

        function throwError(message) {
            return cb(new gutil.PluginError('gulp-xslt', message));
        }

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return throwError('Streaming not supported');
        }

        if (file.isBuffer()) {
            try {
                var document = libxslt.libxmljs.parseXml(file.contents);
                var output = stylesheet.apply(document, parameters, {outputFormat: 'string', noWrapParams: true});
                file.contents = new Buffer(output);
            } catch (e) {
                return throwError(e.message);
            }

        }
        return cb(null, file);

    }

    return es.map(modifyContents);
};
