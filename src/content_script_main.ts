import {bilibiliMain} from '@/bilibili/bilibili_main';
import {douyuMain} from '@/douyu/douyu_main';
import {ddysMain} from '@/ddys/ddys';

const host_map: {[key: string]: () => void} = {
  'www.bilibili.com': bilibiliMain,
  'www.douyu.com': douyuMain,
  "ddys.pro": ddysMain
}

const host = location.host
host_map[host]?.()
