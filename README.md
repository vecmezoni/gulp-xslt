# gulp-xslt [![Build Status](https://travis-ci.org/miguel76/gulp-xslt.svg?branch=master)](https://travis-ci.org/miguel76/gulp-xslt)

XSL transformation plugin for gulp

## Usage

**example.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<foo>
    <bar attr="value">baz</bar>
    <bar>qux</bar>
</foo>
```

**template.xsl**
```xsl
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


    <xsl:param name="someVariable">defaultValue</xsl:param>
    <xsl:param name="anotherVariable"/>


    <xsl:template match="foo">
        <output>
            <xsl:attribute name="attr">
                <xsl:value-of select="$someVariable"/>
            </xsl:attribute>
            <xsl:apply-templates select="$anotherVariable"/>
        </output>
    </xsl:template>


    <xsl:template match="bar">
        <xsl:copy-of select="."/>
    </xsl:template>


    <xsl:output method="xml" encoding="utf-8" indent="yes"/>


</xsl:stylesheet>
```

**task.js**
```js
var gulp = require('gulp');
var xslt = require('gulp-xslt');

gulp.task('xsl', function() {
    gulp.src('./example.xml')
        .pipe(xslt('./template.xsl', {
            someVariable: '"someValue"', // string
            anotherVariable: '/foo/bar[@attr]' // xpath that will be evaluated
        }))
        .pipe(gulp.dest('./build/'));
});
```

Will produce:
**./build/example.xml**
```xml
<?xml version="1.0" encoding="utf-8"?>
<output attr="someValue">
    <bar attr="value">baz</bar>
</output>
```
