for (const elem of document.querySelectorAll('[data-i18n]')) {
  const attribute = elem.getAttribute('data-i18n') || '';
  if (['INPUT', 'TEXTAREA'].includes(elem.tagName)) {
    // Retrieve the value between the [] in the data-i18n attribute
    const regexAttributeInBrackets = /(?<=\[).+?(?=\])/g;
    const getStringAttribute = regexAttributeInBrackets.exec(attribute)?.[0] || '';
    // Retrieve the value after the string and []
    const regexStringAfterBrackets = new RegExp(`(?<=\\[${getStringAttribute}\\]).+`, 'g');
    const getStringToTranslate = regexStringAfterBrackets.exec(attribute)?.[0] || '';

    elem.setAttribute(getStringAttribute, chrome.i18n.getMessage(getStringToTranslate));
  } else {
    let text = chrome.i18n.getMessage(attribute);
    if (text) {
      elem.appendChild(document.createTextNode(text));
    }
  }
}
