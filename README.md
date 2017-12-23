# jasmineFixtures

A set of API for handling HTML, CSS, JSON, XML and plain text fixtures in your [Jasmine](http://jasmine.github.io/) specs

Heavily inspired by [jasmine-jquery](https://github.com/velesin/jasmine-jquery) it provides a simple, lean alternative for a smaller set of features

## Installation

Either:

- Simply download _jasmineFixtures.min.js_ from [here](https://raw.github.com/MassimoFoti/jasmineFixtures/master/dist/jasmineFixtures.min.js) and include it in your Jasmine's test runner file. Remember to also include jQuery
- Use Bower ```bower install jasmineFixtures```

## Fixtures

Allows you to read content from the file system to be used by your tests:

In _myfixture.txt_:

```html
Whatever here
```

Inside your test:

```js
var fixtureStr = jasmineFixtures.read("myfixture.txt");
runMyCodeHere();
expect(myVar).toEqual(fixtureStr);
```

By default, fixtures are loaded from `fixtures/`.
You can change configuration using: `jasmineFixtures.setup({basePath: "newPath/"});`.

> _Note:_
> If you are running your test with **Karma**, remember that your files are served from a `base/` directory,
> so your path should be configured to: `jasmineFixtures.setup({basePath: "base/newPath/"});`.

Fixtures are internally cached, so you can load the same fixture file multiple times without affecting your test suite's speed.

The following methods are provided:

- `jasmineFixtures.read(path)` Returns the content of the given fixture
  - CSS fixtures are returned as String
  - HTML fixtures are returned as String
  - JSON fixtures are returned as Object
  - Plain text fixtures are returned as String
  - XML fixtures are returned as XMLDocument
  
- `jasmineFixtures.preload(path[, path, ...])`
  - Pre-loads fixture(s) from one or more files and stores them into cache, without returning them or appending them to the DOM. All subsequent calls will then get fixtures content from cache, without making any XHR calls (unless cache is manually purged by using `jasmineFixtures.clearCache()` method).
  
- `jasmineFixtures.clearCache()`
  - Flush/clear the cache 

## HTML Fixtures

Allows you to load HTML content to be used by your tests:

In _myfixture.htm_:

```html
<div id="my-fixture">whatever here</div>
```

Inside your test:

```js
jasmineFixtures.loadHTML("myfixture.htm");
runMyCodeHere();
expect($("#my-fixture")).to...
```

The fixture will be loaded into the `<div id="jasmine-fixtures"></div>` container that is automatically added to the DOM (you can change the configured id using: `jasmineFixtures.setup({containerId: "newId"});`). The fixtures container is automatically cleaned-up between tests, so you don't have to worry about left-overs from fixtures loaded in preceeding test.

The following methods are provided:

- `jasmineFixtures.appendHTML(path)`
  - Append the content of the given fixture inside the container. Already existing content, if any, is left untouched
  
- `jasmineFixtures.loadHTML(path)`
  - Load the content of the given fixture inside the container. Already existing content, if any, is removed
  
- `jasmineFixtures.setHTML(html)`
  - Load the the given HTML, passed as string, inside the container. Without any XHR call. Already existing content, if any, is removed  
  
## CSS Fixtures 

Allows you to load CSS content on the page while testing.

The fixture will be loaded into the `<head></head>`

The following methods are provided:

- `jasmineFixtures.appendCSS(path)`
  - Append the content of the given fixture inside the `<head>`. Already existing content, if any, is left untouched
  
- `jasmineFixtures.loadCSS(path)`
  - Load the content of the given fixture inside the `<head>`. Already existing content, if any, is removed

- `jasmineFixtures.setCSS(css)`
  - Load the content of the given CSS, passed as string, inside the `<head>`. Already existing content, if any, is removed

## Mocking with jasmine-ajax

[jasmine-ajax](https://github.com/jasmine/jasmine-ajax) library overrides XMLHttpRequest automatically when `jasmine.Ajax.install()` is called. 
This breaks jasmine-fixtures as fixture loading mechanism uses jQuery.ajax, that stops working once the mock is installed. 

A workaround for this may be to invoke `jasmineFixtures.preload` function (specifying all required fixtures) before jasmine-ajax is loaded. 
This way subsequent calls to load or read methods will retrieve fixtures content from cache, without need to use jQuery.ajax and thus will work correctly even after jasmine-ajax is loaded.

As an alternative you can call jasmineFixtures before `jasmine.Ajax.install()` is invoked.

## Loading subresources

jasmineFixtures will not load any subresources contained inside the fixtures such as scripts, stylesheets, or iframes. 

## Looking for additional matchers for Jasmine?

Take a look at [jasmineMatchers](https://github.com/MassimoFoti/jasmineMatchers)