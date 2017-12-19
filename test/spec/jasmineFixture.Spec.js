describe("jasmineFixture", function(){

	"use strict";

	var firstText, secondText, firstJson;
	beforeEach(function(){
		firstText = "<div>Test1</div>";
		secondText = "<div>Test2</div>";
		firstJson = {
			"firstName": "ciccio",
			"lastName": "pasticcio"
		};
		jasmineFixture.setup({basePath: FIXTURES_BASE_PATH});
	});

	afterEach(function(){
		jasmineFixture.clearCache();
		jasmineFixture.setup({basePath: FIXTURES_BASE_PATH});
	});

	it("Requires jQuery in order to work", function(){
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
			expect(jasmineFixture.cache[basePath + "first.htm"]).toEqual(firstText);
			jasmineFixture.read("second.htm");
			expect(jasmineFixture.cache[basePath + "second.htm"]).toEqual(secondText);
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

	describe(".read()", function(){

		beforeEach(function(){
			spyOn(jQuery, "ajax").and.callThrough();
		});

		it("Returns the content of the given fixture", function(){
			expect(jasmineFixture.read("first.htm")).toEqual(firstText);
			expect(jasmineFixture.read("second.htm")).toEqual(secondText);
			expect(jasmineFixture.read("first.json")).toEqual(firstJson);
		});

		it("Invokes jQuery.ajax to retrieve the fixture", function(){
			jasmineFixture.read("first.htm");
			expect(jQuery.ajax).toHaveBeenCalled();
		});

		it("The configured basePath is prepend to each XHR request", function(){

			var basePath = jasmineFixture.setup().basePath;

			jasmineFixture.read("first.htm");
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
			jasmineFixture.read("first.htm");
			jasmineFixture.read("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(1);
			jasmineFixture.read("second.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(2);
		});

		it("Throws an error if the XHR call fails", function(){
			expect(function(){
				jasmineFixture.read("missing.htm");
			}).toThrow();
		});

		describe("Relies on jQuery.ajax to guess the appropriate MIME type:", function(){

			it("HTML fixtures are returned as strings", function(){
				expect(jQuery.type(jasmineFixture.read("first.htm"))).toEqual("string");
			});

			it("JSON fixtures are returned as objects", function(){
				expect(jQuery.type(jasmineFixture.read("first.json"))).toEqual("object");
			});

		});


	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("basePath", function(){
				var config = jasmineFixture.setup();
				expect(config.basePath).toBeDefined();
			});

		});

		describe("If a set of name/value pairs is passed as argument. Set the following configuration options:", function(){

			it("basePath", function(){
				expect(jasmineFixture.setup({basePath: "newPath/"}).basePath).toEqual("newPath/");
			});

		});

		describe("If a basepath is set without a trailing slash:", function(){

			it("One is added automatically", function(){
				expect(jasmineFixture.setup({basePath: "newPath"}).basePath).toEqual("newPath/");
			});

		});

	});

});