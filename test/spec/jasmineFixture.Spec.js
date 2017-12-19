describe("jasmineFixture", function(){

	"use strict";

	var firstText, secondText;
	beforeEach(function(){
		firstText = "<div>Test1</div>";
		secondText = "<div>Test2</div>";
	});

	afterEach(function(){
		jasmineFixture.clearCache();
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

});