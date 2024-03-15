import { logErr, logWarn } from './log';

export const cleanCache = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length && tabs[0].url) {
      chrome.browsingData.remove(
        {
          origins: [tabs[0].url],
          since: 0
        },
        {
          cache: true
        }
      ).catch(reason => logErr(`Error when clear browsing cache: ${reason}`));
    }
  });
};

export const sendChromeMsg = (payload: any) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, payload)
        .catch(reason => logErr(`Error when send chrome message: ${reason}`));
    }
  });
};
export const getCurrentUrlAsync = async () => {
  let url: string | undefined = undefined;
  let queryOptions = { active: true, lastFocusedWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  if (tabs.length && tabs[0].id) {
    url = tabs[0].url;
  } else {
    logWarn('Cannot get current tab URL');
  }
  return url;
};