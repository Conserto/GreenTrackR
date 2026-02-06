import { browser } from 'wxt/browser';
import { logDebug, logErr, logWarn } from './log';
import { PREFIX_URL_EXTENSION } from '../const';

// ==========================================
// TAB IDENTIFICATION & INFORMATION
// ==========================================

/**
 * Retrieves the ID of the currently inspected tab.
 * Returns 0 if no tab ID is found.
 */
export const getTabId = (): number => {
  const tabId = browser.devtools?.inspectedWindow?.tabId;
  if (!tabId) logDebug('No Tab Id found');
  return tabId ?? 0;
};

/**
 * Robustly retrieves the URL of the inspected tab via the background script.
 * Ensures compatibility with Chrome and Firefox (bypassing strict CSP restrictions).
 */
export const getTabUrl = async (): Promise<string | undefined> => {
  const tabId = getTabId();
  if (!tabId) return undefined;

  try {
    const response = await browser.runtime.sendMessage({
      action: 'GET_TAB_URL',
      tabId
    });
    return response?.url;
  } catch (e) {
    logErr("Failed to get URL via background");
    return undefined;
  }
};

/**
 * Parses a string into a URL object.
 * Centralized utility to handle validity checks and exclude extension-internal URLs.
 */
export const getUrl = (url?: string) => {
  if (url && url !== '' && !PREFIX_URL_EXTENSION.test(url)) {
    try {
      return new URL(url);
    } catch (e) {
      logWarn(`Error parsing url ${url}`);
    }
  }
  return undefined;
};

// ==========================================
// MESSAGING UTILITIES
// ==========================================

/**
 * Internal helper: Retries sending a message to a tab multiple times if it fails.
 * Addresses race conditions where the content script might not be ready.
 */
const sendChromeMsgRetry = (id: number, cur: number, max: number, payload: any) => {
  browser.runtime.sendMessage({
    forwardToTab: true,
    tabId: id,
    payload: payload
  }).then((res) => {
    if (res && !res.success) throw new Error(res.error);
  }).catch(reason => {
    if (cur < max) {
      setTimeout(() => sendChromeMsgRetry(id, cur + 1, max, payload), 50);
    } else {
      logErr(`Message failed: ${reason}`);
    }
  });
};

/**
 * Sends a message to the content script via the background script (Fire-and-forget).
 * Includes automatic retries to handle initialization delays.
 */
export const sendChromeMsg = (payload: any) => {
  const id = getTabId();
  if (id) sendChromeMsgRetry(id, 0, 10, payload);
};

/**
 * Sends a message to the content script and awaits a response.
 * Useful for fetching data synchronously from the page context.
 */
export const sendMessageAndWait = async <T>(payload: any): Promise<T | undefined> => {
  const tabId = getTabId();
  if (!tabId) return undefined;
  try {
    const response = await browser.runtime.sendMessage({
      forwardToTab: true,
      tabId: tabId,
      payload: payload
    });
    return response?.data as T;
  } catch (error) {
    return undefined;
  }
};

// ==========================================
// BROWSER OPERATIONS
// ==========================================

/**
 * Triggers a cache cleanup (cache, service workers, downloads).
 */
export const cleanCache = () => {
  browser.runtime.sendMessage({ type: 'CLEAN_CACHE' })
    .catch(reason => logErr(`Error clearing browsing cache: ${reason}`));
};

/**
 * Reloads the current tab.
 * Prioritizes the DevTools reload API, falls back to the standard Tabs API.
 */
export const reloadCurrentTab = async () => {
  const tabId = getTabId();
  if (browser.devtools?.inspectedWindow?.reload) {
    browser.devtools.inspectedWindow.reload({});
  } else if (tabId && browser.tabs?.reload) {
    browser.tabs.reload(tabId);
  }
};