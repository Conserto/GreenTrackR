'use strict';

let connections: any = {};

//TODO: mplement this sending message to svelte component to prevent it there is new entries laoded
/*chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.runtime.sendMessage({ details });
});*/
/*
 * Listen for message form tab and send it to devtools
 **/
const notify = (message: any, sender: any, sendResponse: any) => {
  if (sender.tab) {
    let tabId = sender.tab.id;
    if (tabId in connections) connections[tabId].postMessage(message);
    else console.warn('Tab not found in connection list.');
  } else console.warn('sender.tab not defined.');
};

chrome.runtime.onMessage.addListener(notify);

console.log('start background process');

// Listen to message from devTools
chrome.runtime.onConnect.addListener((devToolsConnection) => {
  console.log('received onConnect');
  // assign the listener function to a variable so we can remove it later
  let devToolsListener = (message: any, sender: any, sendResponse: any) => {
    // in case message form devtools is to clean cache
    if (message.clearBrowserCache) {
      clearBrowserCache();
      return;
    }
    // Otherwise message is to inject script
    else {
      // Inject a content script into the identified tab
      console.log(
        `received script ${message.scriptToInject} to execute form tabId ${message.tabId}`,
      );
      if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
    }
  };
  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener as any);

  devToolsConnection.onDisconnect.addListener((port) => {
    devToolsConnection.onMessage.removeListener(devToolsListener as any);

    Object.keys(connections).map((tab) => {
      if (connections[tab] == port) {
        delete connections[tab];
        return false;
      }
    });
  });
});

function clearBrowserCache() {
  chrome.browsingData.remove(
    {},
    {
      cache: true,
      cookies: false,
      downloads: true,
      formData: false,
      history: false,
      indexedDB: false,
      localStorage: false,
      passwords: false,
      serviceWorkers: true,
    },
    () => console.log('Cache cleaning done'),
  );
}
