describe("jasmineFixture", function(){

	"use strict";

	var firstText, secondText;
	beforeEach(function(){
		firstText = "<div>Test1</div>";
		secondText = "<div>Test2</div>";
	});

	afterEach(function(){
		jasmineFixture.clearCache();
		jasmineFixture.setup({basePath: "fixtures/"});
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
			jasmineFixture.readFixture("first.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(1);
			jasmineFixture.readFixture("second.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(2);
		});

		it("Each key map an url to its response text", function(){
			jasmineFixture.readFixture("first.htm");
			expect(jasmineFixture.cache["fixtures/first.htm"]).toEqual(firstText);
			jasmineFixture.readFixture("second.htm");
			expect(jasmineFixture.cache["fixtures/second.htm"]).toEqual(secondText);
		});

	});

	describe(".clearCache()", function(){

		it("Flush/clear the cache", function(){
			jasmineFixture.readFixture("first.htm");
			expect(Object.keys(jasmineFixture.cache).length).toEqual(1);
			jasmineFixture.clearCache();
			expect(Object.keys(jasmineFixture.cache).length).toEqual(0);
		});

	});

	describe(".readFixture()", function(){

		beforeEach(function(){
			spyOn(jQuery, "ajax").and.callThrough();
		});

		it("Returns the given fixture as string", function(){
			expect(jasmineFixture.readFixture("first.htm")).toEqual(firstText);
			expect(jasmineFixture.readFixture("second.htm")).toEqual(secondText);
			expect(jQuery.type(jasmineFixture.readFixture("first.htm"))).toEqual("string");
		});

		it("Invokes jQuery.ajax to retrieve the fixture", function(){
			jasmineFixture.readFixture("first.htm");
			expect(jQuery.ajax).toHaveBeenCalled();
		});

		it("The configured basePath is prepend to each XHR request", function(){
			jasmineFixture.readFixture("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledWith({
				url: "fixtures/first.htm",
				async: false,
				cache: false
			});

			jQuery.ajax.calls.reset();
			jasmineFixture.setup({basePath: "fixtures/subfolder/"});
			jasmineFixture.readFixture("nested.htm");
			expect(jQuery.ajax).toHaveBeenCalledWith({
				url: "fixtures/subfolder/nested.htm",
				async: false,
				cache: false
			});
			// Due to changed basePath this now points to a 404
			expect(function(){
				jasmineFixture.readFixture("first.htm");
			}).toThrow();
		});

		it("Only one XHR call is executed if the same fixture is read multiple times", function(){
			jasmineFixture.readFixture("first.htm");
			jasmineFixture.readFixture("first.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(1);
			jasmineFixture.readFixture("second.htm");
			expect(jQuery.ajax).toHaveBeenCalledTimes(2);
		});

		it("Throws an error if the XHR call fails", function(){
			expect(function(){
				jasmineFixture.readFixture("missing.htm");
			}).toThrow();
		});

	});

	describe(".setup()", function(){

		describe("If called with no arguments. Return an object containing name/value pairs:", function(){

			it("basePath = fixtures/", function(){
				expect(jasmineFixture.setup().basePath).toEqual("fixtures/");
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