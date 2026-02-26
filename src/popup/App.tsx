// use this thing to open react is not very good, because react use many process.env (node) way.
import React, {useEffect, useState} from 'react';
import {BilibiliOpenAllPageEnum, ExtensionConfig} from '@/module/config/schema';
import {getConfig} from '@/module/config/storage';

export function App() {
  const [config, setLocalConfig] = useState<ExtensionConfig | null>(null);
  useEffect(() => {
    async function init() {
      const config = await getConfig();
      setLocalConfig(config);
    }
    init().then()
  }, []);
  if (!config) {
    return <div>Loading...</div>
  }
  return (<div>
    <h3>Bilibili Open Pages</h3>
    {
      [BilibiliOpenAllPageEnum.FIVE, BilibiliOpenAllPageEnum.TEN].map(value =>
        <label key={value}>
          <input type="radio"
                 name="openPages"
                 checked={config.bilibiliOpenAllPages === value}>
          </input>
          {value} pages
        </label>
      )
    }
  </div>)
}
