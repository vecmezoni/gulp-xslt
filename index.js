'use strict';

var xslt = require('node_xslt');
var es = require('event-stream');
var gutil = require('gulp-util');

module.exports = function(template, config) {
    if (!template) throw new Error('Template option missing');

    var parameters = [];

    if (config) {
        Object.keys(config).forEach(function(item) {
            parameters.push(item, config[item]);
        });
    }

    parameters = parameters || [];
    var stylesheet;

    try {
        stylesheet = xslt.readXsltFile(template);
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
                var document = xslt.readXmlString(file.contents);
                file.contents = new Buffer(xslt.transform(stylesheet, document, parameters));
            } catch (e) {
                return throwError(e.message);
            }

        }
        return cb(null, file);

    }

    return es.map(modifyContents);
};
