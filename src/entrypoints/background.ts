// Background Script - Service Worker
// Handles communication between the DevTools panel and content scripts
// Supports both Chrome and Firefox with appropriate fallbacks

import { browser } from 'wxt/browser';
import { logErr, logInfo } from 'src/utils';
import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  logInfo('Background script started');

  // Listen for long-lived connections from the DevTools panel
  browser.runtime.onConnect.addListener((port) => {
    logInfo('New connection: ' + port.name);

    if (port.name === 'devtools-panel') {
      port.onMessage.addListener(async (message: any) => {
        logInfo('Message from panel: ' + JSON.stringify(message));

        if (message.tabId && message.action) {
          try {
            // Forward the message to the content script of the specific tab
            const response = await browser.tabs.sendMessage(message.tabId, {
              action: message.action,
              payload: message.payload,
            });
            port.postMessage({ id: message.id, response });
          } catch (error) {
            logErr('Error forwarding message: ' + error);
            port.postMessage({
              id: message.id,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      });
    }
  });

  // Listen for one-time messages
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logInfo('Background received: ' + JSON.stringify(message));

    // Handle tab reload requests from DevTools (Firefox compatibility)
    if (message.action === 'RELOAD_TAB' && message.tabId) {
      handleTabReload(message.tabId, sendResponse);
      return true; // Keep channel open for async response
    }

    // Récupérer l'URL proprement
    if (message.action === 'GET_TAB_URL') {
      browser.tabs.get(message.tabId)
        .then(tab => sendResponse({ url: tab?.url }))
        .catch(() => sendResponse({ url: undefined }));
      return true;
    }

    // --- AJOUT POUR LE CACHE ---
    if (message.type === 'CLEAN_CACHE') {
      browser.browsingData.remove({}, {
        cache: true,
        serviceWorkers: true,
        downloads: true
      })
        .then(() => sendResponse({ success: true }))
        .catch(err => {
          logErr(`Error cleaning cache: ${err}`);
          sendResponse({ success: false, error: String(err) });
        });
      return true;
    }

    // Forward saveAnalysis messages from content script to all extension pages (including panel)
    if (message.saveAnalysis) {
      logInfo('Forwarding saveAnalysis message to extension pages');

      // Broadcast to all extension views (including DevTools panel)
      browser.runtime.sendMessage(message).catch(() => {
        logInfo('No listeners for saveAnalysis (this is normal if panel is closed)');
      });

      sendResponse({ success: true, forwarded: true });
      return true;
    }

    // If the message is from the panel and needs to be forwarded to a tab
    // This is the primary method for Firefox DevTools communication
    if (message.forwardToTab && message.tabId) {
      handleForwardToTab(message.tabId, message.payload, sendResponse);
      return true; // Keep the message channel open for asynchronous response
    }

    return false;
  });
});

/**
 * Reloads a specific tab with cache bypass
 * Used when DevTools panel cannot directly reload the inspected window (Firefox)
 */
async function handleTabReload(
  tabId: number,
  sendResponse: (response?: any) => void
): Promise<void> {
  try {
    await browser.tabs.reload(tabId, { bypassCache: true });
    logInfo(`Tab ${tabId} reloaded successfully`);
    sendResponse({ success: true });
  } catch (error) {
    logErr(`Tab reload failed for tab ${tabId}: ${error}`);
    sendResponse({ success: false, error: String(error) });
  }
}

/**
 * Forwards a message to a specific tab's content script
 * Essential for Firefox where DevTools panel cannot use tabs.sendMessage directly
 * Includes fallback to executeScript for DOM element retrieval
 */
async function handleForwardToTab(
  tabId: number,
  payload: any,
  sendResponse: (response?: any) => void
): Promise<void> {
  try {
    // Primary method: Forward to content script
    const response = await browser.tabs.sendMessage(tabId, payload);
    logInfo(`Message forwarded to tab ${tabId}, response: ${JSON.stringify(response)}`);
    sendResponse({ success: true, data: response });
  } catch (error) {
    logErr(`Forward to tab ${tabId} failed: ${error}`);

    // Fallback: Try to execute script directly for DOM element requests
    if (payload?.action === 'GET_DOM_ELEMENTS') {
      try {
        const domResult = await getDomElementsViaScript(tabId);
        if (domResult !== null) {
          logInfo(`DOM elements retrieved via executeScript: ${domResult}`);
          sendResponse({
            success: true,
            data: {
              success: true,
              data: { domElements: domResult }
            }
          });
          return;
        }
      } catch (scriptError) {
        logErr(`executeScript fallback also failed: ${scriptError}`);
      }
    }

    sendResponse({ success: false, error: String(error) });
  }
}

/**
 * Gets DOM element count by executing script directly in the tab
 * Works when content script is not responding or not injected
 */
async function getDomElementsViaScript(tabId: number): Promise<number | null> {
  try {
    // Try Manifest V3 scripting API first
    if (browser.scripting?.executeScript) {
      const results = await browser.scripting.executeScript({
        target: { tabId },
        func: () => document.getElementsByTagName('*').length
      });
      if (results?.[0]?.result !== undefined) {
        return results[0].result as number;
      }
    }

    // Fallback to Manifest V2 tabs.executeScript
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