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
    console.log(`speedKey: ${speedKey}`)

    document.addEventListener('keydown', e => {
      if (e.shiftKey && e.key === '>') {
        this.incrementSpeed()
      } else if (e.shiftKey && e.key === '<') {
        this.decrementSpeed()
      }
    })
    setTimeout(() => this._restoreSpeed(), 1000)
    this.listenVideoChange()
  }

  saveSpeed(speed: number) {
    console.log(`save speed: ${speed}, key: ${this.speedKey}`)
    chrome.storage.sync.set({
      [this.speedKey]: speed
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
    console.log(`_restoreSpeed begin, this.speedKey: ${this.speedKey}`)
    if (!this.speedKey) {
      return
    }
    console.log(`speedKey: ${this.speedKey}`)
    // @ts-ignore
    chrome.storage.sync.get([this.speedKey]).then(res => {
      console.log(`res: ${res}, ${JSON.stringify(res)}`)
      const video = getVideo()
      console.log(`video: ${video}`)
      if (!video) {
        return
      }

      const src = video.getAttribute('src')
      console.log(`src: ${src}`)
      if (!src) {
        return
      }

      console.log(`handledVideoList: ${handledVideoList.includes(src)}`)
      if (handledVideoList.includes(src)) {
        return
      }

      const speed = res[this.speedKey]
      if (speed) {
        console.log(`set speed, speed: ${speed}`)
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
  console.log('begin new InitVideo')
  new InitVideo(speedKey)
}
