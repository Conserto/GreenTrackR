import { browser } from 'wxt/browser';
import { logInfo } from 'src/utils';

browser.devtools.panels.create(
  'GreenTrackR',
  '/images/logo.png',
  '/panel.html',
  (panel) => {
    logInfo('Panel created successfully')

    // Panel events (optional)
    panel.onShown.addListener(() => {
      logInfo('Panel shown')
    });

    panel.onHidden.addListener(() => {
      logInfo('Panel shown')
    });
  }
);