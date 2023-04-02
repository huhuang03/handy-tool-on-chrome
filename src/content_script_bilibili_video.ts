import {init, showToast} from '@huhuang03/chrome_plugin_common'

const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

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

function setSpeed(speed) {
  let video = getVideo();
  if (!video) {
    return;
  }
  video.playbackRate = speed
  showToast(`x${speed}`)
}

function incrementSpeed() {
  const speed = getSpeed()
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.min(speeds.length - 1, index + 1) % speeds.length])
}

function decrementSpeed() {
  const speed = getSpeed()
  const index = speeds.indexOf(speed)
  setSpeed(speeds[Math.max(0, index - 1) % speeds.length])
}

init()
document.addEventListener('keydown', e => {
  if (e.shiftKey && e.key === '>') {
    incrementSpeed()
  } else if (e.shiftKey && e.key === '<') {
    decrementSpeed()
  }
})
