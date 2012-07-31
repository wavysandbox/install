# install

This is a library that handles installation of a web app for different
web app platforms.

Includes a demo app in `www` to show how it works.

There is a live demo here:

http://install.wavysandbox.com/

However, it has not been set up for the Chrome App Store yet. It works in
Firefox Aurora and on iOS though.

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

2) You must also set `install.chromeInstallUrl` to the item URL in the link tag.

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

## Demo notes

The demo is in the `www` directory. This project uses
[volo](https://github.com/volojs/volo) to generate a `www-build` directory
that is used to deploy the built version of the site to
[GitHub Pages](https://help.github.com/categories/20/articles), via the
`volo ghdeploy` command specified in the
[volofile](https://github.com/wavysandbox/install/blob/master/volofile).

Some notes on the `www` layout:

There is a `manifest.webapp` and a `manifest.json`. The .webapp version is for
Firefox, the .json file is [mandated by Chrome](https://developers.google.com/chrome/web-store/docs/get_started_simple).

Chrome also suggests that the
[128 version of the icon be next to manifest.json](https://developers.google.com/chrome/web-store/docs/get_started_simple#step3).

So that is why the 128 icon is in the root of `www` instead of in `www/img`.

This demo follows the ["Hosted Apps" approach](https://developers.google.com/chrome/apps/docs/developers_guide) in the Chrome documents, which requires
an upload to the Chrome store but just for the manifest and icon. Chrome may
support
["CRX-less" web apps](https://developers.google.com/chrome/apps/docs/no_crx)
at some point, but they are not supported at this time.

The .zip file that is needed for upload to the chrome store (which just includes
the manifest.json and the icon file) can be generated from the www contents
by running `volo crxzip`.

## Demo Screenshots

## Firefox

Right now the Web app capability is only in the [Aurora Channel](http://www.mozilla.org/en-US/firefox/aurora/) (pre-beta) for Firefox.

1) First load

![step one](https://github.com/wavysandbox/install/raw/master/READMEimg/ff01.png)

https://github.com/wavysandbox/install/raw/master/READMEimg/chrome01.png

2) After clicking Install

![step two](https://github.com/wavysandbox/install/raw/master/READMEimg/ff02.png)

3) After Installed

![step three](https://github.com/wavysandbox/install/raw/master/READMEimg/ff03.png)


4) An App icon shows up in the OS Applications folder (showing OS X in this screenshot):

![step four](https://github.com/wavysandbox/install/raw/master/READMEimg/ff04.png)


5) What the Window looks like after clicking on the OS app icon.

![step five](https://github.com/wavysandbox/install/raw/master/READMEimg/ff05.png)
