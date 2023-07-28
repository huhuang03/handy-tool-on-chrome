import {urlIsBilibiliHome} from '@/bilibili/bilibili_util'
test('some_test', () => {
  expect(urlIsBilibiliHome('https://www.bilibili.com/')).toBe(true)
  expect(urlIsBilibiliHome('https://www.bilibili.com?aa=bb')).toBe(true)
  expect(urlIsBilibiliHome('https://www.bilibili.com/aa?aa=bb')).toBe(false)
})
