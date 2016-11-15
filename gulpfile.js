var gulp        = require('gulp');
var browserSync = require('browser-sync'); // rafraichissement du browser
var reload      = browserSync.reload;
var sass        = require('gulp-sass');
var uncss       = require('gulp-uncss');
var size        = require('gulp-size');
var sourcemaps  = require('gulp-sourcemaps');

var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var notify      = require('gulp-notify');

gulp.task('browser-sync', function() {
    browserSync({
        port: 3500,
        server: {
            baseDir: "./", //base directory:
            index: "index.html" // fichier a lancÃ© par default
        }
    });
});

// JS
gulp.task('js', function() {
  return gulp.src('app/js/*.js')
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('app.min.js'))
      .pipe(uglify()) //minify js
    .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/js'))
      .pipe(notify("JS Modifié"))
      .pipe(reload({stream:true}));
});

// SASS
gulp.task('sass', function() {
  return gulp.src('app/scss/*.scss')
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sass())
    //  .pipe(uncss({
    //      html: ['index.html']
    //  }))
      .pipe(size())
    .pipe(sourcemaps.write())
      .pipe(gulp.dest("./dist/css"))
      .pipe(notify("CSS Modifié"))
      .pipe(reload({stream:true}));
});

// DEFAULT
gulp.task('default', ['browser-sync', 'sass', 'js'], function() {
    gulp.watch(['app/js/*.js'], ['js']);
    gulp.watch(['app/scss/*.scss'], ['sass']);
    console.log("Ma tache par default...");
});
