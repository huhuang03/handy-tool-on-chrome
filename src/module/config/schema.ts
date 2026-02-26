export enum BilibiliOpenAllPageEnum {
  FIVE = 5,
  TEN = 10
}

export interface ExtensionConfig {
  bilibiliOpenAllPages: BilibiliOpenAllPageEnum.FIVE | BilibiliOpenAllPageEnum.TEN;
}

export const DEFAULT_CONFIG: ExtensionConfig = {
  bilibiliOpenAllPages: BilibiliOpenAllPageEnum.TEN
}
