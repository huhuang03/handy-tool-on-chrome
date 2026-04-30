export interface HideConfigItem {
  is_on: boolean;
  desc: string;
  site_pattern: string;
  element_xpath: string[];
}

export const hideConfigItemList: HideConfigItem[] = [
  {
    is_on: true,
    desc: '百度首页广告',
    site_pattern: 'https://www.baidu.com/*',
    element_xpath: ['//*[@id="s-hotsearch-wrapper"]', '//*[@id="chat-input-extension"]']
  }
];
