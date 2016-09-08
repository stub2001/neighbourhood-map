var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename      = require('gulp-rename');
var cp          = require('child_process');
var jshint      = require('gulp-jshint');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var notify      = require('gulp-notify');
var cssmin      = require('gulp-cssmin');
var plumber     = require('gulp-plumber');


gulp.task('serveIt', ['sass', 'scripts'], function() {

    browserSync.init({
                server: {
            baseDir: './'
        },
        open: false
    });

    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});
/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('src/scss/main.scss', { style: 'expanded' })
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
            browsers: ['> 5%', 'last 2 versions', 'Firefox ESR', 'Safari >= 6', 'Opera 12.1'],
            cascade: false
        }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['serveIt']);