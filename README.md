# install

This is a library that handles installation of a web app for different
web app platforms.

Includes a demo app in `www` to show how it works.

## Installation

install.js is an AMD JS module, loadable by a module loader like RequireJS.
It depends on jQuery. To get the latest version, fetch:

https://raw.github.com/wavysandbox/install/master/www/js/lib/install.js

or use [volo](https://github.com/volojs/volo) to add it to your project:

    volo add wavysandbox/install

## Usage

In a module where you want to find out about installation status:

```javascript
define(['install'], function (install) {
    //Use install() and its related functions in here
});
```

A complete working example of using the install API is in the
[uiWebAppInstall.js](https://github.com/wavysandbox/install/blob/master/www/js/app/uiWebAppInstall.js) file.

## Supported platforms

install.js will check for installation for the following platforms, and has
the following caveats, config options for each platform:

### Mozilla Web Apps/Firefox OS

[Mozilla Web Apps](https://developer.mozilla.org/en/Apps/) have a
navigator.mozApps object that allows installing web apps into Firefox or
Firefox OS-based mobile operating systems.

It is assumed that the webapp manifest is at the following location:
location.href + 'manifest.webapp'. If it is somewhere else, then set
`install.mozillaInstallUrl` to the correct value.

The web app install uses a manifest file that is documented here:
https://developer.mozilla.org/en/Apps/Manifest

**NOTE**: the icon paths in the manifest are absolute URLs,
and only one app is allowed to be installed per unique domain.
So when testing, be sure to serve the index.html from the
root of a test domain. It is best to map the domain in your
/etc/hosts file to 127.0.0.1 when testing locally.
Also, currently the manifest URL for install() needs to be a complete
URL with protocol and domain.

### Chrome Web Store

The [Chrome Web Store](https://developers.google.com/chrome/web-store) allows
installing web applications into the Chrome browser.

1) You must have a link tag in the document similar to the following, where
itemID corresponds to the ID of your app in the chrome store.

    <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/itemID">

2) You can set `install.chromeInstallUrl` to the item URL to use for
installation if you have multiple link tags of the form above.

More details:

https://developers.google.com/chrome/web-store/docs/inline_installation

### iOS

Allows installing a web app on to the user's home screen.

install.js cannot trigger the installation itself, but it emits a "showiOSInstall" event your
app can listen to and then show a popup that shows the user what Safari button
to tap to do the install.

If the app is installed on the Home Screen and that link was followed to launch
the web app, install.js will report the app as "installed".

The sample www app shows the type of UI that can be shown for the iOS case.

See the
[uiWebAppInstall.js](https://github.com/wavysandbox/install/blob/master/www/js/app/uiWebAppInstall.js)
file to see how it listens for the "showiOSInstall" event.

Details on the meta tags that are needed for iOS web apps:
http://developer.apple.com/library/ios/#DOCUMENTATION/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html

This script just checks that `window.navigator.standalone` is true or not to
determine if the app is installed.

You should set the following meta tag at the very least,
but likely you will need more tags for things like icons:

    <meta name="apple-mobile-web-app-capable" content="yes" />
