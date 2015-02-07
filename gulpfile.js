'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var browserify = require('browserify');
var source = require('vinyl-source-stream2');
var path = require('path');


var pkg = require('./package.json');
var banner = [
  '/*',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('script', function() {
  var bundleStream = browserify({
    entries: './lib/bspec.js',
    builtins: null,
    insertGlobals: false,
    detectGlobals: false,
    standalone: 'bspec',
    fullPaths: false
  })
    .bundle();

  return bundleStream
    .pipe(source('bspec.js'))
    .pipe($.header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./'))
    .pipe($.uglify())
    .pipe($.header(banner, {pkg: pkg}))
    .pipe($.rename('bspec.min.js'))
    .pipe(gulp.dest('./'));
});
