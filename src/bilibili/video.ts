import {init, showToast} from '@huhuang03/chrome_plugin_common'

const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

declare var chrome: any

function getVideo() {
  return document.querySelector("video")
}

function getSpeed() {
  let video = getVideo();
  if (!video) {
    return null
  }
  return video.playbackRate
}

const handledVideoList: string[] = []

// @ts-ignore
function setSpeed(speed, video?: HTMLVideoElement= null, showPrompt = false) {
  video = video || getVideo();
  if (!video) {
    return;
  }

  video.playbackRate = speed
  if (showPrompt) {
    showToast(`x${speed}`)
  }
  saveSpeed(speed)
}

function incrementSpeed() {
  const speed = getSpeed()
  if (!speed) {
    return
  }
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.min(speeds.length - 1, index + 1) % speeds.length], undefined, true)
}

function decrementSpeed() {
  const speed = getSpeed()
  if (!speed) {
    return
  }
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.max(0, index - 1) % speeds.length], undefined, true)
}

init()
const _KEY_SPEED = "key_speed"

function _restoreSpeed(showPrompt: boolean = false) {
  // @ts-ignore
  chrome.storage.sync.get([_KEY_SPEED]).then(res => {
    const video = getVideo()
    if (!video) {
      return
    }

    const src = video.getAttribute('src')
    if (!src) {
      return
    }

    if (handledVideoList.includes(src)) {
      return
    }

    const speed = res[_KEY_SPEED]
    if (speed) {
      setSpeed(speed, video, showPrompt)
    }
    handledVideoList.push(src)
  })
}

// @ts-ignore
function saveSpeed(speed) {
  chrome.storage.sync.set({'key_speed': speed}).then(() => {})
}

// hack way
function listenVideoChange() {
  let mutationObserver = new MutationObserver((mutations, observer) => {
    setTimeout(() => _restoreSpeed(false))
  });
  const video = getVideo()
  if (!video) {
    console.error("can't listen video change, because video is null")
    return
  }
  mutationObserver.observe(video, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  })
}

export function initVideo() {
  document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === '>') {
      incrementSpeed()
    } else if (e.shiftKey && e.key === '<') {
      decrementSpeed()
    }
  })
  setTimeout(_restoreSpeed)
  listenVideoChange()
}
