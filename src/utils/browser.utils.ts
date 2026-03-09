import { browser } from 'wxt/browser';
import { logDebug, logErr, logWarn } from './log';
import { F, PREFIX_URL_EXTENSION } from '../const';

// ==========================================
// BROWSER DETECTION
// ==========================================

export const IS_FIREFOX = typeof navigator !== 'undefined' && /Firefox/i.test(navigator.userAgent);
export const IS_CHROME = typeof navigator !== 'undefined' && /Chrome/i.test(navigator.userAgent) && typeof globalThis?.chrome !== "undefined";
export const IS_SAFARI = typeof navigator !== 'undefined' && typeof (globalThis as any)?.GestureEvent !== "undefined" && !IS_FIREFOX && !IS_CHROME;

export const getBrowserName = (): String => {
  if (IS_CHROME) return "Chrome";
  if (IS_FIREFOX) return "Firefox 🦊";
  if (IS_SAFARI) return "Safari";
  return "Unknown"
}

// ==========================================
// TAB IDENTIFICATION & INFORMATION
// ==========================================

/**
 * Retrieves the ID of the currently inspected tab.
 * Returns 0 if no tab ID is found.
 * Should never work on Safari
 */
export const getTabId = async (): Promise<number> => {
   const devtoolsId = browser.devtools?.inspectedWindow?.tabId;
   
   if (devtoolsId && devtoolsId !== -1) {
      return devtoolsId;
   }

   // Fallback Safari : on demande au service worker quel est le tab actif
   try {
      const response = await browser.runtime.sendMessage({ action: 'GET_ACTIVE_TAB' });
      if (response?.success && response.tab?.id) {
         return response.tab.id;
      }
   } catch (e) {
      logErr("Impossible de récupérer l'ID via sendMessage");
   }

   logDebug('No Tab Id found');
   return 0;
};

/**
 * Version universelle (Safari/Chrome/FF) pour obtenir les infos du Tab
 */
export const getTabInfo = async (tabId: number): Promise<any> => {
  try {
    const response = await browser.runtime.sendMessage({
      action: 'GET_TAB_INFO',
      tabId
    });
    return response?.success ? response.tab : undefined;
  } catch (e) {
    logErr("Failed to get Tab info via sendMessage");
    return undefined;
  }
};

/**
 * Robustly retrieves the URL of the inspected tab via the background script.
 * Ensures compatibility with Chrome and Firefox (bypassing strict CSP restrictions).
 */
export const getTabUrl = async (): Promise<string | undefined> => {
  const tabId = await getTabId();
  if (!tabId) return undefined;

  const tab = await getTabInfo(tabId);
  return tab?.url;
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
export const sendChromeMsg = async (payload: any) => {
  const id = await getTabId();
  if (id) sendChromeMsgRetry(id, 0, 10, payload);
};

/**
 * Sends a message to the content script and awaits a response.
 * Useful for fetching data synchronously from the page context.
 */
export const sendMessageAndWait = async <T>(payload: any): Promise<T | undefined> => {
  const tabId = await getTabId();
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
 */
export const reloadCurrentTab = async (bypassCache: boolean = false) => {
  const tabId = await getTabId();
  if (!tabId) return;

  try {
    await browser.runtime.sendMessage({
      action: 'RELOAD_TAB',
      tabId,
      bypassCache
    });
  } catch (e) {
    logErr("Failed to reload tab via sendMessage");
  }
};