/** Opens cross-origin HTTP(S) links in a new tab with safe rel values. */
function setExternalLinkTarget(link) {
  let url;
  try {
    url = new URL(link.href, document.baseURI);
  } catch {
    return;
  }

  if ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== window.location.origin) {
    link.target = "_blank";
    link.relList.add("noopener", "noreferrer");
  }
}

/** Applies the external-link behavior to anchors within a document or element. */
function processExternalLinks(root) {
  const links = root instanceof HTMLAnchorElement
    ? [root, ...root.querySelectorAll("a[href]")]
    : root.querySelectorAll("a[href]");

  links.forEach(setExternalLinkTarget);
}

processExternalLinks(document);

// Handle links added later, including navigation loaded asynchronously.
new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node instanceof Element) {
        processExternalLinks(node);
      }
    });
  });
}).observe(document.documentElement, { childList: true, subtree: true });