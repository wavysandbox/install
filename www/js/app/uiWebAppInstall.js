// Manages the UI for showing a web apps install button.
// Use Firefox Nightly to try this out. This is important for B

/*global window, navigator, location, console, define */

define(function (require) {
    'use strict';

    var $ = require('jquery'),
        install = require('install'),
        enabledClick = false;

    function onInstallStateChange() {
        //Make sure DOM is ready before modifying it.
        $(function () {
            var dom = $('body'),
                installDom = dom.find('.webapp-install'),
                installedDom = dom.find('.webapp-installed'),
                errorDom = dom.find('.webapp-error');

            if (install.state === 'installed' || install.state === 'unsupported') {
                // Hide error just incase it was showing.
                errorDom.hide();

                //Remove any even listener for the install button.
                dom.off('click', '.webapp-install', install);
                enabledClick = false;

                // only when the app is actually installed do we show the 'installed' message
                if (install.state === 'installed') {
                    // only if it was installable and is now installed would we need to hide it
                    installDom.hide();
                    installedDom.show();
                }
            } else if (install.state === 'uninstalled') {
                // Configure the app to be installable in Chrome. ASSUMES a
                // link tag that matches the selector below.
                install.chromeInstallUrl = $('[rel="chrome-webstore-item"]')[0].href;

                // Hide the installed status just in case it was showing
                installedDom.hide();

                // Installed now so no need to show the install button.
                installDom.show();

                if (!enabledClick) {
                    dom.on('click', '.webapp-install', install);

                    dom.find('.ios').on('click', function () {
                        //Close out the ios panel when clicked.
                        $(this).fadeOut();
                    });

                    enabledClick = true;
                }
            }
        });
    }

    install.on('change', onInstallStateChange);

    //Call it now, check the current state.
    onInstallStateChange();

    install.on('error', function (evt, err) {
        //Make sure DOM is ready before modifying it.
        $(function () {
            var errorDom = $('body').find('.webapp-error');
            errorDom.find('webapp-error-details')
                    .text(err.toString())
                    .end()
                .show();
        });
    });

    install.on('showiOSInstall', function (evt, deviceType) {
        //Show the UI that tells the user what Safari
        //button to hit
        $('body').find('.ios').show(0, function () { $(this).addClass(deviceType); });
    });
});
