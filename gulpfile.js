

const gulp = require('gulp');

let browserSync = require('browser-sync').create();
let nunjucks = require('gulp-nunjucks');
let rename = require("gulp-rename");
let requireDir = require("require-dir");

let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css');

const clean = require('gulp-clean');

const htmlmin = require('gulp-htmlmin');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');


// const path = {
//     build: {
//         base: './',
//         html_index: 'dist',
//         html_pages: 'dist/pages',
//         css: 'dist/assets/css',
//         js: 'dist/assets/js',
//         img: 'dist/assets/img'
//     },
//
//     src: {
//         css: 'src/assets/scss/**/*.css',
//         scss: 'src/assets/scss/**/*.scss',
//         js: 'src/assets/js/**/*.js',
//         tpl: 'src/tpl/**/*.njk',
//         tpl_hide: '!src/tpl/**/_*.njk',
//         img: 'src/assets/img/**/*.{png,jpeg,jpg,svg,gif,webp}'
//     },
//
//     watch: {
//         tpl: 'src/tpl/**/*.njk',
//         js: 'src/assets/js/**/*.js',
//         scss: 'src/assets/scss/**/*.scss',
//         css: 'src/assets/scss/**/*.css',
//         html: './*.html'
//     },
//     clean: 'dist'
// };



const paths = {
    src: {
        scss: "src/assets/scss/**/*.scss",
        js: "src/assets/js/**/main.js",
        tpl: "src/tpl/**/*.njk",
        tpl_hide: '!src/tpl/**/_*.njk'
    },
    build: {
        root_clean: "./dist/*",
        css: "./dist/css",
        js: "./dist/js",
        html: "./"
    }
};

const inject = require('gulp-inject');


gulp.task('index', function () {
    let target = gulp.src('./inc/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    let sources = gulp.src(['./inc/main.js', './inc/main.css'], {read: false});
    return target.pipe(inject(sources))
        .pipe(gulp.dest('./dist/src'));
});


const RevAll = require("gulp-rev-all");

gulp.task("hash", function () {
    return gulp.src("inc/*.js").pipe(RevAll.revision()).pipe(gulp.dest("./dist/hash/"));
});





/*  removeTags - удаляет теги для вставки после ее выполнения
================================
*/

gulp.task('html-inject', function() {
    return gulp.src(['./inc/index.njk'])
        .pipe(nunjucks.compile())
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(inject(gulp.src(['./dist/js/main.js', './dist/css/main.css'], {read: false}), {removeTags: true}))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('./'))
});



gulp.task('sc', function () {
    return gulp.src("./inc/css")
        .pipe(clean())
        .pipe(gulp.src("./inc/scss/*.scss"))
        .pipe(sass())
        .pipe(RevAll.revision())
        .pipe(gulp.dest("./inc/css"));
});



const path = require("path");
gulp.task('clean', () => gulp.src(paths.build.root_clean).pipe(clean()));



gulp.task("rename", function () {
    return gulp.src("./inc/main.js")

        .pipe(RevAll.revision({
                transformFilename: function (file, hash) {
                    let ext = path.extname(file.path);
                    return hash.substr(0, 15) + "." + ext; // 3410c.filename.ext
                },
            })
        )

        .pipe(gulp.dest("./inc/"));
});




gulp.task('babel-js-minify', () => {


    return gulp.src(paths.build.js)
        .pipe(clean())
        .pipe(gulp.src(paths.src.js))
        .pipe(babel({
            presets: ['@babel/env']
        }))

        .pipe(RevAll.revision({
                transformFilename: function (file, hash) {
                    let ext = path.extname(file.path);
                    return hash.substr(0, 15) + ext; // 3410c.filename.ext
                },
            })
        )


        .pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
});


// gulp.task('scss', function () {
//     return gulp.src(paths.src.scss)
//         .pipe(sourcemaps.init())
//         .pipe(sass())
//         .pipe(autoprefixer({cascade: false}))
//         .pipe(cleanCSS({
//             //compatibility: 'ie8',
//             //format: 'beautify'
//         }))
//         .pipe(RevAll.revision())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(paths.build.css));
// });

gulp.task('scss', function () {
    return gulp.src(paths.build.css)
        .pipe(clean())
        .pipe(gulp.src(paths.src.scss))

        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({cascade: false}))
        .pipe(cleanCSS({
            //compatibility: 'ie8',
            //format: 'beautify'
        }))


        .pipe(RevAll.revision({
                transformFilename: function (file, hash) {
                    let ext = path.extname(file.path);
                    return hash.substr(0, 15) + "." + ext; // 3410c.filename.ext
                },
            })
        )


        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css));
});




gulp.task('template-build', function() {
    return gulp.src([paths.src.tpl, paths.src.tpl_hide])
        .pipe(nunjucks.compile())
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css'], {read: false}), {removeTags: true}))
        //.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.build.html))
});


gulp.task('directories', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist/css'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(gulp.dest('./dist/img'))
        .pipe(gulp.dest('./dist/img/sprites'))
        .pipe(gulp.dest('./dist/fonts'))
});



gulp.task('default', gulp.series('clean', 'directories', 'scss', 'babel-js-minify', 'template-build', function() {

    browserSync.init({
        //server: "./",
        proxy: "dev1.test"
    });

    //gulp.watch([path.watch.tpl, path.watch.scss], gulp.series('template-build'));
    //gulp.watch([path.watch.html, path.watch.scss, path.watch.js]).on('change', browserSync.reload);

    gulp.watch([paths.src.tpl], gulp.series('template-build'));
    gulp.watch([paths.src.js], gulp.series('babel-js-minify', 'template-build'));
    gulp.watch([paths.src.scss], gulp.series('scss', 'template-build'));

    gulp.watch([paths.src.tpl, paths.src.scss, paths.src.js]).on('change', browserSync.reload);



}));

