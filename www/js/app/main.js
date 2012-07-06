// Defines the main app module. This one does the top level app wiring.

define(function (require) {
    'use strict';

    // Dependencies that do not have an export of their own, just attach
    // to other objects, like jQuery. These are just used in the example
    // bootstrap modal, not directly in the UI for the network and appCache
    // displays.
    require('bootstrap/collapse');
    require('bootstrap/transition');

    // Wait for the DOM to be ready before showing the network and appCache
    // state.
    $(function () {
        // Enable the UI bindings for install
        require('./uiWebAppInstall');
    });
});
