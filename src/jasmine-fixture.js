/* istanbul ignore if */
if(typeof(jQuery) === "undefined"){
	throw("Unable to find jQuery");
}

/* istanbul ignore else */
if(typeof(window.jasmineFixture) === "undefined"){
	window.jasmineFixture = {};
}

/**
 * @typedef {Object} jasmineFixture.options
 *
 * @property {String} basePath        Base path for fixtures. Default to "fixtures/"
 * @property {String} containerId     Used as id attribute for the <div> where fixtures are loaded. Default to "jasmine-fixtures"
 */

(function(){
	"use strict";

	jasmineFixture.version = "0.1";

	/**
	 * @type {jasmineFixture.options}
	 */
	var config = {
		basePath: "fixtures/",
		containerId: "jasmine-fixtures"
	};

	/**
	 * @type {Object.<String, String>}
	 */
	jasmineFixture.cache = {};

	jasmineFixture.clearCache = function(){
		jasmineFixture.cache = {};
	};

	/**
	 * @param {String|Array.<String>} path
	 */
	jasmineFixture.preload = function(path){
		if(jQuery.type(path) === "string"){
			path = [path];
		}
		path.forEach(function(element){
			var fullUrl = assembleUrl(element);
			if(jQuery.type(jasmineFixture.cache[fullUrl]) === "undefined"){
				readIntoCache(fullUrl);
			}
		});
	};

	/**
	 * @param {String} path
	 * @return {String|Object}
	 */
	jasmineFixture.read = function(path){
		jasmineFixture.preload(path);
		return jasmineFixture.cache[assembleUrl(path)];
	};

	/**
	 * Change¨/retrieve current configuration
	 * @param {jasmineFixture.options} [options]
	 * @return {jasmineFixture.options}
	 */
	jasmineFixture.setup = function(options){
		jQuery.extend(config, options);
		// Ensure we always have a trailing slash
		if(config.basePath[config.basePath.length - 1] !== "/"){
			config.basePath += "/";
		}
		return config;
	};

	var assembleUrl = function(url){
		return config.basePath + url;
	};

	var readIntoCache = function(url){
		jQuery.ajax({
			url: url,
			async: false, // Must be synchronous to ensure fixtures are loaded before test run
			cache: false
		}).done(function(data){
			jasmineFixture.cache[url] = data;
		}).fail(function(jqXHR){
			throw ("Failed to retrieve fixture at: " + url + " (status: " + jqXHR.status + ")");
		});
	};

}());