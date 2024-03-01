export const getDomSizeWithoutSvg = () => {
  let dom_size = document.getElementsByTagName('*').length;
  const svgElements = document.getElementsByTagName('svg');

  for (let i = 0; i < svgElements.length; i++) {
    dom_size -= getNbChildsExcludingNestedSvg(svgElements[i]) - 1;
  }
  return dom_size;
};

const getNbChildsExcludingNestedSvg = (element: any) => {
  if (element.nodeType === Node.TEXT_NODE) return 0;

  let nb_elements = 1;

  for (let i = 0; i < element.childNodes.length; i++) {
    // deal with svg nested case
    if (element.childNodes[i].tagName !== 'svg')
      nb_elements += getNbChildsExcludingNestedSvg(element.childNodes[i]);
    else nb_elements += 1;
  }
  return nb_elements;
};
