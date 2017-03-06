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
    postcssflexbugsfixes  = require('postcss-flexbugs-fixes'),
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


// PostCSS Configuration. Source:
// https://github.com/twbs/bootstrap/blob/eb2e1102be0f4641ee3e5c4e7853360d5a04e3d8/grunt/postcss.js
var postcssConfig = [
  postcssflexbugsfixes(),
  autoprefixer({
    browsers: [
      //
      // Official browser support policy:
      // https://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
      //
      'Chrome >= 35', // Exact version number here is kinda arbitrary
      // Rather than using Autoprefixer's native "Firefox ESR" version specifier string,
      // we deliberately hardcode the number. This is to avoid unwittingly severely breaking the previous ESR in the event that:
      // (a) we happen to ship a new Bootstrap release soon after the release of a new ESR,
      //     such that folks haven't yet had a reasonable amount of time to upgrade; and
      // (b) the new ESR has unprefixed CSS properties/values whose absence would severely break webpages
      //     (e.g. `box-sizing`, as opposed to `background: linear-gradient(...)`).
      //     Since they've been unprefixed, Autoprefixer will stop prefixing them,
      //     thus causing them to not work in the previous ESR (where the prefixes were required).
      'Firefox >= 38', // Current Firefox Extended Support Release (ESR); https://www.mozilla.org/en-US/firefox/organizations/faq/
      // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
      // NOT the Edge app version shown in Edge's "About" screen.
      // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
      // See also https://github.com/Fyrd/caniuse/issues/1928
      'Edge >= 12',
      'Explorer >= 10',
      // Out of leniency, we prefix these 1 version further back than the official policy.
      'iOS >= 8',
      'Safari >= 8',
      // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
      'Android 2.3',
      'Android >= 4',
      'Opera >= 12'
    ]
  })
];

///////////////////////////////////////////////////////////////////////////////
// Source Files
///////////////////////////////////////////////////////////////////////////////

var stylesheetPaths = [
  './src/sass/**/*.scss',
  './node_modules/owl.carousel/dist/assets/owl.carousel.min.css',
  './node_modules/owl.carousel/dist/assets/owl.theme.default.min.css',
  './node_modules/tether/dist/css/tether.min.css'
];

var javascriptPaths = [
  './src/js/*.js',
];

var javascriptVendorPaths = [
  './node_modules/jquery/dist/jquery.min.js',
  './node_modules/owl.carousel/dist/owl.carousel.min.js',
  './node_modules/tether/dist/js/tether.min.js',
  './node_modules/bootstrap/dist/js/bootstrap.min.js'
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
    .pipe(sass({outputStyle: 'compressed'}))
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
  var sourcemaps = require('gulp-sourcemaps');

  return gulp.src(stylesheetPaths)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}))
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
    .pipe(addsrc(javascriptVendorPaths))
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
