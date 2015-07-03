var gulp = require('gulp')
var clean = require('gulp-clean')
var jade = require('gulp-jade')
var shell = require('shelljs')

gulp.task('gh-pages:clean', function() {
	return gulp.src('gh-pages/**/*', { read: false })
		.pipe(clean())
})

gulp.task('gh-pages:build', ['gh-pages:clean'], function(done) {
	var count = 3

	// Copy jquery dist folder.
	gulp.src('bower_components/jquery/dist/**/*', { base: 'bower_components/' })
		.pipe(gulp.dest('gh-pages/'))
		.on('end', function() {
			if (--count == 0) done()
		})

	gulp.src('client/**/*')
		.pipe(gulp.dest('gh-pages/'))
		.on('end', function() {
			if (--count == 0) done()
		})

	gulp.src('client/**/*.jade')
		.pipe(jade())
		.pipe(gulp.dest('gh-pages/'))
		.on('end', function() {
			if (--count == 0) done()
		})
})

gulp.task('gh-pages', ['gh-pages:build'], function() {
	shell.exec('git subtree push --prefix gh-pages/ origin gh-pages')
})
