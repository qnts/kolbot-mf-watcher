const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

gulp.task('js', () => {
  return gulp.src('assets/js/app.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.toString());
        this.emit('end');
      },
    }))
    .pipe(babel({
      presets: ['@babel/preset-env'],
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', gulp.series('js', () => {
  return gulp.watch('assets/js/**/*.js', gulp.series('js'));
}));

gulp.task('default', gulp.series('js'));
