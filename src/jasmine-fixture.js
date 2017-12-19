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
 */

(function(){
	"use strict";

	jasmineFixture.version = "0.1";

	/**
	 * @type {jasmineFixture.options}
	 */
	var config = {
		basePath: "fixtures/"
	};

	/**
	 * @type {Object.<String, String>}
	 */
	jasmineFixture.cache = {};

	jasmineFixture.clearCache = function(){
		jasmineFixture.cache = {};
	};

	/**
	 * @param {String} url
	 * @return {String}
	 */
	jasmineFixture.readFixture = function(url){
		var fullUrl = assembleUrl(url);
		if(jQuery.type(jasmineFixture.cache[fullUrl]) === "undefined"){
			readIntoCache(fullUrl);
		}
		return jasmineFixture.cache[fullUrl];
	};

	/**
	 * Change current configuration
	 * @param {jasmineFixture.options} options
	 * @return {jasmineFixture.options}
	 */
	jasmineFixture.setup = function(options){
		jQuery.extend(config, options);
		// Ensure we always have a trailing slash
		if(config.basePath[config.basePath.length -1] !== "/") {
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
		}).done(function(data, textStatus, jqXHR){
			jasmineFixture.cache[url] = data;
		}).fail(function(jqXHR, textStatus, errorThrown){
			throw ("Failed to retrieve fixture at: " + url + " (status: " + jqXHR.status + ")");
		});
	};

}());