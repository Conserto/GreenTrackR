// Content Script - Runs on every web page
// Receives messages from the DevTools panel and executes actions on the page

import { browser } from 'wxt/browser';
import { RequestAction } from 'src/enum';
import { PAGE_HEIGHT } from 'src/const/action.const';
import { logErr, logInfo, logWarn } from 'src/utils';
import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_end',

  main() {
    logInfo('Content script loaded on: ' + window.location.href);

    // Track if event listeners are active
    let listenersActive = false;
    let isRecording = false;

    // Debounce timers to avoid sending too many messages
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    // Debounce delay in milliseconds
    const SCROLL_DEBOUNCE_DELAY = 500;

    /**
     * Handler for scroll events
     * Sends a message to the panel to save scroll measurement
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
          logErr('Error sending scroll message: ' + err);
        });
      }, SCROLL_DEBOUNCE_DELAY);
    };

    /**
     * Handler for click events
     * Detects if it's a navigation click (link) or regular click
     * For navigation clicks, sends message before page unloads
     */
    const handleClick = (event: MouseEvent) => {
      if (!isRecording) return;
      const target = event.target as HTMLElement;

      // Find if the click was on a link or inside a link
      const link = target.closest('a');
      const isNavigationClick = link && link.href && !link.href.startsWith('javascript:');

      if (isNavigationClick) {
        logInfo('Navigation click detected on link: ' + link.href);

        // Block navigation temporarily to ensure message is sent
        event.preventDefault();
        event.stopPropagation();

        const targetUrl = link.href;
        const targetInNewTab = link.target === '_blank' || event.ctrlKey || event.metaKey;

        // Send message immediately before navigation
        browser.runtime.sendMessage({
          saveAnalysis: true,
          component: 'click',
          isNavigation: true,
          targetUrl: targetUrl
        }).catch(err => {
          logErr('Error sending click message: ' + err);
        }).finally(() => {
          // Trigger navigation manually after message is sent
          // Short delay ensures message has time to be processed
          setTimeout(() => {
            if (targetInNewTab) {
              window.open(targetUrl, '_blank');
            } else {
              window.location.href = targetUrl;
            }
          }, 50);
        });

      } else {
        logInfo('Click event detected on: ' + (target.tagName || 'unknown'));

        setTimeout(() => {
          browser.runtime.sendMessage({
            saveAnalysis: true,
            component: 'click',
            isNavigation: false
          }).catch(err => {
            logErr('Error sending click message: ' + err);
          });
        }, 100);
      }
    };

    /**
     * Start listening for scroll and click events
     */
    const startListening = () => {
      if (listenersActive) {
        logInfo('Listeners already active');
        return;
      }

      logInfo('Starting scroll and click listeners');
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Use capture phase to catch clicks before they trigger navigation
      document.addEventListener('click', handleClick, { capture: true });
      listenersActive = true;
    };

    /**
     * Stop listening for scroll and click events
     */
    const stopListening = () => {
      if (!listenersActive) {
        logInfo('Listeners already inactive');
        return;
      }

      logInfo('Stopping scroll and click listeners');
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick, { capture: true });

      // Clear any pending timeouts
      if (scrollTimeout) clearTimeout(scrollTimeout);

      listenersActive = false;
    };

    // ============ AUTOSCROLL ============

    /**
     * Auto-scroll progressif jusqu'à la position cible
     * Scroll par étapes pour charger le contenu lazy-loaded
     */
    const performAutoScroll = async (targetScrollY: number) => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const finalTarget = Math.min(Math.max(0, targetScrollY), maxScroll);

      logInfo(`[AutoScroll] Starting scroll: current=${window.scrollY}, target=${finalTarget}, max=${maxScroll}`);

      if (finalTarget <= 0) {
        logInfo('[AutoScroll] Target is 0 or less, no scroll needed');
        return;
      }

      const scrollStep = 300; // pixels par étape
      const scrollDelay = 50; // ms entre chaque étape
      let currentScroll = window.scrollY;

      // Scroll progressif
      while (currentScroll < finalTarget - 10) { // -10 pour la marge d'erreur
        const nextScroll = Math.min(currentScroll + scrollStep, finalTarget);
        window.scrollTo({ top: nextScroll, behavior: 'instant' });
        currentScroll = window.scrollY;

        // Vérifier si on a vraiment scrollé
        if (Math.abs(window.scrollY - nextScroll) > 50) {
          logWarn(`[AutoScroll] Scroll mismatch: expected=${nextScroll}, actual=${window.scrollY}`);
        }

        await new Promise(r => setTimeout(r, scrollDelay));
      }

      // Position finale
      window.scrollTo({ top: finalTarget, behavior: 'instant' });

      logInfo(`[AutoScroll] Complete: final position=${window.scrollY}`);
    };

    // Listen for messages from the panel (via background or direct)
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      logInfo('Content script received: ' + JSON.stringify(message));

      try {
        const action = message.action;

        switch (action) {
          case 'START_RECORDING':
            isRecording = true;
            startListening();
            sendResponse({ success: true });
            break;

          case 'STOP_RECORDING':
            isRecording = false;
            stopListening();
            sendResponse({ success: true });
            break;

          case 'listenEvents':
            isRecording = true;
            startListening();
            sendResponse({ success: true });
            break;

          case 'getDomElements':
          case RequestAction.GET_DOM_ELEMENTS:
            const domCount = document.getElementsByTagName('*').length;
            logInfo('DOM elements count: ' + domCount);
            sendResponse({
              success: true,
              data: {
                domElements: domCount
              }
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
              // Lancer le scroll (ne pas attendre pour ne pas bloquer)
              performAutoScroll(scrollValue);
              sendResponse({ success: true, message: 'Auto-scroll started' });
            } else {
              const { top, left, timeout } = message.payload || {};
              scrollPage(top || 100, left || 0, timeout || 5000)
                .then(() => sendResponse({ success: true }))
                .catch((err) => sendResponse({ success: false, error: err.message }));
            }
            return true;

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

          case 'stopListenEvents':
            stopListening();
            sendResponse({ success: true, message: 'Event listeners stopped' });
            break;

          case 'PING':
            sendResponse({ success: true, message: 'pong' });
            break;

          default:
            logWarn('Unknown action: ' + action);
            sendResponse({ success: false, error: `Unknown action: ${action}` });
        }
      } catch (error) {
        logErr('Error in content script: ' + error);
        sendResponse({ success: false, error: String(error) });
      }

      return true;
    });

    // Clean up listeners when the page is unloaded
    window.addEventListener('beforeunload', () => {
      stopListening();
    });
  },
});

/**
 * Handles page scrolling with a smooth behavior and timeout.
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