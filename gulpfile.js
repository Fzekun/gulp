var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var del = require('del');
var reload = browserSync.reload;
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var minifyCss = require('gulp-minify-css');
var revCollector = require('gulp-rev-collector');
//开发 sass 替换掉src/css
//build 清楚所有文件夹，所有文件

gulp.task('sass',['clean'],function() {
    gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
        .pipe(rev())
        .pipe(minifyCss())
        .pipe(gulp.dest('./dest/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/css'))
        .pipe(reload({stream:true}));
});
gulp.task('js',['clean'],function() {
   return gulp.src('./src/js/*.js')
        .pipe(rev())
        .pipe(uglify())
        .pipe(gulp.dest('./dest/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});
gulp.task("clean", function(){
    return del(['dest']);
})
gulp.task("cleanRev", function(){
    return gulp.src('./rev')
        .pipe(clean());
})
// 定义 webserver 任务
gulp.task('webserver', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/*.html").on('change', reload);

});
gulp.task('rev',function() {
    gulp.src(['./rev/**/**.json', './src/**.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({
            replaceReved:true,
            dirReplacements: {
                'css': 'css/',
                'js/': 'js/'
            }
        }))                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./dest'));                     //- 替换后的文件输出的目录
});
// 定义 watch 任务
// gulp.task('watch', function() {
//     gulp.watch(['./src/scss/*.scss']);
// })
// 定义默认任务
gulp.task('default', ['rev','webserver']);
gulp.task('build', ['clean']);

