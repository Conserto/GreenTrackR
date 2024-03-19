import { logDebug, logErr, logInfo } from '../utils/log';
import { RequestAction } from '../enum';
import { DOM_INFOS, PAGE_HEIGHT } from '../const/action.const';
import { getDomSizeWithoutSvg } from '../service';
import { scrollPrompt } from '../utils';

const sentRuntimeMsg = (payload: any) => {
  chrome.runtime.sendMessage(payload).catch(reason => logErr(`Error when send message ${reason}`));
  logInfo('LastErr -> ' + chrome.runtime.lastError);
};

/**
 * Catch devtools messages
 */
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  logDebug('OnMessage');
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
    } else if (request.action === RequestAction.SCROLL_TO && request.value) {
      scrollPrompt(Math.floor(request.value), 0, 5000).then(() => {
        sentRuntimeMsg({ autoScrollDone: true });
      });
      /*      window.scrollTo({ top: 0 });
            window.scrollBy({ left: 0, top: Math.floor(request.value), behavior: 'smooth'});
            sentRuntimeMsg({ autoScrollDone: true });*/
    } else if (request.action === RequestAction.GET_DOM_ELEMENTS) {
      sentRuntimeMsg({ type: DOM_INFOS, value: getDomSizeWithoutSvg() });
    }
  }
});