/*jslint nomen: true */
/*global define, navigator, location, window, chrome */

define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        Events = Backbone.Events,
        prop,
        install;

    /**
     * Detects if the current app has been installed.
     *
     * Platform-specific Notes:
     *
     * Firefox:
     * ========
     * It is assumed that the webapp manifest is at the following location:
     * location.href + 'manifest.webapp'.
     *
     * If it is somewhere else, then set install.mozillaInstallUrl to
     * the correct value.
     *
     * The web app install uses
     * a manifest file that is documented here:
     * https://developer.mozilla.org/en/Apps/Manifest
     * NOTE: the icon paths in the manifest are absolute URLs,
     * and only one app is allowed to be installed per unique domain.
     * So when testing, be sure to serve the index.html from the
     * root of a test domain. It is best to map the domain in your
     * /etc/hosts file to 127.0.0.1 when testing locally.
     * Also, currently the URL to install() needs to be a complete
     * URL with protocol and domain.
     *
     * Chrome:
     * ========
     * 1) You must have a link tag in the document similar to the following,
     * where itemID corresponds to the ID of your app in the chrome store.
     *
     * <link rel="chrome-webstore-item"
     * href="https://chrome.google.com/webstore/detail/itemID">
     *
     * More details:
     * https://developers.google.com/chrome/web-store/docs/inline_installation
     *
     * iOS:
     * =======
     * Details on the meta tags that are needed for iOS web apps:
     * http://developer.apple.com/library/ios/#DOCUMENTATION/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
     *
     * This script just checks that
     * window.navigator.standalone is true or not to determine if the app is
     * installed.
     *
     * You should set the following meta tag at the very least,
     * but likely you will need more tags for things like icons:
     * <meta name="apple-mobile-web-app-capable" content="yes" />
     */

    function triggerChange(state) {
        install.state = state;
        install.trigger('change', install.state);
    }

    install = {
        /**
         *  The install state. Values are:
         *  'unknown': the code has not tried to detect any state.
         *
         * @type {String}
         */
        state: 'unknown',

        check: function () {
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
                       chrome.webstore &&
                       chrome.app) {
                //Chrome web apps
                install.type = 'chromeStore';
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
        },

        install: function () {
            var fn = install[install.type + 'Install'];
            if (fn) {
                fn();
            } else {
                install.trigger('error', 'unsupported install: ' + install.type);
            }
        },

        /* Mozilla/Firefox installation */
        mozillaInstallUrl: location.href + 'manifest.webapp',
        mozillaInstall: function () {
            var installRequest = navigator.mozApps.install(install.mozillaInstallUrl);

            installRequest.onsuccess = function (data) {
                triggerChange('installed');
            };

            installRequest.onerror = function (err) {
                install.error = err;
                triggerChange('error');
            };
        },

        /* Chrome installation */
        chromeInstallUrl: null,
        chromeInstall: function () {
            chrome.webstore.install(install.chromeInstallUrl,
                function () {
                    triggerChange('installed');
                }, function (err) {
                    install.error = err;
                    triggerChange('error');
                });
        },

        /* iOS installation */
        //Right now, just asks that something show a UI
        //element mentioning how to install using the Safari
        //"Add to Home Screen" button.
        iosInstall: function () {
            install.trigger('showiOSInstall');
        }
    };

    //Allow install to do events.
    for (prop in Events) {
        if (Events.hasOwnProperty(prop)) {
            install[prop] = Events[prop];
        }
    }

    //Start up the checks
    install.check();

    return install;
});