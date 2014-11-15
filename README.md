gulp-xslt [![Build Status](https://travis-ci.org/vecmezoni/gulp-xslt.svg?branch=master)](https://travis-ci.org/vecmezoni/gulp-xslt)
=========
XSLT transformation plugin for gulp

## Usage

```js
var xslt = require('gulp-xslt');

gulp.task('xsl', function() {
    gulp.src('*.xml')
        .pipe(xslt('template.xsl', {
            someVariable: '"value"',
            orAnotherVariable: '/with/xpath[@value]'
        }))
        .pipe(gulp.dest('./build/'));
});
```

