const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserify  = require('browserify');
// eslint-disable-next-line no-unused-vars
const babelify    = require('babelify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const uglify      = require('gulp-uglify');
const del = require('del');

const errorHandler = function (error) {
  console.log(error.toString());
  this.emit('end');
};

gulp.task('clean', del.bind(null, [
  'public/js/*', '!public/js/.gitkeep',
  'public/css/*', '!public/css/.gitkeep',
], { dot: true }));

gulp.task('js', () => {
  return browserify({ entries: 'assets/js/app.js', debug: true })
    .transform('babelify', {
      presets: ['@babel/preset-env'],
      sourceMaps: true
    })
    .bundle()
    .pipe(plumber({ errorHandler }))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
});

gulp.task('sass', () => {
  return gulp.src('assets/scss/app.scss')
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', gulp.series('clean', 'js', 'sass', () => {
  gulp.watch('assets/js/**/*.js', gulp.series('js'));
  gulp.watch('assets/scss/**/*.scss', gulp.series('sass'));
}));

gulp.task('default', gulp.series('clean', 'js', 'sass'));
