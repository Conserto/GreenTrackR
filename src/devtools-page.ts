/**
 This script is run whenever the devtools are open.
 In here, we can create our panel.
 */
import browser from 'webextension-polyfill';

browser.devtools.panels.create('GreenTrackR', '/images/logo.png', 'index.html');

/** TODO FIREFOX
browser.devtools.panels.create('GreenTrackR', '/images/logo.png', 'index.html');
*/