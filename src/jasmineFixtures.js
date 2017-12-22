/* istanbul ignore if */
if(typeof(jQuery) === "undefined"){
	throw("Unable to find jQuery");
}

/* istanbul ignore else */
if(typeof(window.jasmineFixtures) === "undefined"){
	window.jasmineFixtures = {};
}

/**
 * @typedef {Object} jasmineFixtures.options
 *
 * @property {String} basePath        Base path for fixtures. Default to "fixtures/"
 * @property {String} containerId     Used as id attribute for the <div> where fixtures are loaded. Default to "jasmine-fixtures"
 */

(function(){
	"use strict";

	jasmineFixtures.version = "0.3";

	/**
	 * @type {jasmineFixtures.options}
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
	jasmineFixtures.cache = {};

	jasmineFixtures.clearCache = function(){
		jasmineFixtures.cache = {};
	};

	jasmineFixtures.clearCSS = function(){
		styleNodes.forEach(function(element){
			element.remove();
		});
	};

	jasmineFixtures.clearHTML = function(){
		getContainer().remove();
	};

	/**
	 * @param {String} path
	 */
	jasmineFixtures.appendCSS = function(path){
		jasmineFixtures.preload(path);
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixtures.appendHTML = function(path){
		jasmineFixtures.preload(path);
		appendToContainer(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixtures.loadCSS = function(path){
		jasmineFixtures.preload(path);
		jasmineFixtures.clearCSS();
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {String} path
	 */
	jasmineFixtures.loadHTML = function(path){
		jasmineFixtures.preload(path);
		loadIntoContainer(readFromCache(path));
	};

	/**
	 * @param {String|Array.<String>} path
	 */
	jasmineFixtures.preload = function(path){
		if(jQuery.type(path) === "string"){
			path = [path];
		}
		path.forEach(function(element){
			var fullUrl = assembleUrl(element);
			if(jQuery.type(jasmineFixtures.cache[fullUrl]) === "undefined"){
				readIntoCache(fullUrl);
			}
		});
	};

	/**
	 * @param {String} path
	 * @return {String|Object}
	 */
	jasmineFixtures.read = function(path){
		jasmineFixtures.preload(path);
		return readFromCache(path);
	};

	/**
	 * @param {String} css
	 */
	jasmineFixtures.setCSS = function(css){
		jasmineFixtures.clearCSS();
		appendStyle(css);
	};

	/**
	 * @param {String} html
	 */
	jasmineFixtures.setHTML = function(html){
		loadIntoContainer(html);
	};

	/**
	 * Change¨/retrieve current configuration
	 * @param {jasmineFixtures.options} [options]
	 * @return {jasmineFixtures.options}
	 */
	jasmineFixtures.setup = function(options){
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
	var readFromCache = function(path){
		return jasmineFixtures.cache[assembleUrl(path)];
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
			jasmineFixtures.cache[url] = data;
		}).fail(function(jqXHR){
			throw ("Failed to retrieve fixture at: " + url + " (status: " + jqXHR.status + ")");
		});
	};

}());

jasmine.getEnv().afterEach(function(){
	"use strict";
	jasmineFixtures.clearCSS();
	jasmineFixtures.clearHTML();
});