var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

// Set the banner content
var banner = ['/*!\n',
    ' * GymTec - <%= pkg.title %> v<%= pkg.version %>\n',
    ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' */\n',
    ''
].join('');


// Compile SCSS
gulp.task('css:compile', function() {
    return gulp.src('./src/sass/style.scss')
        .pipe(header(banner, {pkg: pkg} ))
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// CSS
gulp.task('css', ['css:compile', 'css:minify']);

// Minify JavaScript
gulp.task('js:minify', function() {
    return gulp.src('./src/scripts/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {pkg: pkg} ))
        .pipe(gulp.dest('./js'))
        .pipe(browserSync.stream());
});

gulp.task('js:clean', function () {
    return gulp.src('./src/scripts/*.js')
        .pipe(clean())
        .pipe(header(banner, {pkg: pkg} ))
    .pipe(gulp.dest('./js'))
});

// JS
gulp.task('js', ['js:clean', 'js:minify']);

// Default task
gulp.task('default', ['css', 'js']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Dev task
gulp.task('dev', ['css', 'js', 'browserSync'], function() {
    gulp.watch('./src/sass/*.scss', ['css']);
    gulp.watch('./src/scripts/*.js', ['js']);
    gulp.watch('./*.html', browserSync.reload);
});
