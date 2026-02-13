// Background Script - Service Worker
// OPTIMIZED: Uses webRequest API only on Firefox (Chrome doesn't need it)

import { browser } from 'wxt/browser';
import { logErr, logInfo, logDebug, logWarn, IS_CHROME, IS_FIREFOX, getBrowserName } from 'src/utils';
import { defineBackground } from 'wxt/utils/define-background';

// ==========================================
// TYPES SIMPLES
// ==========================================

interface RequestInfo {
  url: string;
  tabId: number;
  fromCache: boolean;
  transferSize: number;
  responseSize: number;
  timestamp: number;
  statusCode?: number;
  contentType?: string;
}

// ==========================================
// STORAGE
// ==========================================

const tabRequestsMap = new Map<number, Map<string, RequestInfo>>();
const MAX_REQUESTS_PER_TAB = 500;
const REQUEST_TTL_MS = 5 * 60 * 1000;

export default defineBackground(() => {
  logInfo(`Background script started - Browser: ${getBrowserName()}`);

  // ==========================================
  // WEBREQUEST LISTENERS (FIREFOX + SAFARI ONLY)
  // ==========================================

  function initWebRequestListeners(): void {
    if (IS_CHROME ) {
      logInfo('Chrome detected - skipping webRequest (HAR data is reliable)');
      return;
    }

    if (!browser.webRequest) {
      logErr('webRequest API not available');
      return;
    }

    const filter = { urls: ['<all_urls>'] };

    // ON BEFORE REQUEST
    browser.webRequest.onBeforeRequest.addListener(
      // @ts-expect-error - WXT types expect BlockingResponse but we don't need it
      (details: { tabId: number; url: string }) => {
        const { tabId, url } = details;
        if (tabId < 0) return;

        if (!tabRequestsMap.has(tabId)) {
          tabRequestsMap.set(tabId, new Map());
        }

        const tabRequests = tabRequestsMap.get(tabId)!;

        if (tabRequests.size > MAX_REQUESTS_PER_TAB) {
          cleanupOldRequests(tabRequests);
        }

        tabRequests.set(url, {
          url,
          tabId,
          fromCache: false,
          transferSize: 0,
          responseSize: 0,
          timestamp: Date.now()
        });
      },
      filter
    );

    // ON RESPONSE STARTED - C'est ici qu'on détecte le cache !
    browser.webRequest.onResponseStarted.addListener(
      (details: {
        tabId: number;
        url: string;
        fromCache: boolean;
        statusCode: number;
        responseHeaders?: Array<{ name: string; value?: string }>;
      }) => {
        const { tabId, url, fromCache, statusCode, responseHeaders } = details;
        if (tabId < 0) return;

        const tabRequests = tabRequestsMap.get(tabId);
        if (!tabRequests) return;

        const requestInfo = tabRequests.get(url);
        if (requestInfo) {
          // FIREFOX: fromCache est FIABLE ici !
          requestInfo.fromCache = fromCache || statusCode === 304;
          requestInfo.statusCode = statusCode;

          const contentLength = responseHeaders?.find(
            (h: { name: string; value?: string }) => h.name.toLowerCase() === 'content-length'
          );
          if (contentLength?.value) {
            requestInfo.responseSize = parseInt(contentLength.value, 10) || 0;
          }

          // Capture Content-Type for resource type detection (especially Safari)
          const contentType = responseHeaders?.find(
            (h: { name: string; value?: string }) => h.name.toLowerCase() === 'content-type'
          );
          if (contentType?.value) {
            requestInfo.contentType = contentType.value;
          }

          logDebug(`[webRequest] ${fromCache ? '🟢 CACHE' : '🔵 REAL'}: ${url.substring(0, 80)}`);
        }
      },
      filter,
      ['responseHeaders']
    );

    // ON COMPLETED
    browser.webRequest.onCompleted.addListener(
      (details: { tabId: number; url: string; fromCache: boolean; statusCode: number }) => {
        const { tabId, url, fromCache, statusCode } = details;
        if (tabId < 0) return;

        const tabRequests = tabRequestsMap.get(tabId);
        if (!tabRequests) return;

        const requestInfo = tabRequests.get(url);
        if (requestInfo && (fromCache || statusCode === 304)) {
          requestInfo.fromCache = true;
        }
      },
      filter
    );

    // ON ERROR
    browser.webRequest.onErrorOccurred.addListener(
      (details: { tabId: number; url: string }) => {
        const { tabId, url } = details;
        if (tabId < 0) return;

        const tabRequests = tabRequestsMap.get(tabId);
        if (tabRequests) {
          tabRequests.delete(url);
        }
      },
      filter
    );

    logInfo('✅ webRequest listeners initialized (Firefox cache detection)');
  }

  function cleanupOldRequests(requests: Map<string, RequestInfo>): void {
    const now = Date.now();
    const toDelete: string[] = [];

    requests.forEach((info, url) => {
      if (now - info.timestamp > REQUEST_TTL_MS) {
        toDelete.push(url);
      }
    });

    toDelete.forEach(url => requests.delete(url));

    if (requests.size > MAX_REQUESTS_PER_TAB) {
      const sorted = [...requests.entries()]
        .sort((a, b) => a[1].timestamp - b[1].timestamp);

      const excess = requests.size - MAX_REQUESTS_PER_TAB + 50;
      sorted.slice(0, excess).forEach(([url]) => requests.delete(url));
    }
  }

  function clearTabRequests(tabId: number): void {
    tabRequestsMap.delete(tabId);
    logDebug(`Cleared request cache for tab ${tabId}`);
  }

  // Initialize
  initWebRequestListeners();

  // ==========================================
  // TAB LIFECYCLE
  // ==========================================

  browser.tabs.onRemoved.addListener((tabId) => {
    clearTabRequests(tabId);
  });

  if (browser.webNavigation?.onBeforeNavigate) {
    browser.webNavigation.onBeforeNavigate.addListener((details) => {
      if (details.frameId === 0) {
        clearTabRequests(details.tabId);
      }
    });
  }

  // ==========================================
  // PORTS (DevTools Panel)
  // ==========================================

  browser.runtime.onConnect.addListener((port) => {
    logInfo(`New connection established: ${port.name}`);

    if (port.name === 'devtools-panel') {
      port.onMessage.addListener((message) => {
        const msg = message as { id?: string; tabId?: number; action?: string; payload?: Record<string, unknown> };
        logInfo(`Message received from panel: ${JSON.stringify(msg)}`);

        if (msg.tabId && msg.action) {
          browser.tabs.sendMessage(msg.tabId, {
            action: msg.action,
            payload: msg.payload,
          })
            .then((response) => {
              port.postMessage({ id: msg.id, response });
            })
            .catch((error: Error) => {
              logErr(`Error forwarding message via port: ${error}`);
              port.postMessage({ id: msg.id, error: error.message });
            });
        }
      });
    }
  });

  // ==========================================
  // MESSAGE LISTENER
  // ==========================================

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const msg = message as Record<string, unknown>;
    logInfo(`Background received: ${JSON.stringify(msg)}`);

    // GET WEBREQUEST CACHE INFO
    if (msg.action === 'GET_REQUEST_CACHE_INFO') {
      const tabId = msg.tabId as number | undefined;

      // Chrome never uses webRequest cache
      if (IS_CHROME || !tabId) {
        sendResponse({ success: true, data: [], count: 0, source: 'chrome-har-fallback' });
        return true;
      }

      const tabRequests = tabRequestsMap.get(tabId);
      if (tabRequests) {
        const requestsArray = Array.from(tabRequests.values());
        sendResponse({ success: true, data: requestsArray, count: requestsArray.length, source: 'firefox-webRequest' });
      } else {
        sendResponse({ success: true, data: [], count: 0, source: 'firefox-webRequest' });
      }
      return true;
    }

    if (msg.action === 'WAIT_TAB_UPDATE') {
      const maxWait = 8000;
      let responded = false;

      const cleanup = () => {
        try { browser.tabs.onUpdated.removeListener(onTabUpdated); } catch {};
        try { browser.webNavigation?.onCompleted.removeListener(onWebNav); } catch {};
        clearTimeout(timeout);
      };

      const onTabUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
        if (changeInfo.status === 'complete' && !responded) {
          responded = true;
          logInfo('WAIT_TAB_UPDATE: Tab loading completed via tabs.onUpdated');
          cleanup();
          sendResponse({ success: true, method: 'tabs.onUpdated' });
        }
      };

      const onWebNav = (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
        if (details.frameId === 0 && !responded) {
          responded = true;
          logInfo('WAIT_TAB_UPDATE: Navigation completed via webNavigation.onCompleted');
          cleanup();
          sendResponse({ success: true, method: 'webNavigation.onCompleted' });
        }
      };

      let timeout = setTimeout(() => {
        if (!responded) {
          responded = true;
          logInfo('WAIT_TAB_UPDATE: Timed out after 8000ms');
          cleanup();
          sendResponse({ success: false, timeout: true });
        }
      }, maxWait);

      // Primary method: tabs.onUpdated (works on all browsers)
      if (browser.tabs?.onUpdated) {
        browser.tabs.onUpdated.addListener(onTabUpdated);
        logDebug('WAIT_TAB_UPDATE: Listening for tabs.onUpdated');
      }

      // Fallback: webNavigation.onCompleted (Safari works better with this)
      if (browser.webNavigation?.onCompleted) {
        browser.webNavigation.onCompleted.addListener(onWebNav);
        logDebug('WAIT_TAB_UPDATE: Also listening for webNavigation.onCompleted');
      }

      if (!browser.tabs?.onUpdated && !browser.webNavigation?.onCompleted) {
        logWarn('WAIT_TAB_UPDATE: No navigation APIs available, using timeout fallback');
      }

      return true;
    }

    // IS URL CACHED
    if (msg.action === 'IS_URL_CACHED') {
      const tabId = msg.tabId as number | undefined;
      const url = msg.url as string | undefined;

      if (IS_CHROME || !tabId) {
        sendResponse({ success: true, fromCache: null, source: 'chrome-har-fallback' });
        return true;
      }

      const tabRequests = tabRequestsMap.get(tabId);
      const requestInfo = url ? tabRequests?.get(url) : undefined;
      sendResponse({ success: true, fromCache: requestInfo?.fromCache ?? null, info: requestInfo ?? null });
      return true;
    }

    // ACTIVE TAB DETECTION : should be done through the service worker (message) because SAFARI has restriction and cannot use browser.tabs API outside it
    if (msg.action === 'GET_ACTIVE_TAB') {
      browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => sendResponse({ success: true, tab: tabs[0] }))
        .catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }

    // TAB INFO (by id)
    if (msg.action === 'GET_TAB_INFO' && typeof msg.tabId === 'number') {
      browser.tabs.get(msg.tabId)
        .then(tab => sendResponse({ success: true, tab }))
        .catch(err => sendResponse({ success: false, error: String(err) }));
      return true;
    }

    // CLEAR TAB REQUESTS
    if (msg.action === 'CLEAR_TAB_REQUESTS' && typeof msg.tabId === 'number') {
      clearTabRequests(msg.tabId);
      sendResponse({ success: true });
      return true;
    }

    // GET BROWSER TYPE
    if (msg.action === 'GET_BROWSER_TYPE') {
      sendResponse({ success: true, isFirefox: IS_FIREFOX, useWebRequest: IS_FIREFOX });
      return true;
    }

    // RELOAD TAB
    if (msg.action === 'RELOAD_TAB' && typeof msg.tabId === 'number') {
      clearTabRequests(msg.tabId);
      browser.tabs.reload(msg.tabId, { bypassCache: !!msg.bypassCache })
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }

    // CLEAN CACHE
    if (msg.type === 'CLEAN_CACHE') {
      browser.browsingData.remove({}, { cache: true, serviceWorkers: true, downloads: true })
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: String(err) }));
      return true;
    }

    // SAVE ANALYSIS (broadcast)
    if (msg.saveAnalysis) {
      logInfo('Forwarding saveAnalysis message to extension pages');
      browser.runtime.sendMessage(message).catch(() => {
        logInfo('No listeners for saveAnalysis (panel might be closed)');
      });
      sendResponse({ success: true, forwarded: true });
      return true;
    }

    // FORWARD TO TAB
    if (msg.forwardToTab && typeof msg.tabId === 'number' && msg.payload) {
      browser.tabs.sendMessage(msg.tabId, msg.payload)
        .then((response) => sendResponse({ success: true, data: response }))
        .catch(async (error) => {
          logErr(`Forward to tab ${msg.tabId} failed: ${error}`);

          // Fallback pour GET_DOM_ELEMENTS
          const payload = msg.payload as Record<string, unknown>;
          if (payload?.action === 'GET_DOM_ELEMENTS') {
            try {
              const domResult = await getDomElementsViaScript(msg.tabId as number);
              if (domResult !== null) {
                sendResponse({ success: true, data: { success: true, data: { domElements: domResult } } });
                return;
              }
            } catch (e) {
              logErr(`executeScript fallback also failed: ${e}`);
            }
          }

          sendResponse({ success: false, error: String(error) });
        });
      return true;
    }

    return false;
  });
});

// ==========================================
// HELPERS
// ==========================================

async function getDomElementsViaScript(tabId: number): Promise<number | null> {
  try {
    if (browser.scripting?.executeScript) {
      const results = await browser.scripting.executeScript({
        target: { tabId },
        func: () => document.getElementsByTagName('*').length
      });
      if (results?.[0]?.result !== undefined) {
        return results[0].result as number;
      }
    }

    if (browser.tabs?.executeScript) {
      const results = await browser.tabs.executeScript(tabId, {
        code: 'document.getElementsByTagName("*").length'
      });
      if (results?.[0] !== undefined) {
        return results[0] as number;
      }
    }

    return null;
  } catch (error) {
    logErr(`getDomElementsViaScript failed: ${error}`);
    return null;
  }
}