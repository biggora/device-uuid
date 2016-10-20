/**
 * Created by aleksejs.gordejevs on 10/20/2016.
 */
var gulp = require('gulp');
var pathToLib = './lib/';
var size = require('gulp-filesize');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var rimraf = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var gulpFilter = require('gulp-filter');


gulp.task('uglify-js', ['clean-js'], function () {
    var filter = gulpFilter(['*/*.js', '!*.min.js']);
    return gulp.src(pathToLib + '*')
        .pipe(filter)
        // .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({
            mangle:false,
            preserveComments: 'license'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(size())
        // .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(pathToLib));
});

gulp.task('clean-js', function () {
    var filter = gulpFilter(['**/*.min.js','**/*.js.map']);
    return gulp.src(pathToLib + '**', {read: false})
        .pipe(filter)
        .pipe(rimraf({force: true}));
});

gulp.task('jshint', function () {
    var filter = gulpFilter(['/*.js', '!*.min.js']);
    return gulp.src(pathToLib)
        .pipe(filter)
        .pipe(jshint())
        .pipe(size())
        .pipe(jshint.reporter('default'));
});

gulp.task('default', ['jshint', 'uglify-js']);