const { src, dest } = require("gulp");
const gulp = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const autoPrefixer = require("gulp-autoprefixer");
const include = require("gulp-file-include");
const cssMinify = require("gulp-clean-css");
const jsMinify = require("gulp-terser");
const concatJs = require("gulp-concat");
const concatCss = require("gulp-concat-css");
const browserSync = require("browser-sync");

const buildFolder = "./dist";
const srcFolder = "./src";

const path = {
  build: {
    files: `${buildFolder}/files/`,
    css: `${buildFolder}/styles/`,
    js: `${buildFolder}/sripts/`,
  },
  src: {
    files: `${srcFolder}/files/**/*.*`,
    css: `./style/**/*.css`,
    js: `./script/**/*.js`,
  },
};

function styles() {
  return gulp
    .src(path.src.css)
    .pipe(autoPrefixer("last 4 version"))
    .pipe(cssMinify())
    .pipe(concatCss("style.css"))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(path.src.js)
    .pipe(jsMinify())
    .pipe(concatJs("script.js"))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

function html() {
  return src("./**.html")
    .pipe(
      include({
        prefix: "@@",
      })
    )
    .pipe(dest("dist"));
}

function watchTasks() {
  browserSync.init({
    server: "./dist",
  });

  gulp.watch(
    ["src/styles/*.css", "src/scripts/*.js", "./*.html"],
    gulp.series(styles, scripts)
  );
}

exports.default = gulp.series(html, watchTasks);
