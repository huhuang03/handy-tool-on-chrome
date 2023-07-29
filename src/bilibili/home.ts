import { isBilibiliUrl } from '@/bilibili/bilibili_util'
import {Callback} from 'webpack-cli';
import {removeClass} from '@/util';

const nextButtonRootClassName = 'feed-roll-btn';
const MAX = 6;

// @ts-ignore
const openedUrl = []

const openAllSvgPathList = [
  {
    d: 'M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z',
    fill: 'currentColor',
  },
  {
    d: 'M708.266667 465.066667l-234.666667-134.4c-8.533333-4.266667-17.066667-6.4-25.6-6.4-29.866667 0-53.333333 23.466667-53.333333 53.333333v268.8c0 8.533333 2.133333 19.2 6.4 25.6 10.666667 17.066667 27.733333 27.733333 46.933333 27.733333 8.533333 0 17.066667-2.133333 25.6-6.4l234.666667-134.4c8.533333-4.266667 14.933333-10.666667 19.2-19.2 6.4-12.8 8.533333-27.733333 4.266666-40.533333-2.133333-14.933333-10.666667-25.6-23.466666-34.133333z m-249.6 162.133333V396.8L661.333333 512l-202.666666 115.2z',
    fill: 'currentColor'
  }
]

// @ts-ignore
function createElementWithSvgNamespace(tagName) {
  return document.createElementNS("http://www.w3.org/2000/svg", tagName)
}

function getNextButtonElement(): HTMLElement | null {
  let roots = document.getElementsByClassName(nextButtonRootClassName);
  for (let root of roots) {
    let found = false;
    let spans = root.getElementsByTagName('span');
    for (let span of spans) {
      console.log(span);
      if (span.innerHTML === '换一换') {
        found = true;
        break;
      }
    }
    if (found) {
      return root as HTMLElement;
    }
  }
  return null;
}

function openAll() {
  let cards = document.getElementsByClassName('feed-card');
  // @ts-ignore
  cards = Array.from(cards).slice(0, MAX);

  let firstOpenUrl;
  for (let card of cards) {
    const a = card.getElementsByTagName('a')[0];
    const dataTargetUrl = a.getAttribute("data-target-url")
    if (!dataTargetUrl || isBilibiliUrl(dataTargetUrl)) {
      // @ts-ignore
      if (openedUrl.includes(dataTargetUrl)) {
        break;
      }
      if (!firstOpenUrl) {
        firstOpenUrl = dataTargetUrl;
      }
      a.dispatchEvent(new MouseEvent('click', {ctrlKey: true}));
    }
  }
  openedUrl.push(firstOpenUrl)
}

function init() {
  const nextButtonRoot = getNextButtonElement();
  if (nextButtonRoot == null) {
    console.error('why next button root is null?')
    return
  }

  const playAllButton = createButton(openAllSvgPathList, '全部', () => {
    openAll()
  })
  playAllButton.style.transform = `translate(10px, ${nextButtonRoot.clientHeight + 10}px)`;

  // @ts-ignore
  nextButtonRoot.parentElement.appendChild(playAllButton);
}

// 不断调用checkFunc。一旦返回ture，则调用func
// @ts-ignore
function waitAndDo(func, checkFunc, timeout, checkInterval = 50) {
  let startTime = new Date().getTime();
  _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval);
}

// @ts-ignore
function _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval) {
  setTimeout(() => {
    if (checkFunc()) {
      func();
    } else if ((new Date().getTime() - startTime) < timeout) {
      _waitAndDoOnce(startTime, func, checkFunc, timeout, checkInterval);
    }
  }, checkInterval);
}


function createButton(iconSvgPathList: any[], text: string, callback: Callback<never>): HTMLElement {
  const nextButtonRoot = getNextButtonElement();

  // @ts-ignore
  const dstButton = nextButtonRoot.cloneNode(true) as HTMLElement;
  // by check, need remove this
  removeClass(dstButton, 'smallest')
  // // @ts-ignore
  const span = dstButton.getElementsByTagName('span')[0]
  span.innerText = text;
  dstButton.onclick = () => callback();
  const svg = dstButton.getElementsByTagName("svg")[0]

  svg.setAttribute("viewBox", "0 0 1024 1024")
  for (let path of iconSvgPathList) {
    const pElement = createElementWithSvgNamespace("path")
    for (let key in path) {
      // @ts-ignore
      pElement.setAttribute(key, path[key])
    }
    svg.appendChild(pElement)
  }
  return dstButton as HTMLElement
}

export function initHome() {
  waitAndDo(init,
    () => getNextButtonElement(),
    2000);
}
