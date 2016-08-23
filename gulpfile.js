var gulp = require('gulp');

var rollup = require('rollup-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

var del = require('del');

var webserver = require('gulp-webserver');


gulp.task('compile', function() {
  return rollup({
    entry: './source/main.js',
    sourceMap: true
  })
  .on('error', function(e) {
    console.error(e.stack);
  })
  .pipe(source('main.js', './source'))
  .pipe(buffer())
  .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel({ presets: ['es2015-minimal'] }))
  .pipe(sourcemaps.write({ sourceRoot: null }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('assets', function() {
  return gulp.src('./assets/**/*')
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch('./source/**/*', ['compile']);
  gulp.watch('./assets/**/*', ['assets']);
});

gulp.task('webserver', ['default'], function() {
  gulp.src('./dist')
  .pipe(webserver({
    fallback: 'main.html'
  }));
});

gulp.task('watchserver', ['watch', 'webserver']);

gulp.task('clean', function(cb) {
  del('./dist/**/*').then(function() { cb(); });
});

gulp.task('default', ['compile', 'assets']);

gulp.task('minified', ['clean', 'assets'], function() {
  return rollup({ entry: './source/main.js' })
  .on('error', function(e) {
    console.error(e.stack);
  })
  .pipe(source('main.js', './source'))
  .pipe(buffer())
  .pipe(babel({ presets: ['es2015-minimal'] }))
  .pipe(uglify())
  .pipe(gulp.dest('./dist'));
});
