export function wait(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export function getAverageValue(data: number[]) {
  let sum = data.reduce((partialSum: number, a) => partialSum + a, 0);
  return sum / data.length;
}

export const translate = (translateKey: string) => {
  let translatedLabel = '';
  if (translateKey) {
    try {
      translatedLabel = chrome.i18n.getMessage(translateKey);
    } catch (e) {
      console.warn('Warning ! YOu are trying to translate a null translateKey.');
    }
    translatedLabel = translatedLabel ? translatedLabel : translateKey;
  }

  return translatedLabel;
};

export const formatDate = (date: Date) => {
  return date.toLocaleString();
};

export const formatNumber = (value: number) => {
  return value.toFixed(2);
};
