export function isBilibiliUrl(href: string) {
  const url = new URL(href);
  return url.host === 'www.bilibili.com'
}

export function urlIsBilibiliHome(href: string) {
  const url = new URL(href);
  return url.host === 'www.bilibili.com' && (url.pathname === '' || url.pathname === '/')
}
