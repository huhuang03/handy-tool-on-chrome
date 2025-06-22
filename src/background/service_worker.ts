import {DEFAULT_OPEN_TAB_TIME_INTERVAL} from '@/bridge/open_tab_list';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`request: ${JSON.stringify(request)}, sender: ${JSON.stringify(sender)}`)
  const timeInterval = request.timeInterval || DEFAULT_OPEN_TAB_TIME_INTERVAL
  const links = (request.links ?? []) as string[]
  if (!links || links.length === 0) {
    return
  }

  for (let i = 0; i < links.length; i++) {
    const link = links[i]
    setTimeout(() => {
      getTab(sender.tab?.id, (tab: chrome.tabs.Tab | null) => {
        const targetIndex = (tab?.index ?? -1) + 1
        chrome.tabs.create({
          url: link,
          index: targetIndex,
          active: false,
        }).catch(console.error)
      })
    }, i * timeInterval)
  }
})

function getTab(tabId: number | null | undefined, callback: (tab: chrome.tabs.Tab | null) => void) {
  if (!tabId) {
    callback(null)
    return
  }
  chrome.tabs.get(tabId, callback)
}
