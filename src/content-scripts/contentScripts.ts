import { logDebug, logErr, scrollPrompt } from 'src/utils';
import { RequestAction } from 'src/enum';
import { DOM_INFOS, PAGE_HEIGHT } from 'src/const/action.const';
import { getDomSizeWithoutSvg } from 'src/service';
import browser from "webextension-polyfill";

const sentRuntimeMsg = (payload: any) => {
  browser.runtime.sendMessage(payload).catch(reason => logErr(`Error when send message ${reason}`));
};

/**
 * Catch devtools messages
 */
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request) {
    if (request.action === RequestAction.SCROLL_TO_TOP) {
      window.scrollTo({ top: 0 });
    } else if (request.action === RequestAction.SEND_PAGE_HEIGHT) {
      // Send total height of the page for autoscroll page
      sentRuntimeMsg({
        type: PAGE_HEIGHT,
        totalHeight: document.body.scrollHeight,
        viewportHeight: window.innerHeight
      });
    } else if (request.action === RequestAction.SCROLL_TO && request.value >= 0) {
      logDebug(`Receive scroll to ${request.value}`);
      scrollPrompt(Math.floor(request.value), 0, 5000).finally(() => {
        sentRuntimeMsg({ autoScrollDone: true });
      });
    } else if (request.action === RequestAction.LISTEN_EVENT) {
      window.addEventListener('click', () => sentRuntimeMsg({ saveAnalysis: true, component: 'click' }));
      window.addEventListener('scrollend', () => sentRuntimeMsg({ saveAnalysis: true, component: 'scroll' }));
    } else if (request.action === RequestAction.GET_DOM_ELEMENTS) {
      sentRuntimeMsg({ type: DOM_INFOS, value: getDomSizeWithoutSvg() });
    } else {
      logDebug(`No conditions match`);
    }
  }
});