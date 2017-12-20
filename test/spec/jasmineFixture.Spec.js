describe("jasmineFixture", function(){

	"use strict";

	var firstHTML, secondHTML, firstJson;
	beforeEach(function(){
		firstHTML = "<div>Test1</div>";
		secondHTML = "<div>Test2</div>";
		firstJson = {
			"firstName": "ciccio",
			"lastName": "pasticcio"
		};
		jasmineFixture.setup({
			basePath: FIXTURES_BASE_PATH,
			containerId: "jasmine-fixtures"
		});
	});

	afterEach(function(){
		jasmineFixture.clearCache();
		jasmineFixture.setup({
			basePath: FIXTURES_BASE_PATH,
			containerId: "jasmine-fixtures"
		});
	});

	it("Requires Jasmine and jQuery in order to work", function(){
		expect(jasmine).toBeDefined();
		expect(jQuery).toBeDefined();
	});

	it("Lives inside its own namespace", function(){
		expect(jasmineFixture).toBeDefined();
	});

	describe(".version", function(){

		it("Reports the current version number", function(){
			expect(jasmineFixture.version).toBeDefined();
		});

	});

	describe(".cache", function(){

		it("Is a plain object", function(){
			expect(jQuery.isPlainObject(jasmineFixture.cache)).toEqual(true);
		});

		it("Contains no keys out of the box", function(){
			expect(Object.keys(jasmineFixture.cache).length).toEqual(0);
		});

		it("Contains one key for each retrieved fixture", function(){
			jasmineFixture.read("first.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(1);
			jasmineFixture.read("second.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(2);
		});

		it("Each key map an url to its content", function(){
			var basePath = jasmineFixture.setup().basePath;
			jasmineFixture.read("first.htm");
			expect(jasmineFixture.cache[basePath + "first.htm"]).toEqual(firstHTML);
			jasmineFixture.read("second.htm");
			expect(jasmineFixture.cache[basePath + "second.htm"]).toEqual(secondHTML);
		});

	});

	describe(".appendCSS()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixture, "preload");
				jasmineFixture.appendCSS("style.css");
				expect(jasmineFixture.preload).toHaveBeenCalledWith("style.css");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside a <style> tag located inside the <head>", function(){
				expect(jQuery("head style").length).toEqual(0);
				jasmineFixture.appendCSS("style.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixture.read("style.css"));
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("The content is added to pre-existing fixture content, if any", function(){
				jasmineFixture.appendCSS("style.css");
				jasmineFixture.appendCSS("more.css");
				expect(jQuery("head style").length).toEqual(2);
				expect(jQuery(jQuery("head style")[0]).text()).toEqual(jasmineFixture.read("style.css"));
				expect(jQuery(jQuery("head style")[1]).text()).toEqual(jasmineFixture.read("more.css"));
			});

		});

	});

	describe(".appendHTML()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixture, "preload");
				jasmineFixture.appendHTML("first.htm");
				expect(jasmineFixture.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Append the content of the given fixture inside the container", function(){
				jasmineFixture.appendHTML("first.htm");
				expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).html()).toEqual(firstHTML);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("The content is added to pre-existing fixture content, if any", function(){
				jasmineFixture.appendHTML("first.htm");
				jasmineFixture.appendHTML("second.htm");
				expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).html()).toEqual(firstHTML + secondHTML);
			});

		});

	});

	describe(".clearCache()", function(){

		it("Flush/clear the cache", function(){
			jasmineFixture.read("first.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(1);
			jasmineFixture.clearCache();
			expect(Object.keys(jasmineFixture.cache).length).toEqual(0);
		});

	});

	describe(".clearHTML()", function(){

		it("Remove the container from the <body>", function(){
			jasmineFixture.loadHTML("first.htm");
			expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).length).toEqual(1);
			jasmineFixture.clearHTML();
			expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).length).toEqual(0);
		});

	});

	describe(".loadCSS()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixture, "preload");
				jasmineFixture.loadCSS("style.css");
				expect(jasmineFixture.preload).toHaveBeenCalledWith("style.css");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside a <style> tag located inside the <head>", function(){
				expect(jQuery("head style").length).toEqual(0);
				jasmineFixture.loadCSS("style.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixture.read("style.css"));
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously loaded fixtures, if any", function(){
				jasmineFixture.loadCSS("style.css");
				jasmineFixture.loadCSS("more.css");
				expect(jQuery("head style").length).toEqual(1);
				expect(jQuery("head style").text()).toEqual(jasmineFixture.read("more.css"));
			});

		});

	});

	describe(".loadHTML()", function(){

		describe("First:", function(){

			it("Invokes .preload()", function(){
				spyOn(jasmineFixture, "preload");
				jasmineFixture.loadHTML("first.htm");
				expect(jasmineFixture.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Inject the content of the given fixture inside the container", function(){
				jasmineFixture.loadHTML("first.htm");
				expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).html()).toEqual(firstHTML);
			});

		});

		describe("If invoked more than once in a row:", function(){

			it("Will remove previously loaded fixtures, if any", function(){
				jasmineFixture.loadHTML("first.htm");
				jasmineFixture.loadHTML("second.htm");
				expect(jQuery("body").find("#" + jasmineFixture.setup().containerId).html()).toEqual(secondHTML);
			});

		});

	});

	describe(".preload()", function(){

		beforeEach(function(){
			spyOn(jQuery, "ajax").and.callThrough();
		});

		it("Put the content of the given fixture inside .cache", function(){
			var basePath = jasmineFixture.setup().basePath;
			expect(jasmineFixture.cache[basePath + "first.htm"]).not.toBeDefined();
			jasmineFixture.preload("first.htm");
			expect(jasmineFixture.cache[basePath + "first.htm"]).toEqual(firstHTML);
		});

		it("Accepts either a single string or an array of strings as its only argument", function(){
			var basePath = jasmineFixture.setup().basePath;
			jasmineFixture.preload("first.htm");
			jasmineFixture.preload(["first.htm", "second.htm", "person.json"]);
			expect(jasmineFixture.cache[basePath + "first.htm"]).toBeDefined();
			expect(jasmineFixture.cache[basePath + "second.htm"]).toBeDefined();
			expect(jasmineFixture.cache[basePath + "person.json"]).toBeDefined();
		});

		it("Invokes jQuery.ajax to retrieve the fixture", function(){
			jasmineFixture.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalled();
		});

		it("The configured basePath is prepend to each XHR request", function(){
			var basePath = jasmineFixture.setup().basePath;

			jasmineFixture.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledWith({
				url: basePath + "first.htm",
				async: false,
				cache: false
			});

			jasmineFixture.setup({basePath: "missingfolder/"});
			// Due to changed basePath this now points to a 404
			expect(function(){
				jasmineFixture.read("first.htm");
			}).toThrow();
		});

		it("Only one XHR call is executed if the same fixture is read multiple times", function(){
			jasmineFixture.preload("first.htm");
			jasmineFixture.preload("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(1);
			jasmineFixture.preload("second.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(2);
		});

		it("Throws an error if the XHR call fails", function(){
			expect(function(){
				jasmineFixture.read("missing.htm");
			}).toThrow();
		});

	});

	describe(".read()", function(){

		beforeEach(function(){
			spyOn(jasmineFixture, "preload").and.callThrough();
		});

		describe("First:", function(){

			it("Invokes .preload()", function(){
				jasmineFixture.read("first.htm");
				expect(jasmineFixture.preload).toHaveBeenCalledWith("first.htm");
			});

		});

		describe("Then:", function(){

			it("Returns the content of the given fixture", function(){
				expect(jasmineFixture.read("first.htm")).toEqual(firstHTML);
				expect(jasmineFixture.read("second.htm")).toEqual(secondHTML);
				expect(jasmineFixture.read("person.json")).toEqual(firstJson);
			});

		});

		describe("Relies on jQuery.ajax to guess the appropriate MIME type:", function(){

			it("CSS fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixture.read("style.css"))).toEqual("string");
			});

			it("HTML fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixture.read("first.htm"))).toEqual("string");
			});

			it("JSON fixtures are returned as Object", function(){
				expect(jQuery.type(jasmineFixture.read("person.json"))).toEqual("object");
			});

			it("Plain text fixtures are returned as String", function(){
				expect(jQuery.type(jasmineFixture.read("text.txt"))).toEqual("string");
			});

			it("XML fixtures are returned as XMLDocument", function(){
				// A bit of a dirty trick
				expect(jasmineFixture.read("person.xml").toString()).toEqual("[object XMLDocument]");
			});

		});

	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("basePath", function(){
				var config = jasmineFixture.setup();
				expect(config.basePath).toBeDefined();
			});

			it("containerId", function(){
				var config = jasmineFixture.setup();
				expect(config.containerId).toBeDefined();
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("basePath", function(){
				expect(jasmineFixture.setup({basePath: "newPath/"}).basePath).toEqual("newPath/");
			});

			it("containerId", function(){
				expect(jasmineFixture.setup({containerId: "newId"}).containerId).toEqual("newId");
			});

		});

		describe("If basePath is set without a trailing slash:", function(){

			it("One is added automatically", function(){
				expect(jasmineFixture.setup({basePath: "newPath"}).basePath).toEqual("newPath/");
			});

		});

	});

});