/*jslint nomen: true */
/*global define, navigator, location, window, chrome, document */

/* support both requireJS and plain JS */
if (typeof define === 'undefined') {
  window.define = function(func) {
    'use strict';
    window.install = func();
  };
}

define(function () {
    'use strict';

    /**
     * Detects if the current app has been installed.
     *
     * See https://github.com/wavysandbox/install/blob/master/README.md
     * for details on how to use.
     *
     */
    function install() {
        var fn = install[install.type + 'Install'];
        if (fn) {
            fn();
        } else {
            triggerEvent('error', 'unsupported install: ' + install.type);
        }
    }

    function triggerChange(state) {
        install.state = state;
        triggerEvent('change', install.state);
    }

    /**
     *  The install state. Values are:
     *  'unknown': the code has not tried to detect any state.
     *
     * @type {String}
     */
    install.state = 'unknown';

    install.check = function () {
        var apps = navigator.mozApps,
            request;

        if (navigator.mozApps) {
            //Mozilla web apps
            install.type = 'mozilla';
            request = navigator.mozApps.getSelf();
            request.onsuccess = function () {
                if (this.result) {
                    triggerChange('installed');
                } else {
                    triggerChange('uninstalled');
                }
            };

            request.onerror = function (err) {
                // Just console log it, no need to bother the user.
                install.error = err;
                triggerChange('error');
            };

        } else if (typeof chrome !== 'undefined' &&
                   chrome.app) {
            //Chrome web apps
            install.type = 'chrome';
            if (chrome.app.isInstalled) {
                triggerChange('installed');
            } else {
                triggerChange('uninstalled');
            }
        } else if (typeof window.navigator.standalone !== 'undefined') {
            install.type = 'ios';
            if (window.navigator.standalone) {
                triggerChange('installed');
            } else {
                triggerChange('uninstalled');
            }
        } else {
            install.type = 'unsupported';
            triggerChange('unsupported');
        }
    };

    /* Mozilla/Firefox installation */
    install.mozillaInstallUrl = location.href + 'manifest.webapp';
    install.mozillaInstall = function () {
        var installRequest = navigator.mozApps.install(install.mozillaInstallUrl);

        installRequest.onsuccess = function (data) {
            triggerChange('installed');
        };

        installRequest.onerror = function (err) {
            install.error = err;
            triggerChange('error');
        };
    };

    /* Chrome installation */
    install.chromeInstallUrl = null;
    install.chromeInstall = function () {
        chrome.webstore.install(install.chromeInstallUrl,
            function () {
                triggerChange('installed');
            }, function (err) {
                install.error = err;
                triggerChange('error');
            });
    };

    /* iOS installation */
    //Right now, just asks that something show a UI
    //element mentioning how to install using the Safari
    //"Add to Home Screen" button.
    install.iosInstall = function () {
        triggerEvent('showiOSInstall', navigator.platform.toLowerCase());
    };

    var listeners = {};

    function addEventListener(type, func /*, don't use capture */) {
        if (! func) {
            throw new TypeError('The listener must not be null or undefined.');
        }

        var theseListeners = listeners[type] = listeners[type] || [];
        if (theseListeners.indexOf(func) === -1) {
            theseListeners.push(func);
        }
    }

    function removeEventListener(type, func) {
        var theseListeners = listeners[type];
        if (theseListeners) {
            var index = theseListeners.indexOf(func);
            theseListeners.splice(index, 1);
        }
    }

    function dispatchEvent(evt) {
        var type = evt.type;
        var theseListeners = listeners[type];

        if (theseListeners) {
            theseListeners.forEach(function(oneListener) {
                window.setTimeout(dispatchOneEvent.bind(null, evt, oneListener));
            });
        }
    }

    function dispatchOneEvent(evt, oneListener) {
        if (typeof oneListener === "function") {
            oneListener(evt);
        } else if (typeof oneListener.handleEvent === "function") {
            oneListener.handleEvent(evt);
        }
    }

    function triggerEvent(evtType, detail) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(evtType, false, false, detail);
        dispatchEvent(event);
    }

    //Allow install to do events.
    install.addEventListener = addEventListener;
    install.removeEventListener = removeEventListener;
    install.dispatchEvent = dispatchEvent;


    //Start up the checks
    install.check();

    return install;
});
