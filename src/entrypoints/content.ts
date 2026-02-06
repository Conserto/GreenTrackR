// Content Script - Main entry point for page interaction
// Handles event listeners, DOM manipulation, and communication with the DevTools panel

import { browser } from 'wxt/browser';
import { RequestAction } from 'src/enum';
import { logErr, logInfo, logWarn } from 'src/utils';
import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_end',

  main() {
    logInfo(`Content script loaded on: ${window.location.href}`);

    // ==========================================
    // STATE & CONSTANTS
    // ==========================================

    // Configuration
    const SCROLL_DEBOUNCE_DELAY = 500;

    // State tracking
    let listenersActive = false;
    let isRecording = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    // ==========================================
    // EVENT HANDLERS
    // ==========================================

    /**
     * Handles scroll events with debouncing to prevent event flooding.
     * Triggers a 'saveAnalysis' message to the panel.
     */
    const handleScroll = () => {
      if (!isRecording) return;
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        logInfo('Scroll event detected - sending saveAnalysis');
        browser.runtime.sendMessage({
          saveAnalysis: true,
          component: 'scroll'
        }).catch(err => {
          logErr(`Error sending scroll message: ${err}`);
        });
      }, SCROLL_DEBOUNCE_DELAY);
    };

    /**
     * Handles click events, distinguishing between standard interactions and navigation.
     * Intercepts navigation clicks to ensure data persistence before the page unloads.
     */
    const handleClick = (event: MouseEvent) => {
      if (!isRecording) return;
      const target = event.target as HTMLElement;

      // Determine if the click target is a link or within a link
      const link = target.closest('a');
      const isNavigationClick = link && link.href && !link.href.startsWith('javascript:');

      if (isNavigationClick) {
        logInfo(`Navigation click detected on link: ${link.href}`);

        // Temporarily halt navigation to guarantee message transmission
        event.preventDefault();
        event.stopPropagation();

        const targetUrl = link.href;
        const targetInNewTab = link.target === '_blank' || event.ctrlKey || event.metaKey;

        // Dispatch message immediately before navigation
        browser.runtime.sendMessage({
          saveAnalysis: true,
          component: 'click',
          isNavigation: true,
          targetUrl: targetUrl
        }).catch(err => {
          logErr(`Error sending click message: ${err}`);
        }).finally(() => {
          // Manually trigger navigation after a short buffer
          setTimeout(() => {
            if (targetInNewTab) {
              window.open(targetUrl, '_blank');
            } else {
              window.location.href = targetUrl;
            }
          }, 50);
        });

      } else {
        // Standard click handling
        logInfo(`Click event detected on: ${target.tagName || 'unknown'}`);

        setTimeout(() => {
          browser.runtime.sendMessage({
            saveAnalysis: true,
            component: 'click',
            isNavigation: false
          }).catch(err => {
            logErr(`Error sending click message: ${err}`);
          });
        }, 100);
      }
    };

    // ==========================================
    // LIFECYCLE MANAGEMENT
    // ==========================================

    /**
     * Initializes event listeners for user interaction tracking.
     */
    const startListening = () => {
      if (listenersActive) {
        logInfo('Listeners already active');
        return;
      }

      logInfo('Starting scroll and click listeners');
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Capture phase ensures clicks are detected before other handlers potentially stop propagation
      document.addEventListener('click', handleClick, { capture: true });
      listenersActive = true;
    };

    /**
     * Cleans up event listeners and pending timers.
     */
    const stopListening = () => {
      if (!listenersActive) {
        logInfo('Listeners already inactive');
        return;
      }

      logInfo('Stopping scroll and click listeners');
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick, { capture: true });

      if (scrollTimeout) clearTimeout(scrollTimeout);
      listenersActive = false;
    };

    // ==========================================
    // FEATURE: AUTO-SCROLL
    // ==========================================

    /**
     * Executes a progressive auto-scroll to a target Y position.
     * Performs incremental scrolling to ensure lazy-loaded content triggers correctly.
     */
    const performAutoScroll = async (targetScrollY: number) => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const finalTarget = Math.min(Math.max(0, targetScrollY), maxScroll);

      logInfo(`[AutoScroll] Starting scroll: current=${window.scrollY}, target=${finalTarget}, max=${maxScroll}`);

      if (finalTarget <= 0) {
        logInfo('[AutoScroll] Target is 0 or less, no scroll needed');
        return;
      }

      const scrollStep = 300; // Pixels per step
      const scrollDelay = 50; // Delay in ms between steps
      let currentScroll = window.scrollY;

      // Progressive scroll loop
      while (currentScroll < finalTarget - 10) { // -10 buffer for calculation errors
        const nextScroll = Math.min(currentScroll + scrollStep, finalTarget);
        window.scrollTo({ top: nextScroll, behavior: 'instant' });
        currentScroll = window.scrollY;

        // Verify if scroll actually occurred (check for stuck scroll)
        if (Math.abs(window.scrollY - nextScroll) > 50) {
          logWarn(`[AutoScroll] Scroll mismatch: expected=${nextScroll}, actual=${window.scrollY}`);
        }

        await new Promise(r => setTimeout(r, scrollDelay));
      }

      // Set final position
      window.scrollTo({ top: finalTarget, behavior: 'instant' });
      logInfo(`[AutoScroll] Complete: final position=${window.scrollY}`);
    };

    // ==========================================
    // MESSAGE LISTENER (CONTROLLER)
    // ==========================================

    /**
     * Core message listener - Routes actions received from the background script or DevTools panel.
     */
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      logInfo(`Content script received: ${JSON.stringify(message)}`);

      try {
        const action = message.action;

        switch (action) {
          case 'START_RECORDING':
          case 'listenEvents':
            isRecording = true;
            startListening();
            sendResponse({ success: true });
            break;

          case 'STOP_RECORDING':
          case 'stopListenEvents':
            isRecording = false;
            stopListening();
            sendResponse({ success: true, message: 'Event listeners stopped' });
            break;

          case 'getDomElements':
          case RequestAction.GET_DOM_ELEMENTS:
            const domCount = document.getElementsByTagName('*').length;
            logInfo(`DOM elements count: ${domCount}`);
            sendResponse({
              success: true,
              data: { domElements: domCount }
            });
            break;

          case 'scrollToTop':
          case RequestAction.SCROLL_TO_TOP:
            window.scrollTo({ top: 0, behavior: 'smooth' });
            sendResponse({ success: true });
            break;

          case 'scrollTo':
          case RequestAction.SCROLL_TO:
            const scrollValue = message.value ?? message.payload?.top;
            if (scrollValue !== undefined) {
              // Trigger scroll asynchronously (non-blocking)
              performAutoScroll(scrollValue);
              sendResponse({ success: true, message: 'Auto-scroll started' });
            } else {
              // Legacy/Alternative scroll method
              const { top, left, timeout } = message.payload || {};
              scrollPage(top || 100, left || 0, timeout || 5000)
                .then(() => sendResponse({ success: true }))
                .catch((err) => sendResponse({ success: false, error: err.message }));
            }
            return true; // Keep channel open for async response

          case 'sendPageHeight':
          case RequestAction.SEND_PAGE_HEIGHT:
            sendResponse({
              success: true,
              data: {
                pageHeight: document.body.scrollHeight,
                viewportHeight: window.innerHeight,
                scrollY: window.scrollY
              }
            });
            break;

          case 'PING':
            sendResponse({ success: true, message: 'pong' });
            break;

          default:
            logWarn(`Unknown action: ${action}`);
            sendResponse({ success: false, error: `Unknown action: ${action}` });
        }
      } catch (error) {
        logErr(`Error in content script: ${error}`);
        sendResponse({ success: false, error: String(error) });
      }

      return true; // Indicates async response is possible
    });

    // Cleanup on unload
    window.addEventListener('beforeunload', () => {
      stopListening();
    });
  },
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Helper: Handles page scrolling with smooth behavior and a timeout safeguard.
 */
function scrollPage(top: number, left: number, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const isAtBottom = (document.body.scrollHeight - window.innerHeight) <= window.scrollY + 1;

    if (isAtBottom) {
      logInfo('Already at bottom of page');
      resolve();
      return;
    }

    window.scrollBy({ left, top, behavior: 'smooth' });

    const timeoutId = setTimeout(() => {
      reject(new Error('Scroll timeout'));
    }, timeout);

    const onScrollEnd = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scrollend', onScrollEnd);
      resolve();
    };

    window.addEventListener('scrollend', onScrollEnd);
  });
}