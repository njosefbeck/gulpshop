// INCLUDE GULP
var gulp = require('gulp');

// INCLUDE GULP PLUGINS 

var browserSync = require('browser-sync');

// Compiles Sass to CSS
var sass = require('gulp-sass');

// Prefixes CSS values with vendor prefixes if needed
var autoprefixer = require('gulp-autoprefixer');

// Concatenates CSS or JS
var concat = require('gulp-concat');

// Minifies CSS
var cssnano = require('gulp-cssnano');

// Renames files within a gulp stream
var rename = require('gulp-rename');

// Allows for conditional login within Gulp streams
var gulpif = require('gulp-if');

// Parse build blocks in HTML to replace references to non-optimized scripts or 
// stylesheets with their optimized version
var useref = require('gulp-useref');

// Minifies JS
var uglify = require('gulp-uglify');

// Minifies PNG, JPEG, GIF and SVG images
var imagemin = require('gulp-imagemin');

// Allows running gulp tasks in sequence instead of all at once
var runSequence = require('run-sequence');

// Delete files
var del = require('del');

// CONFIGURATION
var jsFiles = [
    'node_modules/jquery/dist/jquery.js',
    'app/js/header.js',
    'app/js/main.js'
];

// GULP TASKS

// GENERAL TASKS
// ======================================

// Spin up a local server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

// Watches files and runs different tasks
gulp.task('watch', function() {
    gulp.watch('app/scss/**/*', ['concat-css']);
    gulp.watch('app/js/**/*', ['concat-js']);
    gulp.watch('app/*.html').on('change', browserSync.reload);
});

// Main dev build task, which spins up a server, compiles sass and concatenates
// additional CSS, watches for file changes, and reloads the browser when there are
gulp.task('default', function(callback) {
    runSequence(
        ['sass-to-css', 'concat-js'],
        'concat-css',
        'browser-sync',
        'watch',
        callback
    );
 });

// SASS/CSS TASKS
// ======================================

// Compile Sass to CSS
gulp.task('sass-to-css', function() {
    return gulp.src('app/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('app/css/'));
});

// Concatenate all CSS
gulp.task('concat-css', ['sass-to-css'], function() {
    return gulp.src('app/css/**')
        .pipe(concat('project.css'))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
});

// JS TASKS
// ======================================

// Concatenate all JS files
gulp.task('concat-js', function() {
    return gulp.src(jsFiles)
        .pipe(concat('project.js'))
        .pipe(gulp.dest('app'));
});

// IMAGE TASK
// ======================================

// Minify images and output the result to dist folder
gulp.task('imagemin', function() {
    return gulp.src('app/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'));
});

// PRODUCTION TASKS
// ======================================

// Main production task that combines other tasks into one
gulp.task('build', ['delete-dist'], function() {
    runSequence(
        'imagemin',
        'html'
    );
});

/* Delete concatenated JavaScript directory */
gulp.task('delete-dist', function() {
    return del.sync('dist');
});

// Transform non-optimized scripts or stylesheets into minified versions
// and output the new html into dist folder
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});
