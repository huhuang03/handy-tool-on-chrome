import {showToast} from '@huhuang03/chrome_plugin_common'

const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

declare var chrome: any

function getVideo() {
  return document.querySelector('video')
}

function getSpeed() {
  let video = getVideo();
  if (!video) {
    return null
  }
  return video.playbackRate
}

const handledVideoList: string[] = []


class InitVideo {
  speedKey: string

  constructor(speedKey: string) {
    this.speedKey = speedKey

    document.addEventListener('keydown', e => {
      if (e.shiftKey && e.key === '>') {
        this.incrementSpeed()
      } else if (e.shiftKey && e.key === '<') {
        this.decrementSpeed()
      }
    })
    setTimeout(this._restoreSpeed)
    this.listenVideoChange()
  }

  saveSpeed(speed: number) {
    chrome.storage.sync.set({
      speedKey: speed
    }).then(() => {
    })
  }

  decrementSpeed() {
    const speed = getSpeed()
    if (!speed) {
      return
    }
    const index = speeds.indexOf(speed)
    this.setSpeed(speeds[Math.max(0, index - 1) % speeds.length], undefined, true)
  }


  incrementSpeed() {
    const speed = getSpeed()
    if (!speed) {
      return
    }
    const index = speeds.indexOf(speed)
    this.setSpeed(speeds[Math.min(speeds.length - 1, index + 1) % speeds.length], undefined, true)
  }


  listenVideoChange() {
    let mutationObserver = new MutationObserver((_mutations, _observer) => {
      setTimeout(() => this._restoreSpeed(false))
    });
    const video = getVideo()
    if (!video) {
      console.error('can\'t listen video change, because video is null')
      return
    }
    mutationObserver.observe(video, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    })
  }

  _restoreSpeed(showPrompt: boolean = false) {
    // @ts-ignore
    chrome.storage.sync.get([this.speedKey]).then(res => {
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

      const speed = res[this.speedKey]
      if (speed) {
        this.setSpeed(speed, video, showPrompt)
      }
      handledVideoList.push(src)
    })
  }

  // @ts-ignore
  setSpeed(speed, video?: HTMLVideoElement = null, showPrompt = false) {
    video = video || getVideo();
    if (!video) {
      return;
    }

    video.playbackRate = speed
    if (showPrompt) {
      showToast(`x${speed}`)
    }
    this.saveSpeed(speed)
  }
}

/**
 * 给video增加一些功能。
 * @param speedKey
 */
export function initVideo(speedKey: string) {
  new InitVideo(speedKey)
}
