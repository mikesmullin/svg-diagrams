var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();

var size = require('gulp-size');
var uglifyjs = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var gzip = require('gulp-gzip');
var dest = require('gulp-dest');

gulp.task('default', ['markup', 'styles', 'behaviors']);
 
gulp.task('markup', function() {
  gulp.src('precompile/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('static/'))
});

gulp.task('styles', function () {
  gulp.src('precompile/styles/*.styl')
    .pipe(stylus())
    .pipe(dest('static/styles/'))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }))
    
    .pipe(browserSync.stream({match: '**/*.css'}))
    .pipe(uglifycss({ "max-line-len": 80 }))
    .pipe(dest('', {ext: '.min.css'}))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }))
    
    .pipe(gzip())
    .pipe(dest('', {ext: '.gz'}))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }));
});
 
gulp.task('behaviors', function () {
	gulp.src('precompile/behaviors/seqdia.ts')
		.pipe(ts({
			noImplicitAny: true,
			out: 'seqdia.js'
		}))
		.pipe(dest('static/behaviors/'))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }))
    
    .pipe(uglifyjs())
    .pipe(dest('', {ext: '.min.js'}))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }))
    
    .pipe(gzip())
    .pipe(dest('', {ext: '.gz'}))
    .pipe(gulp.dest('.'))
    .pipe(size({ showFiles: true }));
});
 
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "static/"
        }
    });
    
    gulp.watch("precompile/*.jade", ['markup']);
    gulp.watch("precompile/styles/*.styl", ['styles']);
    gulp.watch("precompile/behaviors/*.ts", ['behaviors']);
    gulp.watch("static/*.html").on('change', browserSync.reload);
    gulp.watch("static/behaviors/*.js").on('change', browserSync.reload);
});