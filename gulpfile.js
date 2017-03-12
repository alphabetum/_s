///////////////////////////////////////////////////////////////////////////////
// gulpfile.js
//
// Asset build tasks with Gulp.js
//
// http://gulpjs.com/
// https://github.com/gulpjs/gulp
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// Setup
///////////////////////////////////////////////////////////////////////////////

require('es6-promise').polyfill();

var gulp                  = require('gulp'),
    addsrc                = require('gulp-add-src'),
    autoprefixer          = require('autoprefixer'),
    concat                = require('gulp-concat'),
    gutil                 = require('gulp-util'),
    jshint                = require('gulp-jshint'),
    plumber               = require('gulp-plumber'),
    postcss               = require('gulp-postcss'),
    rename                = require('gulp-rename'),
    rtlcss                = require('gulp-rtlcss'),
    sass                  = require('gulp-sass'),
    sourcemaps            = require('gulp-sourcemaps'),
    uglify                = require('gulp-uglify');

var onError = function( err ) {
  console.log('An error occurred:', gutil.colors.magenta(err.message));
  gutil.beep();
  this.emit('end');
};


var postcssConfig = [
  autoprefixer({
    browsers: ['last 2 versions', 'ie >= 9']
  })
];

///////////////////////////////////////////////////////////////////////////////
// Source Files
///////////////////////////////////////////////////////////////////////////////

var stylesheetPaths = [
  './src/sass/style.scss'
];

var sassPaths = [
  './node_modules/normalize.scss/sass',
  './node_modules/foundation-sites/scss',
  './node_modules/motion-ui/src'
];

var stylesheetVendorPaths = [
  './node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
  './node_modules/owl.carousel/dist/assets/owl.theme.default.min.css'
];

var javascriptPaths = [
  './src/js/*.js'
];

var javascriptVendorPaths = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/owl.carousel/dist/owl.carousel.min.js',
  './node_modules/what-input/dist/what-input.js',
  './node_modules/foundation-sites/dist/js/foundation.js'
];

///////////////////////////////////////////////////////////////////////////////
// Buld Tasks
///////////////////////////////////////////////////////////////////////////////

// sass ///////////////////////////////////////////////////////////////////////
//
// Compile sass / scss files.
gulp.task('sass', function() {
  return gulp.src(stylesheetPaths)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({
      includePaths: sassPaths,
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(postcssConfig))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./assets/css/'))
    .pipe(rtlcss())                     // Convert to RTL
    .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
    .pipe(gulp.dest('./'));             // Output RTL stylesheets (rtl.css)
});

// sass-dev ///////////////////////////////////////////////////////////////////
//
// Compile sass / scss files and include sourcemaps.
gulp.task('sass-dev', function () {
  return gulp.src(stylesheetPaths)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: sassPaths,
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(postcss(postcssConfig))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css/'));
});

// js /////////////////////////////////////////////////////////////////////////
//
// Compile JavaScript files.
gulp.task('js', function() {
  return gulp.src(javascriptPaths)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(addsrc.prepend(javascriptVendorPaths))
    .pipe(concat('app.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js'));
});

// watch //////////////////////////////////////////////////////////////////////
//
// Recompile for development on file changes events.
gulp.task('watch', ['sass-dev', 'js'], function() {
  gulp.watch(stylesheetPaths[0], ['sass-dev']);
  gulp.watch(javascriptPaths[0], ['js']);
});

// default ////////////////////////////////////////////////////////////////////
//
// Compile asset files for production.
gulp.task('default', ['sass', 'js']);
