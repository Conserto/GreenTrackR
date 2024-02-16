export const cleanCache = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length && tabs[0].url) {
      chrome.browsingData.remove(
        {
          origins: [tabs[0].url],
          since: 0,
        },
        {
          cache: true,
          serviceWorkers: true,
          downloads: true,
        },
      );
    }
  });
};

export const sendChromeMsg = (payload: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, payload);
    }
  });
};
