import {initHome} from '@/bilibili/home';
import {initVideo} from '@/bilibili/video';

if (location.host === 'www.bilibili.com') {
  if (location.pathname === '' || location.pathname === '/')  {
    initHome()
  } else if (location.pathname.startsWith('/video/')) {
    initVideo()
  }
}
