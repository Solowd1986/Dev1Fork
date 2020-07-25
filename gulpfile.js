

const gulp = require('gulp');
const path = require("path");
const requireDir = require("require-dir");


const browserSync = require('browser-sync').create();
const rename = require("gulp-rename");


const clean = require('gulp-clean');
const RevAll = require("gulp-rev-all");


const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


const babel = require('gulp-babel');
const uglify = require('gulp-uglify');


const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const nunjucks = require('gulp-nunjucks');

const dom  = require('gulp-dom');




const paths = {
    src: {
        scss: "src/assets/scss/**/*.scss",
        js: "src/assets/js/main.js",
        tpl: "src/tpl/**/*.njk",
        tpl_hide: '!src/tpl/**/_*.njk'
    },
    build: {
        root_clean: "./dist/*",
        css: "./dist/css",
        js: "./dist/js",
        img: "./dist/img",
        sprites: "./dist/img/sprites",
        fonts: "./dist/fonts",
        html: "./"
    },
    proxy: "dev1.test"
};

/*  Первая задача при сборке, полнстью очищает целевую директорию
================================
*/
gulp.task('clean', () => {
    return gulp.src(paths.build.root_clean).pipe(clean())
});


/*  Создание директорий проекта
================================
*/
gulp.task('directories', function () {
    return gulp.src('*.*', {read: false})
        .pipe(gulp.dest(paths.build.css))
        .pipe(gulp.dest(paths.build.js))
        .pipe(gulp.dest(paths.build.img))
        .pipe(gulp.dest(paths.build.sprites))
        .pipe(gulp.dest(paths.build.fonts))
});




/*  Сборка scss-файлов.
    1. Вызывается команда очистки для выходной папки файлов стилей, чтобы они не накапливались при пересоздаиии и обновлении
    2. Генерируются sourcemaps и sass-интерпретатор, после прогоняется через autoprefixer
    3. Можно включить опции совместимости и красивого вывода кода, по-умолчанию - закомментированы
    4.
================================
*/
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
                    return hash.substr(0, 15) + ext; // 3410c.filename.ext
                },
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css));
});

const browserify = require('browserify');
const babelify  = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');







gulp.task('clean-scripts', function () {
    return gulp.src('./dist/js/*.js', {read: false})
        .pipe(clean());
});



gulp.task('babel-js-minify-dev', gulp.series(['clean-scripts'], () => {
        return gulp.src(paths.src.js)
        .pipe(RevAll.revision({
                transformFilename: function (file, hash) {
                    let ext = path.extname(file.path);
                    return hash.substr(0, 15) + ext;
                },
            })
        )
        //.pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
}));



gulp.task('babel-js-minify-prod', gulp.series(['clean-scripts'], () => {
    return browserify({
        entries: [paths.src.js],
        debug: true,
        transform: [
            babelify.configure({
                plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-class-properties'],
                presets: ['@babel/preset-env']
            }),
        ]
        ,
    }).bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(RevAll.revision({
                transformFilename: function (file, hash) {
                    let ext = path.extname(file.path);
                    return hash.substr(0, 15) + ext;
                },
            })
        )
        //.pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
}));





/*
    Вставка в шаблон тегов для скриптов и стилей. Сначала собирается шаблон, потом вставляются теги.
    Вставка тегов выполняется через внесение в разметку специальных inject-тегов, они не мешаются в шаблонах
    removeTags - удаляет inject-теги, те, что для вставки, после выполнения самой вставки.
    collapseWhitespace/removeComments - минифицирует разметку
================================
*/
gulp.task('template-build', function() {
    return gulp.src([paths.src.tpl, paths.src.tpl_hide])
        .pipe(nunjucks.compile())
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(inject(gulp.src(['./dist/js/*.js', './dist/css/*.css'], {read: false}), {removeTags: true}))
        //.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dom(function(){
            return this.querySelectorAll('script')[0].setAttribute('type', 'module');
        }))
        .pipe(gulp.dest(paths.build.html))
});



/*  Сам процесс сборки, предварительно выполняются:
    1. clean - очистка выходной папки, у меня это dist, в ней удалется все, папки + файлы
    2. directories - создаются директории для файлов, без них последующие плагины выводят ошибку. Обычно, папки генерятся сами,
       но у меня плагины чистят свои папки перед запуском, а если папко нет - ошибка. Чистить пустые папки ни к чему, это нужно потом,
       на этапе пересборки файлов, но первый запуск в отсутствии папки вернет ошибку
    3. scss - генерим css
    4. babel-js-minify - генерим js
    5. template-build - генерим шаблоны
================================
*/
gulp.task('default', gulp.series('clean', 'directories', 'scss', 'babel-js-minify-prod', 'template-build', function() {
     browserSync.init({
        //server: "./",
        proxy: paths.proxy
    });

    gulp.watch(["./src/assets/tpl/**/*.njk", "./src/assets/tpl/**/_*.njk"]).on('change', gulp.series('template-build', browserSync.reload));
    gulp.watch("./src/assets/scss/**/*.scss").on('change', gulp.series('scss', 'template-build', browserSync.reload));
    gulp.watch("./src/assets/js/**/*.js").on('change', gulp.series('babel-js-minify-prod', 'template-build', browserSync.reload));
}));











/*
================================
*/







gulp.task('template-dev', function() {
    return gulp.src([paths.src.tpl, paths.src.tpl_hide])
        .pipe(nunjucks.compile())
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(inject(gulp.src(['./src/assets/js/main.js', './src/assets/scss/main.css'], {read: false}), {removeTags: true}))
        .pipe(dom(function(){
            return this.querySelectorAll('script')[0].setAttribute('type', 'module');
        }))
        .pipe(gulp.dest("./"))
});


gulp.task('dev', gulp.series('template-dev', function() {
    browserSync.init({
        //server: "./",
        proxy: paths.proxy
    });

    gulp.watch(["./src/assets/tpl/**/*.njk", "./src/assets/tpl/**/_*.njk", "./src/assets/js/main.js", "./src/assets/scss/main.css"]).on('change', gulp.series('template-dev', browserSync.reload));
    gulp.watch(["./src/assets/js/main.js", "./src/assets/scss/main.css"]).on('change',  browserSync.reload);
    //gulp.watch("./src/assets/scss/**/*.scss").on('change', gulp.series('scss', 'template-build', browserSync.reload));
    //gulp.watch("./src/assets/js/**/*.js").on('change', gulp.series('babel-js-minify-prod', 'template-build', browserSync.reload));
}));


















/*================================*/




















