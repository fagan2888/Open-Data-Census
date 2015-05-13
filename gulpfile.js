var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var prepBower = require('bower-files');
var inject = require('gulp-inject');
var series = require('stream-series');
var del = require('del');
var bower = require('gulp-bower');
var colors = require('colors');
var taskListing = require('gulp-task-listing');
var betterConsole = require('better-console');
var ghPages = require('gulp-gh-pages');
var connect = require('gulp-connect');
var print = require('gulp-print');
var underscore = require('underscore');
var merge = require('merge-stream');
var install = require("gulp-install");

var modules = ["index", "grid"];

gulp.task('default', ["bower", "clean", "buildDev"]);

gulp.task('help', taskListing);

gulp.task('bower', function() {
    return bower().pipe(gulp.dest('bower_components/'))
});

gulp.task('npm', function() {
    return gulp.src(['./package.json'])
        .pipe(install());
});

gulp.task('clean', function() {
    return del.sync(['out/']);
});

gulp.task('buildDev', ['npm', 'bower', "clean"], function() {
    var lib = prepBower();

    var bowerJs = gulp.src(lib.ext('js').files)
        .pipe(gulp.dest('out/common/js'));

    var bowerCss = gulp.src(lib.ext('css').files)
        .pipe(gulp.dest('out/common/css'));

    var bowerWoff = gulp.src(lib.ext('woff').files)
        .pipe(gulp.dest('out/common/fonts'));

    return merge(underscore.map(modules, function(module) {
        var target = gulp.src('./public/' + module + '/*.html');

        var customJs = gulp.src('./public/' + module + '/js/**.js')
            .pipe(gulp.dest('out/' + module + '/js'));

        var customCss = gulp.src('./public/' + module + '/css/**.css')
            .pipe(gulp.dest('out/' + module + '/css'));

        return target.pipe(inject(series(bowerJs, customJs), {
                ignorePath: '/out/'
            }))
            .pipe(inject(series(bowerCss, customCss), {
                ignorePath: '/out/'
            }))
            .pipe(gulp.dest('out/'))
            .pipe(connect.reload());
    }));
});

gulp.task('watch', ['buildDev'], function() {
    return gulp.watch("public/**/*", ['buildDev']);
});

gulp.task('connect', function() {
    connect.server({
        root: 'out',
        port: 8000,
        livereload: true
    });
});

gulp.task('devServer', ['connect', 'watch'])

gulp.task('buildProd', ['bower'], function() {
    var lib = prepBower();


    var bowerJs = gulp.src(lib.ext('js').files)
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('PoliceOpenDataCensus/common/js'));

    var bowerCss = gulp.src(lib.ext('css').files)
        .pipe(concat('lib.min.css'))
        .pipe(gulp.dest('PoliceOpenDataCensus/common/css'));

    var bowerWoff = gulp.src(lib.ext('woff').files)
        .pipe(gulp.dest('PoliceOpenDataCensus/common/fonts'));

    return merge(underscore.map(modules, function(module) {
        var target = gulp.src('./public/' + module + '/*.html');

        var customJs = gulp.src('./public/' + module + '/js/**.js')
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('PoliceOpenDataCensus/' + module + '/js'));

        var customCss = gulp.src('./public/' + module + '/css/**.css')
            .pipe(concat('app.min.css'))
            .pipe(gulp.dest('PoliceOpenDataCensus/' + module + '/css'));

        return target.pipe(inject(series(bowerJs, customJs)))
            .pipe(inject(series(bowerCss, customCss)))
            .pipe(gulp.dest('PoliceOpenDataCensus/'))
            .pipe(connect.reload());
    }));
});


gulp.task('gh-pages', ["buildProd"], function() {
    return gulp.src('./PoliceOpenDataCensus/**/*')
        .pipe(ghPages());
});

gulp.task('deploy', ["gh-pages"], function() {
    return del.sync(['PoliceOpenDataCensus/']);
});


gulp.task('readme', function() {
    betterConsole.clear()
    console.log("Part of:");
    console.log("___  ____ ____  _ ____ ____ ___    ____ ____ _  _ ___  ____ ____ ___");
    console.log("|__] |__/ |  |  | |___ |     |     |    |  | |\\/| |__] |  | |__/  | ");
    console.log("|    |  \\ |__| _| |___ |___  |     |___ |__| |  | |    |__| |  \\  | ");
    console.log();
    console.log();
    console.log("From:")
    console.log("____ ____ ___  ____    ____ ____ ____    ____ _  _ ____ ____ _ ____ ____")
    console.log("|    |  | |  \\ |___    |___ |  | |__/    |__| |\\/| |___ |__/ | |    |__|")
    console.log("|___ |__| |__/ |___    |    |__| |  \\    |  | |  | |___ |  \\ | |___ |  |")
    console.log();
    console.log("                        / ::::=======    / \\                            ".blue);
    console.log("                       /  ::::=======   /   \\                           ".blue);
    console.log("                       \\  ===========  /    /                           ".blue);
    console.log("                        \\ =========== /    /                            ".blue);
    console.log();;
    console.log("And:");
    console.log("___ ____ ____ _  _    _ _  _ ___  _   _");
    console.log(" |  |___ |__| |\\/|    | |\\ | |  \\  \\_/");
    console.log(" |  |___ |  | |  |    | | \\| |__/   |");
    console.log();
    console.log("______________________________________________".red);
    console.log(" _____   _____         _____ _______ _______".red);
    console.log("|_____] |     | |        |   |       |______".red);
    console.log("|       |_____| |_____ __|__ |_____  |______".red);
    console.log(" _____   _____  _______ __   _".white);
    console.log("|     | |_____] |______ | \\  |".white);
    console.log("|_____| |       |______ |  \\_|".white);
    console.log("______  _______ _______ _______".white);
    console.log("|     \\ |_____|    |    |_____|".white);
    console.log("|_____/ |     |    |    |     |".white);
    console.log("_______ _______ __   _ _______ _     _ _______".blue);
    console.log("|       |______ | \\  | |______ |     | |______".blue);
    console.log("|_____  |______ |  \\_| ______| |_____| ______|".blue);
    console.log("______________________________________________".blue);
    console.log();
    console.log();
    console.log("WHAT:");
    console.log("The Police Open Data Census is an attempt to catalog open police accountibilty,");
    console.log("oversight and transparency datasets available to the public.");
    console.log();
    console.log("HOW:");
    console.log("The Census is built on a Google Spreadsheet integration though tabletop.js.");
    console.log("Feedback and suggested additions to the current data are more than welcome");
    console.log("at indy@codeforamerica.org.");
    console.log("The site is otherwise a fairly bogstandard bootstrap/jquery build. All that");
    console.log("should be required to get the development environment up is:");
    console.log();
    console.log("                       gulp")
    console.log();
    console.log("which will build the site in the 'out' directory where it can be served by")
    console.log("your static site server of choice. If you're going to be working on the site,")
    console.log();
    console.log("                       gulp devServer")
    console.log();
    console.log("will watch changes to the 'public' directory, serve a live updating version of")
    console.log("the site at localhost:8000 and live refresh when changes occur.")
    console.log("To minifiy and concat resouces then publish the site to gh-pages:")
    console.log();
    console.log("                       gulp deploy")
    console.log();
});