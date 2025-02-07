import {initHome} from '@/bilibili/home';
import {bilibiliInitVideo} from '@/bilibili/video';


export function bilibiliMain() {
  if (location.pathname === '' || location.pathname === '/')  {
    initHome()
  } else if (location.pathname.startsWith('/video/')) {
    bilibiliInitVideo()
  }
}
