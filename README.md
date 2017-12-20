# jasmine-fixture

A set of API for handling HTML, CSS, JSON, XML and plain text fixtures in your [Jasmine](http://jasmine.github.io/) specs

## Installation

Either:

- Download _jasmine-fixture.js_ from [here](https://raw.github.com/MassimoFoti/jasmine-fixture/master/dist/jasmine-fixture.min.js) and include it in your Jasmine's test runner file. Remember to also include jQuery
- Use Bower ```bower install jasmine-fixture```

## Fixtures

By default, fixtures are loaded from `fixtures/`.
You can change configuration using: `jasmineFixture.setup({basePath: "newPath/"});`.

> _Note:_
> If you are running your test with **Karma**, remember that your files are served from a `base/` directory,
> so your path should be configured to: `jasmineFixture.setup({basePath: "base/newPath/"});`.

Fixtures are internally cached, so you can load the same fixture file multiple times without affecting your test suite's speed.

The following methods are provided:

- `jasmineFixture.read(path)` Returns the content of the given fixture
  - CSS fixtures are returned as String
  - HTML fixtures are returned as String
  - JSON fixtures are returned as Object
  - Plain text fixtures are returned as String
  - XML fixtures are returned as XMLDocument
  
- `jasmineFixture.preload(path[, path, ...])`
  - Pre-loads fixture(s) from one or more files and stores them into cache, without returning them or appending them to the DOM. All subsequent calls will then get fixtures content from cache, without making any XHR calls (unless cache is manually purged by using `jasmineFixture.clearCache` method).
  
- `jasmineFixture.clearCache()`
  - Flush/clear the cache 

## HTML Fixtures

Allows you to load HTML content to be used by your tests:

In _myfixture.htm_:

```html
<div id="my-fixture">whatever here</div>
```

Inside your test:

```js
jasmineFixture.loadHTML("myfixture.htm");
runMyCodeHere();
expect($("#my-fixture")).to...
```

The fixture will be loaded into the `<div id="jasmine-fixtures"></div>` container that is automatically added to the DOM (you can change configuration using: `jasmineFixture.setup({containerId: "newId"});`). The fixtures container is automatically cleaned-up between tests, so you don't have to worry about left-overs from fixtures loaded in preceeding test.

The following methods are provided:

- `jasmineFixture.appendHTML(path)`
  - Append the content of the given fixture inside the container. Already existing content, if any, is left untouched
  
- `jasmineFixture.loadHTML(path)`
  - Load the content of the given fixture inside the container. Already existing content, if any, is removed
  
## CSS Fixtures 

Allows you to load CSS content on the page while testing.

The fixture will be loaded into the `<head></head>`

The following methods are provided:

- `jasmineFixture.appendCSS(path)`
  - Append the content of the given fixture inside the <head>. Already existing content, if any, is left untouched
  
- `jasmineFixture.loadCSS(path)`
  - Load the content of the given fixture inside the <head>. Already existing content, if any, is removed

## Mocking with jasmine-ajax

[jasmine-ajax](https://github.com/jasmine/jasmine-ajax) library doesn't let user to manually start/stop XMLHttpRequest mocking, but instead it overrides XMLHttpRequest automatically when loaded. This breaks jasmine-fixtures as fixture loading mechanism uses jQuery.ajax, that stops working the very moment jasmine-ajax is loaded. A workaround for this may be to invoke `jasmineFixture.preload` function (specifying all required fixtures) before jasmine-ajax is loaded. This way subsequent calls to load or read methods will retrieve fixtures content from cache, without need to use jQuery.ajax and thus will work correctly even after jasmine-ajax is loaded.
