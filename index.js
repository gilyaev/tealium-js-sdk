(function(factory) {

'use strict';

var scope = (typeof self == 'object' && self.self === self && self) ||
    (typeof global == 'object' && global.global === global && global);

    scope.TealiumSDK = factory(scope, {});
})(function(scope, TealiumSDK) {

	var isInit = false;

	/**
	 * Include Tealium file
	 *
	 * @param {string} src
	 * @param {boolean} async
	 */
	function include(src, async) {
		var script      = scope.document.createElement('script'),
			firstScript = scope.document.getElementsByTagName('script')[0];

		script.src = src;
		script.type = 'text/javascript';
		if(async) script.async = true;

		script.handlerFlag = 0;
		script.onreadystatechange = function() {
	        if ((this.readyState === 'complete' || this.readyState === 'loaded') && !script.handlerFlag) {
	            d.handlerFlag = 1;
        	}
		}

	    script.onload = function () {
	        if (!script.handlerFlag) {
	            script.handlerFlag = 1;
	        }
	    };

		firstScript.parentNode.insertBefore(script, firstScript.nextSibling);
	}



	/**
	 * Initialization Tealium Data Layer:
	 * - specified the data that should be send to Tealium (global var utag_data)
	 * - include Tealium utag.js file
	 *
	 * @param {{src: string, async: boolean}} options 
	 * - options.src - the path to utag.js file
	 * - options.async - if true the utag.js will be load asynchronously, synchronically otherwise.
	 *
	 * @param {Object} data - The author of the book.
	 * @throws {Error} Will throw an error if tries init multytime.
	 * @throws {Error}
	 */
	TealiumSDK.init = function(options, data) {
		options = options || {async: false}
		if (isInit) {
			throw new Error('Tealium scripts already init');
		}

		if (!options.hasOwnProperty('src')) {
			throw new Error('Tealium Initialization the src option should be specified');
		}

		scope.utag_data = data;

		include(options.src, options.async);

		isInit = true;
	}

	TealiumSDK.link = function() {

	}

	TealiumSDK.view = function() {

	}


	return TealiumSDK;
});