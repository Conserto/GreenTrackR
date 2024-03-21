import { logErr } from '../utils/log';
import { RequestAction } from '../enum';
import { DOM_INFOS, PAGE_HEIGHT } from '../const/action.const';
import { getDomSizeWithoutSvg } from '../service';
import { scrollPrompt } from '../utils';

const sentRuntimeMsg = (payload: any) => {
  chrome.runtime.sendMessage(payload).catch(reason => logErr(`Error when send message ${reason}`));
};

/**
 * Catch devtools messages
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
      scrollPrompt(Math.floor(request.value), 0, 5000).finally(() => {
        sentRuntimeMsg({ autoScrollDone: true });
      });
    } else if (request.action === RequestAction.LISTEN_EVENT) {
      window.addEventListener('click', () => sentRuntimeMsg({ saveAnalysis: true, component: 'click' }));
      window.addEventListener('scrollend', () => sentRuntimeMsg({ saveAnalysis: true, component: 'scroll' }));
    } else if (request.action === RequestAction.GET_DOM_ELEMENTS) {
      sentRuntimeMsg({ type: DOM_INFOS, value: getDomSizeWithoutSvg() });
    }
  }
});