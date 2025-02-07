import {initVideo} from '@/module/video/video';
import {RESERVED_URL_NAMING} from '@/ddys/constants';

/**
 * ddys's main
 */
export function ddysMain() {
  const pathname = location.pathname
  if (pathname == "/" || pathname == "" || !pathname) {
    return
  }
  const split = pathname.split("/")
  // reserved path
  if (split.length >= 2 && split[0] == '' && RESERVED_URL_NAMING.includes(split[1])) {
    return
  }
  initVideo()
}
