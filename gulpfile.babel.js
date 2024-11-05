import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';

const sass = gulpSass(dartSass);

const paths = {
    scss: './scss/**/*.scss',
    js: './js/**/*.js',
    cssDest: './public/gulp/css',
    jsDest: './public/gulp/js',
};

export function styles() {
    return gulp.src(paths.scss)
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init())
        .pipe(sass({quietDeps: true}, undefined).on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.cssDest));
}

export function scripts() {
    return gulp.src(paths.js)
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/preset-env'],
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.jsDest));
}

function watch() {
    gulp.watch(paths.js, scripts);
    gulp.watch(paths.scss, styles);
}

export const build = gulp.parallel(styles, scripts);
export const dev = gulp.series(build, watch);

export default dev;