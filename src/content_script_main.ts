import {initHome} from '@/bilibili/home';
import {initVideo} from '@/bilibili/video';

if (location.host === 'www.bilibili.com') {
  if (location.pathname === '' || location.pathname === '/')  {
    console.log('init home called!')
    initHome()
  } else if (location.pathname === 'video') {
    initVideo()
  }
}
