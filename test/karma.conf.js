/* global module */

/*
Use Karma only for the sake of producing a code coverage report.
No need to use multiple browsers
*/
module.exports = function(config) {
	"use strict";
	config.set({
		basePath: "../",
		browsers: ["Chrome"],
		frameworks: ["jasmine"],
		files: [
			// Libs
			"lib/jquery/jquery.min.js",

			// Source files
			"src/**/*.js",

			// Test specs
			"test/spec/*.Spec.js"
		],
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		preprocessors: {
			"src/**/*.js": ["coverage"]
		},

		coverageReporter: {
			reporters: [
				{type: "lcov", dir: "test/coverage/", subdir: "."},
				{type: "text", dir: "test/coverage/", subdir: ".", file: "coverage.txt"},
				{type: "text-summary"}
			]
		},

		reporters: ["progress", "html", "coverage"],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true
	});
};