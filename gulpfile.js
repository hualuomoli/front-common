(function () {
  'use strict';

  var gulp = require('gulp');
  // clean
  var clean = require('gulp-clean');
  // concat
  var concat = require('gulp-concat');
  // rename
  var rename = require("gulp-rename");

  // js
  var jshint = require('gulp-jshint');
  var sourcemaps = require('gulp-sourcemaps');
  var ngAnnotate = require('gulp-ng-annotate');
  var uglify = require('gulp-uglify');

  // clean
  gulp.task('clean', function () {
    return gulp.src('./dist', {
        read: false
      })
      .pipe(clean());
  });


  // js - app
  gulp.task('js', function () {
    return gulp.src([
        './src/blocks/logger/logger.module.js',
        './src/blocks/logger/logger.factory.js',
        './src/blocks/exception/exception.module.js',
        './src/blocks/exception/exception.provider.js',
        './src/blocks/exception/exception.decorator.js',
        './src/blocks/routehelper/routehelper.module.js',
        './src/blocks/routehelper/routehelper.factory.js',

        './src/tools/uiLoad/uiLoad.module.js',
        './src/tools/uiLoad/uiLoad.factory.js',
        './src/tools/http/http.module.js',
        './src/tools/http/http.factory.js'

      ])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(concat('common.js'))
      .pipe(ngAnnotate())
      .pipe(gulp.dest('./dist'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./dist'));
  });


  // default
  gulp.task('default', ['clean'], function () {
    return gulp.start('js');
  });

})();