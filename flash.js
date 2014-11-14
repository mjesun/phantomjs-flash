"use strict";


function fakeObject(object, override) {
	var exclude = Object.keys(override);
	var prototype = Object.create(Object.getPrototypeOf(object));
	var constructor = function() {};
	var instance;
	var key;

	constructor.prototype = prototype;
	copy = new constructor();

	for (key in navigator) {
		if ((object.hasOwnProperty(key) === true) && (exclude.indexOf(key) === -1)) {
			Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(object, key));
		}
	}

	exclude.forEach(function(key) {
		var descriptor = Object.getOwnPropertyDescriptor(object, key);

		if (descriptor) {
			delete descriptor.get;
			delete descriptor.set;

		} else {
			descriptor = {
				'writable': true,
				'enumerable': true,
				'configurable': true
			};
		}

		descriptor.value = override[key];
		Object.defineProperty(copy, key, descriptor);
	});

	return copy;
}


function flash(page) {
	return page.evaluate(function(fakeObject) {
		try {
			var mimeTypes;
			var plugins;
			var mime;
			var plugin;

			// Create fake MIME and plug-in objects.
			mime = {
				'description': 'Shockwave Flash',
				'suffixes': 'swf',
				'type': 'application/x-shockwave-flash'
			};

			plugin = {
				'description': 'Shockwave Flash 11.9 r900',
				'filename': 'pepflashplayer.dll',
				'0': mime,
				'length': 1
			};

			// Create cirular reference.
			mime['enabledPlugin'] = plugin;

			// Create fake lists of MIME types and plug-ins.
			mimeTypes = fakeObject(navigator.mimeTypes, {
				'application/x-shockwave-flash': mime,
				'length': 1,
				'0': mime
			});

			plugins = fakeObject(navigator.plugins, {
				'Shockwave Flash': plugin,
				'length': 1,
				'0': plugin
			});

			// Fake the navigator object so we are able to override them.
			navigator = fakeObject(navigator, {
				'plugins': plugins,
				'mimeTypes': mimeTypes
			});

			// Add a fake "GetVersion" prototype.
			HTMLObjectElement.prototype.GetVariable = HTMLEmbedElement.prototype.GetVariable = function(name) {
				if (name === '$version') {
					return 'LNX 14,0,0,125';
				}
			};

		} catch (err) {
			return false;
		}

		return true;
	}, fakeObject);
}


module.exports = flash;
