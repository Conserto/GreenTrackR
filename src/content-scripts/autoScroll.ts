/**
 * Scroll to the bottom of the current tab
 */

function scrollToBottom({
  numberStepsValue,
  pixelsToMoveValue,
  timeBetweenStepsValue,
}: {
  numberStepsValue: number;
  pixelsToMoveValue: number;
  timeBetweenStepsValue: number;
}) {
  let scrollId: number;
  let steps = 1;
  return new Promise<void>((resolve, reject) => {
    scrollId = setInterval(function () {
      if (steps <= numberStepsValue) {
        window.scrollBy(0, pixelsToMoveValue);
        steps += 1;
      } else {
        clearInterval(scrollId);
        resolve();
      }
    }, timeBetweenStepsValue);
  });
}

function ScrollToTOp() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/**
 * Send a message to the devtools-panel when the scroll is done
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.data && request.autoScrollDown) {
    scrollToBottom(request.data);
    sendResponse({ fromcontent: 'Auto scroll launched' });
    return chrome.runtime.sendMessage({ id: request.tabId, autoScrollDone: true });
  }

  if (request.backToTop) {
    ScrollToTOp();
    sendResponse({ fromcontent: 'Back to top launched' });
    return chrome.runtime.sendMessage({ id: request.tabId });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let developmentMessageAutoScroll = document.getElementById('developmentMessageAutoScroll');
  let urlChromeExtMessageAutoScroll = document.getElementById('urlChromeExtMessageAutoScroll');
  let developmentMessageUserJourney = document.getElementById('developmentMessageUserJourney');
});
