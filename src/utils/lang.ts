import browser from "webextension-polyfill";

const PREFIX_HTML_KEY = '@';
const SUFFIX_HTML_FILE = '.html';
const SOURCE_HTML_FOLDER = '/descriptions/';

export const translate = (translateKey?: string) => {
  let translatedLabel = '';
  if (translateKey) {
    translatedLabel = browser.i18n.getMessage(translateKey) || translateKey;
  }
  return translatedLabel;
};

export const translateHtmlUrl = (translateKey?: string): string => {
  let translatedLabel = '';
  if (translateKey) {
    translatedLabel = browser.i18n.getMessage(translateKey);
    if (translatedLabel?.startsWith(PREFIX_HTML_KEY)) {
      return SOURCE_HTML_FOLDER + translatedLabel.replace(PREFIX_HTML_KEY, '') + SUFFIX_HTML_FILE;
    }
  }
  return '';
};