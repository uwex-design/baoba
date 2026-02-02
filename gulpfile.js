// Baoba - Gulpfile para Build Process
// Modelo: blackhaus (UWEX Design)

const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));

// ===== SCSS → CSS =====
function compileSCSS() {
  return gulp
    .src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({ api: 'modern' }).on('error', sass.logError)
    )
    .pipe(cleanCSS())
    .pipe(rename('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
}

// ===== JavaScript - Bundle Unificado =====
function compileBundleJS() {
  return gulp
    .src([
      'src/js/libs.js',
      'src/js/common.js',
      'src/js/dropdown-desktop.js',
      'src/js/dropdown-mobile.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// ===== JavaScript - Páginas específicas =====
function compilePagesJS() {
  return gulp
    .src('src/js/pages/*.js', { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(
      rename(function (path) {
        path.basename = path.basename + '.min';
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/pages', { sourcemaps: true }));
}

// ===== Limpar pasta dist =====
function clean() {
  const fs = require('fs');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/css', { recursive: true });
  fs.mkdirSync('dist/js', { recursive: true });
  fs.mkdirSync('dist/js/pages', { recursive: true });
  return Promise.resolve();
}

// ===== Watch =====
function watch() {
  gulp.watch('src/scss/**/*.scss', compileSCSS);
  gulp.watch(
    [
      'src/js/libs.js',
      'src/js/common.js',
      'src/js/dropdown-desktop.js',
      'src/js/dropdown-mobile.js',
    ],
    compileBundleJS
  );
  gulp.watch('src/js/pages/*.js', compilePagesJS);
}

// ===== Exports =====
exports.clean = clean;
exports.build = gulp.series(
  clean,
  gulp.parallel(compileSCSS, compileBundleJS, compilePagesJS)
);
exports.watch = watch;
exports.dev = gulp.series(
  compileSCSS,
  compileBundleJS,
  compilePagesJS,
  watch
);
exports.default = exports.build;
