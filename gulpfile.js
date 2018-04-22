/* eslint no-implicit-globals: "off" */
/* eslint strict: "off" */
/* global require, __dirname */

"use strict";

const gulp = require("gulp");
const changed = require("gulp-changed");
const fs = require("fs");
const header = require("gulp-header");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const composer = require("gulp-uglify/composer");
const uglifyes = require("uglify-es");
const uglify = composer(uglifyes, console);
const zip = require("gulp-zip");
const karmaServer = require("karma").Server;

const pkg = require("./package.json");

const CONST = {
	SRC_FOLDER: "src",
	DIST_FOLDER: "dist",
	MIN_SUFFIX: ".min.js",
	JS_SRC: "src/jasmineFixtures.js",
	FOLDERS_TO_ARCHIVE: ["LICENSE", "README.md", "dist/**/*", "lib/**/*", "src/**/*", "test/**/*"],
	ARCHIVE_FILE: "jasmineFixtures.zip",
	ARCHIVE_FOLDER: "archive",
	VERSION_PATTERN: new RegExp("version = \"(\\d.\\d(.\\d)?)\";")
};

function assembleBanner(version){
	const now = new Date();
	const banner = [
		"/*! ",
		pkg.name + " " + version + " " + now.toISOString(),
		pkg.homepage,
		"Copyright 2017-" + now.getFullYear() + " Massimo Foti (massimo@massimocorner.com)",
		"Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0",
		" */",
		""].join("\n");
	return banner;
}

function getJsVersion(){
	const buffer = fs.readFileSync(CONST.JS_SRC);
	const fileStr = buffer.toString("utf8", 0, buffer.length);
	const version = CONST.VERSION_PATTERN.exec(fileStr)[1];
	return version;
}

gulp.task("coverage", function(done){
	// Use Karma only for the sake of producing a code coverage report
	new karmaServer({
		configFile: __dirname + "/test/karma.conf.js"
	}, done).start();
});

gulp.task("js", function(){
	const jsVersion = getJsVersion();
	return gulp.src(CONST.JS_SRC)
		.pipe(sourcemaps.init())
		// The "changed" task needs to know the destination directory
		// upfront to be able to figure out which files changed
		.pipe(changed(CONST.DIST_FOLDER))
		.pipe(header(assembleBanner(jsVersion))) // Banner for copy
		.pipe(gulp.dest(CONST.DIST_FOLDER))
		.pipe(uglify({
			mangle: false
		}))
		.pipe(rename({
			extname: CONST.MIN_SUFFIX
		}))
		.pipe(header(assembleBanner(jsVersion))) // Banner for minified
		.pipe(sourcemaps.write(".", {
			includeContent: true,
			sourceRoot: "."
		}))
		.pipe(gulp.dest(CONST.DIST_FOLDER));
});

gulp.task("zip", function(){
	return gulp.src(CONST.FOLDERS_TO_ARCHIVE, {base: "."})
		.pipe(zip(CONST.ARCHIVE_FILE))
		.pipe(gulp.dest(CONST.ARCHIVE_FOLDER));
});

gulp.task("default", function(callback){
	runSequence(
		"js",
		"coverage",
		"zip",
		function(error){
			if(error){
				console.log(error.message);
			}
			else{
				console.log("BUILD FINISHED SUCCESSFULLY");
			}
			callback(error);
		});
});