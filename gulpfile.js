var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  htmlbeautify = require('gulp-html-beautify'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  csscomb = require('gulp-csscomb');

gulp.task('default', function() {
  runSequence('sass', ['css', 'html']);
});

gulp.task('html', function () {
  gulp.src('src/*.html')
    .pipe(htmlbeautify({
      indent_size: 2
    }))
    .pipe(gulp.dest('src/'));
});

gulp.task('sass', function () {
  gulp.src('src/css/*.scss')
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('src/css/'));
});

gulp.task('css', function () {
  gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(csscomb())
    .pipe(gulp.dest('src/css/'));
});
