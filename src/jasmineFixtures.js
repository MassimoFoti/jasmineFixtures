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

	jasmineFixtures.version = "1.0";

	/**
	 * @type {jasmineFixtures.options}
	 */
	const config = {
		basePath: "fixtures/",
		containerId: "jasmine-fixtures"
	};

	/**
	 * @type {Array.<HTMLElement>}
	 */
	const styleNodes = [];

	/**
	 * @type {Object.<String, String>}
	 */
	jasmineFixtures.cache = {};

	jasmineFixtures.clearCache = function(){
		jasmineFixtures.cache = {};
	};

	jasmineFixtures.clearCSS = function(){
		styleNodes.forEach(function(element){
			if(element.parentNode !== null){
				element.parentNode.removeChild(element);
			}
		});
	};

	jasmineFixtures.clearHTML = function(){
		const container = getContainer();
		container.parentNode.removeChild(container);
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
		if(typeof path === "string"){
			path = [path];
		}
		path.forEach(function(element){
			const fullUrl = assembleUrl(element);
			if(jasmineFixtures.cache[fullUrl] === undefined){
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
	 * Change/retrieve current configuration
	 * @param {jasmineFixtures.options} [options]
	 * @return {jasmineFixtures.options}
	 */
	jasmineFixtures.setup = function(options){
		if(options !== undefined){
			if(options.containerId !== undefined){
				config.containerId = options.containerId;
			}
			if(options.basePath !== undefined){
				config.basePath = options.basePath;
			}
			// Ensure we always have a trailing slash
			if(config.basePath[config.basePath.length - 1] !== "/"){
				config.basePath += "/";
			}
		}
		return config;
	};

	/**
	 * @param {String} css
	 */
	const appendStyle = function(css){
		const cssNode = document.createElement("style");
		cssNode.innerHTML = css;
		styleNodes.push(cssNode);
		document.querySelector("head").appendChild(cssNode);
	};

	/**
	 * @param {String} html
	 */
	const appendToContainer = function(html){
		const container = getContainer();
		container.innerHTML += html;
	};

	/**
	 * @param {String} path
	 * @return {String}
	 */
	const assembleUrl = function(path){
		return config.basePath + path;
	};

	/**
	 * @return {HTMLElement}
	 */
	const getContainer = function(){
		const currentContainer = document.getElementById(config.containerId);
		if(currentContainer !== null){
			return currentContainer;
		}
		else{
			const container = document.createElement("div");
			container.setAttribute("id", config.containerId);
			document.body.appendChild(container);
			return container;
		}
	};

	/**
	 * @param {String} html
	 */
	const loadIntoContainer = function(html){
		const container = getContainer();
		container.innerHTML = html;
	};

	/**
	 * @param {String} path
	 * @return {String|Object}
	 */
	const readFromCache = function(path){
		return jasmineFixtures.cache[assembleUrl(path)];
	};

	/**
	 * @param {String} url
	 */
	const readIntoCache = function(url){
		jQuery.ajax({
			url: url,
			async: false, // Must be synchronous to ensure fixtures are loaded before test run
			cache: false,
			method: "GET"
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