var gulp = require('gulp');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var ts = require('gulp-typescript');
var browserSync = require('browser-sync').create();

gulp.task('default', ['markup', 'styles', 'behaviors']);
 
gulp.task('markup', function() {
  gulp.src('precompile/*.jade')
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('static/'))
});

gulp.task('styles', function () {
  gulp.src('precompile/styles/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('static/styles/'))
    .pipe(browserSync.stream({match: '**/*.css'}));    
});
 
gulp.task('behaviors', function () {
	gulp.src('precompile/behaviors/seqdia.ts')
		.pipe(ts({
			noImplicitAny: true,
			out: 'seqdia.js'
		}))
		.pipe(gulp.dest('static/behaviors/'));
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