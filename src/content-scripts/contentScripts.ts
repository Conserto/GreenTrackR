const sentRuntimeMsg = (payload: any) => {
  chrome.runtime.sendMessage(payload);
};

/**
 * Catch devtools messages
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    if (request.action === 'scrollToTop') {
      window.scrollTo({ top: 0 });
    } else if (request.action === 'sendPageHeight') {
      // Send total height of the page for autoscroll page
      sentRuntimeMsg({ type: 'pageHeight', height: document.body.scrollHeight });
    } else if (request.action === 'scrollTo' && request.value) {
      window.scrollBy(0, request.value);
      sentRuntimeMsg({ autoScrollDone: true });
    }
  }
});
