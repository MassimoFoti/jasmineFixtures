/*! 
jasmine-fixture 0.1 2017-12-20T22:25:11.915Z
Copyright 2017 Massimo Foti (massimo@massimocorner.com)
Licensed under the Apache License, Version 2.0 | http://www.apache.org/licenses/LICENSE-2.0
 */
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
	 * @type {Array.<JQuery>}
	 */
	var styleNodes = [];

	/**
	 * @type {Object.<String, String>}
	 */
	jasmineFixture.cache = {};

	jasmineFixture.clearCache = function(){
		jasmineFixture.cache = {};
	};

	jasmineFixture.clearCSS = function(){
		styleNodes.forEach(function(element){
			element.remove();
		});
	};

	jasmineFixture.clearHTML = function(){
		getContainer().remove();
	};

	/**
	 * @param {String} path
	 */
	jasmineFixture.appendCSS = function(path){
		jasmineFixture.preload(path);
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixture.appendHTML = function(path){
		jasmineFixture.preload(path);
		appendToContainer(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixture.loadCSS = function(path){
		jasmineFixture.preload(path);
		jasmineFixture.clearCSS();
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixture.loadHTML = function(path){
		jasmineFixture.preload(path);
		loadIntoContainer(readFromCache(path));
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
		return readFromCache(path);
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

	/**
	 * @param {String} css
	 */
	var appendStyle = function(css){
		var cssNode = jQuery("<style>");
		cssNode.text(css);
		styleNodes.push(cssNode);
		jQuery("head").append(cssNode);
	};

	/**
	 * @param {String} html
	 */
	var appendToContainer = function(html){
		var container = getContainer();
		container.append(html);
	};

	/**
	 * @param {String} path
	 * @return {String}
	 */
	var assembleUrl = function(path){
		return config.basePath + path;
	};

	/**
	 * @return {JQuery}
	 */
	var getContainer = function(){
		var currentContainer = jQuery("body").find("#" + config.containerId);
		if(currentContainer.length !== 0){
			return currentContainer;
		}
		else{
			var container = jQuery("<div>");
			container.attr("id", config.containerId);
			jQuery("body").append(container);
			return container;
		}
	};

	/**
	 * @param {String} html
	 */
	var loadIntoContainer = function(html){
		var container = getContainer();
		container.empty();
		container.append(html);
	};

	/**
	 * @param {String} path
	 * @return {String|Object}
	 */
	var readFromCache = function(path) {
		return jasmineFixture.cache[assembleUrl(path)];
	};

	/**
	 * @param {String} url
	 */
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

afterEach(function(){
	"use strict";
	jasmineFixture.clearCSS();
	jasmineFixture.clearHTML();
});