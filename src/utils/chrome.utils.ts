import { logDebug, logErr } from './log';

export const cleanCache = () => {
  chrome.browsingData.remove(
    {},
    {
      cache: true,
      serviceWorkers: true,
      downloads: true
    }
  ).catch(reason => logErr(`Error when clear browsing cache: ${reason}`));
};

// TODO Delete
export const debugBtn = () => {
  getTabId();
};

export const sendChromeMsg = (payload: any) => {
  chrome.tabs.sendMessage(getTabId(), payload)
    .catch(reason => logErr(`Error when send chrome tab message: ${reason}`));
};

export const getTabId = (): number => {
  let tabId: number | undefined = chrome.devtools.inspectedWindow?.tabId;
  logDebug('Tab ID --> ' + tabId);
  if (!tabId) {
    logErr('No Tab Id found, analyse aborted', true);
  }
  return tabId;
};

export const getTabUrl = async (): Promise<string> => {
  const tab = await chrome.tabs.get(getTabId());
  return tab.url;
};

export const waitTest = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}