var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  htmlbeautify = require('gulp-html-beautify'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  csscomb = require('gulp-csscomb'),
  include = require("gulp-include"),
  rename = require('gulp-rename');

gulp.task('default', function() {
  runSequence('sass', ['css', 'js']);
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
    .pipe(csscomb())
    .pipe(gulp.dest('src/css/'));
});

gulp.task('css', function () {
  gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('src/css/'));
});

gulp.task('js', function () {
  gulp.src('src/js/jeux/main.js')
    .pipe(include())
    .on('error', console.log)
    .pipe(rename('game.js'))
    .pipe(gulp.dest('src/js/jeux/'));
});

gulp.task('watch', function () {
  gulp.watch('src/css/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
});
