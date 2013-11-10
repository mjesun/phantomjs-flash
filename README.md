PhantomJs Flash faker
=====================

PhantomJS-Flash is a small snippet for faking Flash support inside PhantomJS. It works by overriding the `navigator`
object (although all of its properties remain untouched), and faking the `mimeTypes` and `plugins` object. This will cause
libraries like **SWFObject** to think that Flash support is available.

Usage
-----

You only need to call the `flash` method in the `onInitialized` callback, passing the page object to the function. As a
result you will get a boolean value, indicating if the process went well or not. This will let you bypass the flash
detections, although it will not fake a real Flash object. If you need real Flash support, you should use a solution like
the [Ryan Bridges one](https://github.com/r3b/phantomjs).

Example
-------

```js
"use strict";

var webpage = require('webpage');
var flash = require('./flash');
var page = webpage.create();

page.onInitialized = function() {
    console.log('Flash successfully faked: ' + flash(page));
};
```
