export const injectStylesOnHead = (css: string) => {
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");

  head.appendChild(style);
  style.appendChild(document.createTextNode(css));
};
