// Background Script - Service Worker
// Central hub for communication between DevTools panel, Content Scripts, and Browser API.
// Handles message routing, cache management, and tab interactions with cross-browser support.

import { browser } from 'wxt/browser';
import { logErr, logInfo } from 'src/utils';
import { defineBackground } from 'wxt/utils/define-background';

export default defineBackground(() => {
  logInfo('Background script started');

  // ==========================================
  // LONG-LIVED CONNECTIONS (PORTS)
  // ==========================================

  /**
   * Manages persistent connections, primarily from the DevTools panel.
   * Acts as a bridge to forward messages from the panel to specific tabs.
   */
  browser.runtime.onConnect.addListener((port) => {
    logInfo(`New connection established: ${port.name}`);

    if (port.name === 'devtools-panel') {
      port.onMessage.addListener(async (message: any) => {
        logInfo(`Message received from panel: ${JSON.stringify(message)}`);

        if (message.tabId && message.action) {
          try {
            // Relay message to the target tab's content script
            const response = await browser.tabs.sendMessage(message.tabId, {
              action: message.action,
              payload: message.payload,
            });
            port.postMessage({ id: message.id, response });
          } catch (error) {
            logErr(`Error forwarding message via port: ${error}`);
            port.postMessage({
              id: message.id,
              error: error instanceof Error ? error.message : String(error)
            });
          }
        }
      });
    }
  });

  // ==========================================
  // ONE-TIME MESSAGE LISTENERS
  // ==========================================

  /**
   * Handles single messages from any part of the extension (Popup, Content Script, Panel).
   */
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logInfo(`Background received: ${JSON.stringify(message)}`);

    // 1. Tab Management: Reload
    // Handles reload requests, often needed for Firefox compatibility
    if (message.action === 'RELOAD_TAB' && message.tabId) {
      handleTabReload(message.tabId, sendResponse);
      return true; // Keep channel open for async response
    }

    // 2. Tab Management: Get URL
    // Safely retrieves the URL of a specific tab
    if (message.action === 'GET_TAB_URL') {
      browser.tabs.get(message.tabId)
        .then(tab => sendResponse({ url: tab?.url }))
        .catch(() => sendResponse({ url: undefined }));
      return true;
    }

    // 3. Cache Management
    // Clears browsing data (cache, service workers, downloads)
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

    // 4. Data Broadcasting: Save Analysis
    // Forwards analysis results from content script to all extension views (Panel, Popup)
    if (message.saveAnalysis) {
      logInfo('Forwarding saveAnalysis message to extension pages');

      browser.runtime.sendMessage(message).catch(() => {
        logInfo('No listeners for saveAnalysis (panel might be closed)');
      });

      sendResponse({ success: true, forwarded: true });
      return true;
    }

    // 5. Message Relay: Forward to Tab
    // Primary method for Firefox DevTools communication to reach Content Scripts
    if (message.forwardToTab && message.tabId) {
      handleForwardToTab(message.tabId, message.payload, sendResponse);
      return true;
    }

    return false;
  });
});

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Reloads a specific tab bypassing the local cache.
 * Essential when DevTools cannot directly control the inspected window.
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
 * Forwards a payload to a specific tab's content script.
 * Includes a fallback mechanism: if `sendMessage` fails, it attempts
 * to execute a script directly (useful for DOM metrics retrieval).
 */
async function handleForwardToTab(
  tabId: number,
  payload: any,
  sendResponse: (response?: any) => void
): Promise<void> {
  try {
    // Attempt 1: Standard messaging
    const response = await browser.tabs.sendMessage(tabId, payload);
    logInfo(`Message forwarded to tab ${tabId}, response: ${JSON.stringify(response)}`);
    sendResponse({ success: true, data: response });
  } catch (error) {
    logErr(`Forward to tab ${tabId} failed: ${error}`);

    // Attempt 2: Fallback to script execution for specific actions
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
 * Retrieves the count of DOM elements by injecting a script.
 * Supports both Manifest V3 (scripting API) and Manifest V2 (tabs API).
 */
async function getDomElementsViaScript(tabId: number): Promise<number | null> {
  try {
    // Manifest V3: Use scripting API
    if (browser.scripting?.executeScript) {
      const results = await browser.scripting.executeScript({
        target: { tabId },
        func: () => document.getElementsByTagName('*').length
      });
      if (results?.[0]?.result !== undefined) {
        return results[0].result as number;
      }
    }

    // Manifest V2: Fallback to tabs API
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