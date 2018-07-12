var gulp = require('gulp');
var template = require('gulp-template');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var fs = require('fs');
var gutil = require('gulp-util');


gulp.task('styles', function(){
  gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss({compatibility: 'ie9'}))
    .pipe(gulp.dest('./app/css/'))
});

gulp.task('templates', function(){
  var templates = {};
  var files = fs.readdirSync('./pages/partials')
    .filter(function(file){
      if (file.charAt(0) === '_') {
        return file;
      }
    })
    .forEach(function(template) {
      var slug = template.replace('_', '').replace('.html', '');
      templates[slug] = fs.readFileSync("./pages/partials/" +  template, "utf8");
    });

  return gulp.src(['./pages/*.html'])
    .pipe(template(templates))
    .on('error', gulp.log)
    .pipe(gulp.dest('./app'));
});

gulp.task('default', function(){
  gulp.start(['styles', 'templates']);
  gulp.watch('./scss/*.scss', ['styles']);
  gulp.watch('./pages/**/*.html',['templates']);
  gulp.src('./app')
    .pipe(server({
      port: 8001,
      livereload: {
        enable: true,
        port: 35780,
      },
      directoryListing: false,
      open: true
    }));
});
