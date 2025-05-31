export function init_no_document_hidden() {
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      // send message to background.js to keep tab alive
      // how to continue??
    }
  })
}
