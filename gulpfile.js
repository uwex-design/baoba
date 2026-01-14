// Baoba - Gulpfile para Build Process
// Arquivo: gulpfile.js

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

// Configuração do Sass
const sass = require('gulp-sass')(require('sass'));

// Tarefa: Compilar SCSS para CSS minificado
function compileSCSS() {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'));
}

// Tarefa removida - usando apenas SCSS

// Tarefa: Compilar JavaScript - Bibliotecas
function compileLibsJS() {
  return gulp.src('src/js/libs.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// Tarefa: Compilar JavaScript - Comum
function compileCommonJS() {
  return gulp.src('src/js/common.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// Tarefa: Compilar JavaScript - Páginas específicas
function compilePagesJS() {
  return gulp.src('src/js/pages/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/pages'));
}

// Tarefa: Compilar JavaScript - Dropdown Desktop
function compileDropdownDesktopJS() {
  return gulp.src('src/js/dropdown-desktop.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// Tarefa: Compilar JavaScript - Dropdown Mobile
function compileDropdownMobileJS() {
  return gulp.src('src/js/dropdown-mobile.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// Tarefa: Compilar JavaScript - Bundle Unificado
function compileBundleJS() {
  return gulp.src([
    'src/js/libs.js',
    'src/js/common.js',
    'src/js/dropdown-desktop.js',
    'src/js/dropdown-mobile.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}

// Tarefa: Limpar pasta dist
function clean() {
  const fs = require('fs');
  const path = require('path');
  
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/css', { recursive: true });
  fs.mkdirSync('dist/js', { recursive: true });
  
  return Promise.resolve();
}

// Tarefa: Watch (observar mudanças)
function watch() {
  gulp.watch('src/scss/**/*.scss', compileSCSS);
  gulp.watch('src/js/libs.js', compileLibsJS);
  gulp.watch('src/js/common.js', compileCommonJS);
  gulp.watch('src/js/pages/*.js', compilePagesJS);
  gulp.watch('src/js/dropdown-desktop.js', compileDropdownDesktopJS);
  gulp.watch('src/js/dropdown-mobile.js', compileDropdownMobileJS);
}

// Tarefas principais
exports.clean = clean;
exports.build = gulp.series(clean, gulp.parallel(
  compileSCSS, 
  compileBundleJS,
  compilePagesJS
));
exports.watch = watch;
exports.dev = gulp.series(
  compileSCSS, 
  compileBundleJS,
  compilePagesJS,
  watch
);
exports.default = exports.build;
