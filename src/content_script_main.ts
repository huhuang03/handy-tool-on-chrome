import {bilibiliMain} from '@/bilibili/bilibili_main';
import {douyuMain} from '@/douyu/douyu_main';

const host_map: {[key: string]: () => void} = {
  'www.bilibili.com': bilibiliMain,
  'www.douyu.com': douyuMain
}

const host = location.host
host_map[host]?.()
