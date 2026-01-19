import { browser } from 'wxt/browser';
import { logDebug, logErr, logWarn } from './log';
import { PREFIX_URL_EXTENSION } from '../const';

/**
 * ID de l'onglet inspecté
 */
export const getTabId = (): number => {
  const tabId = browser.devtools?.inspectedWindow?.tabId;
  if (!tabId) logDebug('No Tab Id found');
  return tabId ?? 0;
};

/**
 * Récupère l'URL de l'onglet (Fix Firefox + Chrome)
 */
/**
 * Récupère l'URL de l'onglet inspecté de manière ultra-robuste.
 * Compatible Chrome & Firefox (même sous CSP strict).
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
 * Formate une string en objet URL (Centralisé ici pour éviter les doublons)
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

/**
 * Envoi de message via Background (Fix Firefox "tabs is undefined")
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

export const sendChromeMsg = (payload: any) => {
  const id = getTabId();
  if (id) sendChromeMsgRetry(id, 0, 10, payload);
};

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

export const cleanCache = () => {
  browser.runtime.sendMessage({ type: 'CLEAN_CACHE' })
    .catch(reason => logErr(`Error clearing browsing cache: ${reason}`));
};

export const reloadCurrentTab = async () => {
  const tabId = getTabId();
  if (browser.devtools?.inspectedWindow?.reload) {
    browser.devtools.inspectedWindow.reload({});
  } else if (tabId && browser.tabs?.reload) {
    browser.tabs.reload(tabId);
  }
};