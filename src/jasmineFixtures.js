/* istanbul ignore else */
if(typeof(window.jasmineFixtures) === "undefined"){
	window.jasmineFixtures = {};
}

/**
 * @typedef {Object} jasmineFixtures.options
 *
 * @property {string} basePath        Base path for fixtures. Default to "fixtures/"
 * @property {string} containerId     Used as id attribute for the <div> where fixtures are loaded. Default to "jasmine-fixtures"
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
	 * @type {Object.<string, string>}
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
	 * @param {string} path
	 */
	jasmineFixtures.appendCSS = function(path){
		jasmineFixtures.preload(path);
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {string} path
	 */
	jasmineFixtures.appendHTML = function(path){
		jasmineFixtures.preload(path);
		appendToContainer(readFromCache(path));
	};

	/**
	 * @param {string} path
	 */
	jasmineFixtures.loadCSS = function(path){
		jasmineFixtures.preload(path);
		jasmineFixtures.clearCSS();
		appendStyle(readFromCache(path));
	};

	/**
	 * @param {string} path
	 */
	jasmineFixtures.loadHTML = function(path){
		jasmineFixtures.preload(path);
		loadIntoContainer(readFromCache(path));
	};

	/**
	 * @param {string|Array.<string>} path
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
	 * @param {string} path
	 * @return {string|Object}
	 */
	jasmineFixtures.read = function(path){
		jasmineFixtures.preload(path);
		return readFromCache(path);
	};

	/**
	 * @param {string} css
	 */
	jasmineFixtures.setCSS = function(css){
		jasmineFixtures.clearCSS();
		appendStyle(css);
	};

	/**
	 * @param {string} html
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
	 * @param {string} css
	 */
	const appendStyle = function(css){
		const cssNode = document.createElement("style");
		cssNode.innerHTML = css;
		styleNodes.push(cssNode);
		document.querySelector("head").appendChild(cssNode);
	};

	/**
	 * @param {string} html
	 */
	const appendToContainer = function(html){
		const container = getContainer();
		container.innerHTML += html;
	};

	/**
	 * @param {string} path
	 * @return {string}
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
	 * @param {string} html
	 */
	const loadIntoContainer = function(html){
		const container = getContainer();
		container.innerHTML = html;
	};

	/**
	 * @param {string} path
	 * @return {string|Object}
	 */
	const readFromCache = function(path){
		return jasmineFixtures.cache[assembleUrl(path)];
	};

	jasmineFixtures.failure = function(url, status){
		throw ("Failed to retrieve fixture at: " + url + " (status: " + status + ")");
	};

	/**
	 * @param {string} url
	 */
	const readIntoCache = function(url){

		const xhrOptions = {
			success: function(response){
				if(response.responseXML !== null){
					jasmineFixtures.cache[url] = response.responseXML;
				}
				else if(jasmineFixtures.isJson(response.responseText) === true){
					jasmineFixtures.cache[url] = JSON.parse(response.responseText);
				}
				else{
					jasmineFixtures.cache[url] = response.responseText;
				}
			},
			error: function(response){
				jasmineFixtures.failure(url, response.status);
			}
		};
		const xhr = new jasmineFixtures.xhr.Request(xhrOptions);

		xhr.send(url);
	};

	/**
	 * Since we use sync XHR, we can't rely on responseType being available (it's always an empty string)
	 * So we need to use some heuristic to understand if what we've got is JSON or not
	 * This is not the most efficient, but does the job and covers plenty of cases (see unit tests)
	 * @param {*} item
	 * @return {boolean}
	 */
	jasmineFixtures.isJson = function(item){
		item = typeof item !== "string" ? JSON.stringify(item) : item;
		try{
			item = JSON.parse(item);
		}
		catch(e){
			return false;
		}
		if(typeof item === "object" && item !== null){
			return true;
		}
		return false;
	};

	/* XHR */

	/**
	 * @typedef {Object} jasmineFixtures.xhr.response
	 *
	 * @property {number}       status              Status code returned by the HTTP server
	 * @property {string}       statusText          The response string returned by the HTTP server
	 * @property {string|null}  responseText        The response as text, null if the request was unsuccessful
	 * @property {string|null}  responseXML         The response as text, null if the request was unsuccessful or cannot be parsed as XML or HTML
	 */

	jasmineFixtures.xhr = {};

	jasmineFixtures.xhr.Request = function(options){
		const self = this;
		self.xhr = new XMLHttpRequest();

		/**
		 * @return {jasmineFixtures.xhr.response}
		 */
		const assembleResponse = function(){
			return {
				status: self.xhr.status,
				statusText: self.xhr.statusText,
				responseText: self.xhr.responseText,
				responseXML: self.xhr.responseXML
			};
		};

		const checkReadyState = function(){
			/* istanbul ignore else */
			if(self.xhr.readyState === 4){
				const httpStatus = self.xhr.status;
				if((httpStatus >= 200 && httpStatus <= 300) || (httpStatus === 304)){
					options.success(assembleResponse());
				}
				else{
					options.error(assembleResponse());
				}
			}
		};

		/**
		 * @param {string} url
		 */
		this.send = function(url){
			self.xhr.open("GET", url, false);
			self.xhr.onreadystatechange = checkReadyState;
			self.xhr.send(null);
		};

	};

}());

jasmine.getEnv().afterEach(function(){
	"use strict";
	jasmineFixtures.clearCSS();
	jasmineFixtures.clearHTML();
});