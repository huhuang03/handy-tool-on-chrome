export function douyuMain() {
  new MutationObserver((mutationsList, observer) => {
    const childrenChanged = mutationsList.find(it => it.type === 'childList')!!
    if (childrenChanged) {
      fixHistoryTarget()
    }
  }).observe(document.getElementsByTagName('body')[0], {
    childList: true,
    subtree: true
  })
}

/**
 * change history link target to not '_blank'
 */
function fixHistoryTarget() {
  for (let a of document.querySelectorAll('a[href="/directory/watchHistory"][target="_blank"]')) {
    console.log('find a: ', a)
    a.removeAttribute('target')
  }
}
