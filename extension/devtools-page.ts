/**
This script is run whenever the devtools are open.
In here, we can create our panel.
*/

/**
Create a panel, and add listeners for panel show/hide events.
*/
chrome.devtools.panels.create(
  'GreenTrackr',
  '/icons/Logo_GreenTrackr-300.png',
  'src/index.html',
  function (panel: any) {
    panel.onShown.addListener(handleShown);
  },
);

function handleShown() {
  console.log('panel is being shown');
}

function handleHidden() {
  console.log('panel is being hidden');
}
