export const DEFAULT_OPEN_TAB_TIME_INTERVAL = 200

export interface OpenTabList {
  links: [String],
  /**
   * 打开间隔时间, default is 200
   */
  timeInterval: number,
}
