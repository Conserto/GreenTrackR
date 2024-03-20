import { logDebug, logErr, logInfo } from './log';

export const cleanCache = () => {
  chrome.browsingData.remove(
    {},
    {
      cache: true,
      serviceWorkers: true,
      downloads: true,
      localStorage: true,
      cacheStorage: true,
      appcache: true,
      fileSystems: true,
      history: true,
      indexedDB: true,
      webSQL: true,
      cookies: true,
      formData: true
    }
  ).catch(reason => logErr(`Error when clear browsing cache: ${reason}`));
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

export const reloadCurrentTab = async (): Promise<void> => {
  await chrome.tabs.reload(getTabId());
};
