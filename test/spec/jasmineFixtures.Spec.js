describe("jasmineFixtures", function(){

	"use strict";

	var firstHTML, secondHTML, firstJson;
	beforeEach(function(){
		firstHTML = "<div>Test1</div>";
		secondHTML = "<div>Test2</div>";
		firstJson = {
			"firstName": "ciccio",
			"lastName": "pasticcio"
		};
	});

	afterEach(function(){
		jasmineFixtures.clearCache();
	});

	it("Requires Jasmine and jQuery in order to work", function(){
		expect(jasmine).toBeDefined();
		expect(jQuery).toBeDefined();
	});

	it("Lives inside its own namespace", function(){
		expect(jasmineFixtures).toBeDefined();
	});

	describe(".version", function(){

		it("Reports the current version number", function(){
			expect(jasmineFixtures.version).toBeDefined();
		});

	});

	describe(".cache", function(){

		it("Is a plain object", function(){
			expect(jQuery.isPlainObject(jasmineFixtures.cache)).toEqual(true);
		});

		it("Contains no keys out of the box", function(){
			expect(Object.keys(jasmineFixtures.cache).length).toEqual(0);
		});

		it("Contains one key for each retrieved fixture", function(){
			jasmineFixtures.read("first.htm");
			expect(Object.keys(jasmineFixtures.cache).length).toEqual(1);
			jasmineFixtures.read("second.htm");
			expect(Object.keys(jasmineFixtures.cache).length).toEqual(2);
		});

		it("Each key map an url to its content", function(){
			var basePath = jasmineFixtures.setup().basePath;
			jasmineFixtures.read("first.htm");
			expect(jasmineFixtures.cache[basePath + "first.htm"]).toEqual(firstHTML);
			jasmineFixtures.read("second.htm");
			expect(jasmineFixtures.cache[basePath + "second.htm"]).toEqual(secondHTML);
		});

	});

	describe(".appendCSS()", function(){

		beforeEach(function(){
			// Just to be sure we start fresh
			jQuery("head style").remove();
		});

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixtures, "preload");
				jasmineFixtures.appendCSS("style.css");
				expect(jasmineFixtures.preload).toHaveBeenCalledWith("style.css");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside a <style> tag located inside the <head>", function(){
				expect(jQuery("head style").length).toEqual(0);
				jasmineFixtures.appendCSS("style.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixtures.read("style.css"));
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("The content is added to pre-existing fixture content, if any", function(){
				jasmineFixtures.appendCSS("style.css");
				jasmineFixtures.appendCSS("more.css");
				expect(jQuery("head style").length).toEqual(2);
				expect(jQuery(jQuery("head style")[0]).text()).toEqual(jasmineFixtures.read("style.css"));
				expect(jQuery(jQuery("head style")[1]).text()).toEqual(jasmineFixtures.read("more.css"));
			});

		});

	});

	describe(".appendHTML()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixtures, "preload");
				jasmineFixtures.appendHTML("first.htm");
				expect(jasmineFixtures.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Append the content of the given fixture inside the container", function(){
				jasmineFixtures.appendHTML("first.htm");
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(firstHTML);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("The content is added to pre-existing fixture content, if any", function(){
				jasmineFixtures.appendHTML("first.htm");
				jasmineFixtures.appendHTML("second.htm");
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(firstHTML + secondHTML);
			});

		});

	});

	describe(".clearCache()", function(){

		it("Flush/clear the cache", function(){
			jasmineFixtures.read("first.htm");
			expect(Object.keys(jasmineFixtures.cache).length).toEqual(1);
			jasmineFixtures.clearCache();
			expect(Object.keys(jasmineFixtures.cache).length).toEqual(0);
		});

	});

	describe(".clearHTML()", function(){

		it("Remove the container from the <body>", function(){
			jasmineFixtures.loadHTML("first.htm");
			expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).length).toEqual(1);
			jasmineFixtures.clearHTML();
			expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).length).toEqual(0);
		});

	});

	describe(".loadCSS()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixtures, "preload");
				jasmineFixtures.loadCSS("style.css");
				expect(jasmineFixtures.preload).toHaveBeenCalledWith("style.css");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside a <style> tag located inside the <head>", function(){
				expect(jQuery("head style").length).toEqual(0);
				jasmineFixtures.loadCSS("style.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixtures.read("style.css"));
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously loaded fixtures, if any", function(){
				jasmineFixtures.loadCSS("style.css");
				jasmineFixtures.loadCSS("more.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixtures.read("more.css"));
			});

		});

	});

	describe(".loadHTML()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixtures, "preload");
				jasmineFixtures.loadHTML("first.htm");
				expect(jasmineFixtures.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside the container", function(){
				jasmineFixtures.loadHTML("first.htm");
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(firstHTML);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously loaded fixtures, if any", function(){
				jasmineFixtures.loadHTML("first.htm");
				jasmineFixtures.loadHTML("second.htm");
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(secondHTML);
			});

		});

	});

	describe(".preload()", function(){

		beforeEach(function(){
			spyOn(jQuery, "ajax").and.callThrough();
		});

		it("Put the content of the given fixture inside .cache", function(){
			var basePath = jasmineFixtures.setup().basePath;
			expect(jasmineFixtures.cache[basePath + "first.htm"]).not.toBeDefined();
			jasmineFixtures.preload("first.htm");
			expect(jasmineFixtures.cache[basePath + "first.htm"]).toEqual(firstHTML);
		});

		it("Accepts either a single string or an array of strings as its only argument", function(){
			var basePath = jasmineFixtures.setup().basePath;
			jasmineFixtures.preload("first.htm");
			jasmineFixtures.preload(["first.htm", "second.htm", "person.json"]);
			expect(jasmineFixtures.cache[basePath + "first.htm"]).toBeDefined();
			expect(jasmineFixtures.cache[basePath + "second.htm"]).toBeDefined();
			expect(jasmineFixtures.cache[basePath + "person.json"]).toBeDefined();
		});

		it("Invokes jQuery.ajax to retrieve the fixture", function(){
			jasmineFixtures.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalled();
		});

		it("The configured basePath is prepend to each XHR request", function(){
			var basePath = jasmineFixtures.setup().basePath;

			jasmineFixtures.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledWith({
				url: basePath + "first.htm",
				async: false,
				cache: false,
				method: "GET"
			});

			jasmineFixtures.setup({basePath: "missingfolder/"});
			// Due to changed basePath this now points to a 404
			expect(function(){
				jasmineFixtures.read("first.htm");
			}).toThrow();
		});

		it("Only one XHR call is executed if the same fixture is read multiple times", function(){
			jasmineFixtures.preload("first.htm");
			jasmineFixtures.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(1);
			jasmineFixtures.preload("second.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(2);
		});

		it("Throws an error if the XHR call fails", function(){
			expect(function(){
				jasmineFixtures.read("missing.htm");
			}).toThrow();
		});

	});

	describe(".read()", function(){

		beforeEach(function(){
			spyOn(jasmineFixtures, "preload").and.callThrough();
		});

		describe("First:", function(){

			it("Invokes .preload()", function(){
				jasmineFixtures.read("first.htm");
				expect(jasmineFixtures.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Returns the content of the given fixture", function(){
				expect(jasmineFixtures.read("first.htm")).toEqual(firstHTML);
				expect(jasmineFixtures.read("second.htm")).toEqual(secondHTML);
				expect(jasmineFixtures.read("person.json")).toEqual(firstJson);
			});

		});

		describe("Relies on jQuery.ajax to guess the appropriate MIME type:", function(){

			it("CSS fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixtures.read("style.css"))).toEqual("string");
			});

			it("HTML fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixtures.read("first.htm"))).toEqual("string");
			});

			it("JSON fixtures are returned as Object", function(){
				expect(jQuery.type(jasmineFixtures.read("person.json"))).toEqual("object");
			});

			it("Plain text fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixtures.read("text.txt"))).toEqual("string");
			});

			it("XML fixtures are returned as XMLDocument", function(){
				// A bit of a dirty trick
				expect(jasmineFixtures.read("person.xml").toString()).toEqual("[object XMLDocument]");
			});

		});

	});

	describe(".setCSS()", function(){

		describe("Given a chunk of CSS as string:", function(){

			it("Inject the content of the given string inside a <style> tag located inside the <head>", function(){
				var cssStr = jasmineFixtures.read("style.css");
				expect(jQuery("head style").length).toEqual(0);
				jasmineFixtures.setCSS(cssStr);
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(cssStr);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously injected/loaded CSS, if any", function(){
				var firstStr = jasmineFixtures.read("style.css");
				var secondStr = jasmineFixtures.read("more.css");
				jasmineFixtures.setCSS(firstStr);
				jasmineFixtures.setCSS(secondStr);
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(secondStr);
			});

		});

	});

	describe(".setHTML()", function(){

		describe("Given a chunk of HTML as string:", function(){

			it("Inject the content of the given string inside the container", function(){
				jasmineFixtures.setHTML(firstHTML);
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(firstHTML);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously injected/loaded HTML, if any", function(){
				jasmineFixtures.setHTML(firstHTML);
				jasmineFixtures.setHTML(secondHTML);
				expect(jQuery("body").find("#" + jasmineFixtures.setup().containerId).html()).toEqual(secondHTML);
			});

		});

	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("basePath", function(){
				var config = jasmineFixtures.setup();
				expect(config.basePath).toBeDefined();
			});

			it("containerId", function(){
				var config = jasmineFixtures.setup();
				expect(config.containerId).toBeDefined();
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("basePath", function(){
				expect(jasmineFixtures.setup({basePath: "newPath/"}).basePath).toEqual("newPath/");
			});

			it("containerId", function(){
				expect(jasmineFixtures.setup({containerId: "newId"}).containerId).toEqual("newId");
			});

		});

		describe("If basePath is set without a trailing slash:", function(){

			it("One is added automatically", function(){
				expect(jasmineFixtures.setup({basePath: "newPath"}).basePath).toEqual("newPath/");
			});

		});

	});

});