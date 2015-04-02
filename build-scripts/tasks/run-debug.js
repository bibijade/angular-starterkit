// ============================================================
// === Required ===============================================
// ============================================================

var gulp = require('gulp');
var watch = require('gulp-watch');
var _ = require('underscore');
var configUtils = require('../utils/config-utils');
var config = require('../../build-config.js');
var nodemon = require('gulp-nodemon');
var argv = require('yargs').argv;

// ============================================================
// === Constants ==============================================
// ============================================================

const BASE_PATH = "../";

// ============================================================
// === Variables ==============================================
// ============================================================

var scriptLibraries = config.scripts.libs;
var scriptSources = config.scripts.src;
var styleLibraries = config.styles.libs;
var styleSources = config.styles.src;
var viewsCopy = config.views.copy;
var viewsCompile = config.views.compile;

// ============================================================
// === Launch =================================================
// ============================================================

gulp.task('launch', function () {

    var options = {
        script: '../debug/server.js',
        ext: 'ejs js',
        ignore: ['**/*'],
        stdout: false
    };

    nodemon(options);
});

// ============================================================
// === Watch ==================================================
// ============================================================

gulp.task('watch', function () {

    if (configUtils.shouldWatchSection(styleLibraries)) {
        var styleLibFiles = configUtils.watchFilesForSection(styleLibraries);
        watch(configUtils.prefixFiles(styleLibFiles, BASE_PATH), function () {
            gulp.start('styles-src');
        });
    }

    if (configUtils.shouldWatchSection(styleSources)) {
        var styleSourceFiles = configUtils.watchFilesForSection(styleSources);
        watch(configUtils.prefixFiles(styleSourceFiles, BASE_PATH), function () {
            gulp.start('styles-src');
        });
    }

    if (configUtils.shouldWatchSection(scriptSources)) {
        var scriptSourceFiles = configUtils.watchFilesForSection(scriptSources);
        watch(configUtils.prefixFiles(scriptSourceFiles, BASE_PATH), function () {
            gulp.start(['scripts-src', 'views-compile']);
        });
    }

    if (configUtils.shouldWatchSection(scriptLibraries)) {
        var scriptLibFiles = configUtils.watchFilesForSection(scriptLibraries);
        watch(configUtils.prefixFiles(scriptLibFiles, BASE_PATH), function () {
            gulp.start('scripts-libs');
        });
    }

    if (configUtils.shouldWatchSection(viewsCopy)) {
        var viewsCopySource = configUtils.watchFilesForSection(viewsCopy);
        watch(configUtils.prefixFiles(viewsCopySource, BASE_PATH), function () {
            gulp.start('views-copy');
        });
    }

    if (configUtils.shouldWatchSection(viewsCompile)) {
        var viewsCompileSource = configUtils.watchFilesForSection(viewsCompile);
        watch(configUtils.prefixFiles(viewsCompileSource, BASE_PATH), function () {
            gulp.start('views-compile');
        });
    }

    var assetFiles = [BASE_PATH + '/source/**/assets/**/*.*', BASE_PATH + '/source/*.*'];

    watch(assetFiles, function () {
        gulp.start('static');
    });

});

// ============================================================
// === Macro Task =============================================
// ============================================================

gulp.task('run-debug', ['run-build'], function () {
    gulp.start('launch', 'watch');
});