import { RequestAction } from 'src/enum';
import { getDomSizeWithoutSvg } from 'src/utils/service';

const sentRuntimeMsg = (payload: any) => {
  chrome.runtime.sendMessage(payload);
};

/**
 * Catch devtools messages
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request) {
    if (request.action === RequestAction.SCROLL_TO_TOP) {
      window.scrollTo({ top: 0 });
    } else if (request.action === RequestAction.SEND_PAGE_HEIGHT) {
      // Send total height of the page for autoscroll page
      sentRuntimeMsg({ type: 'pageHeight', height: document.body.scrollHeight });
    } else if (request.action === RequestAction.SCROLL_TO && request.value) {
      window.scrollBy(0, request.value);
      sentRuntimeMsg({ autoScrollDone: true });
    } else if (request.action === RequestAction.GET_DOM_ELEMENTS) {
      sentRuntimeMsg({ type: 'domInfos', value: getDomSizeWithoutSvg() });
    }
  }
});
