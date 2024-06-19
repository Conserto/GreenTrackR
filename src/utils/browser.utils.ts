import { logDebug, logErr } from './log';
import browser from "webextension-polyfill";

export const cleanCache = () => {
  browser.browsingData.remove(
    {},
    {
      cache: true,
      serviceWorkers: true,
      downloads: true
    }
  ).catch(reason => logErr(`Error when clear browsing cache: ${reason}`));
};

export const sendChromeMsg = (payload: any) => {
  let id = getTabId();
  let max = 100;
  sendChromeMsgRetry(id, 0, max, payload);
};

const sendChromeMsgRetry = (id: number, cur: number, max: number, payload: any) => {
  logDebug(`send Chrome Msg Retry ${cur}/${max}`);
  browser.tabs.sendMessage(id, payload).catch(reason => {
    if (cur === max) {
      logErr(`Error when send chrome tab message: ${reason}`);
    } else {
      sendChromeMsgRetry(id, cur + 1, max, payload);
    }
  });
};

export const getTabId = (): number => {
  let tabId: number | undefined = browser.devtools.inspectedWindow?.tabId;
  logDebug('Tab ID --> ' + tabId);
  if (!tabId) {
    logErr('No Tab Id found, analyse aborted', true);
  }
  return tabId;
};

export const getTabUrl = async (): Promise<string | undefined> => {
  const tab = await browser.tabs.get(getTabId());
  return tab?.url;
};

export const reloadCurrentTab = async (): Promise<void> => {
  await browser.tabs.reload(getTabId());
};
