var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));

function gulpSass() {
    return gulp
    .src(['public/assets/sass/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('public/assets/css'));
}

function gulpWatch() {
    return gulp
    .watch('public/assets/sass/*.scss', gulpSass);
}

gulp.task('start', gulp.series(gulpSass, gulpWatch));
