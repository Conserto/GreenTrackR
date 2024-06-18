/**
 This script is run whenever the devtools are open.
 In here, we can create our panel.
 */
import { devtools } from 'webextension-polyfill';

devtools.panels.create('GreenTrackR', '/images/logo.png', 'src/index.html');
