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

// @ts-ignore
function setSpeed(speed) {
  let video = getVideo();
  console.log('video: ', video)
  if (!video) {
    return;
  }
  video.playbackRate = speed
  showToast(`x${speed}`)
  saveSpeed(speed)
}

function incrementSpeed() {
  const speed = getSpeed()
  if (!speed) {
    return
  }
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.min(speeds.length - 1, index + 1) % speeds.length])
}

function decrementSpeed() {
  const speed = getSpeed()
  if (!speed) {
    return
  }
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.max(0, index - 1) % speeds.length])
}

init()
const _KEY_SPEED = "key_speed"

function restoreSpeed() {
  // @ts-ignore
  chrome.storage.sync.get([_KEY_SPEED]).then(res => {
    const speed = res[_KEY_SPEED]
    if (speed) {
      setSpeed(speed)
    }
  })
}

// @ts-ignore
function saveSpeed(speed) {
  chrome.storage.sync.set({'key_speed': speed}).then(() => {})
}

export function initVideo() {
  document.addEventListener('keydown', e => {
    if (e.shiftKey && e.key === '>') {
      incrementSpeed()
    } else if (e.shiftKey && e.key === '<') {
      decrementSpeed()
    }
  })
  setTimeout(restoreSpeed)
}
