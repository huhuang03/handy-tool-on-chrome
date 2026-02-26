import {DEFAULT_CONFIG, ExtensionConfig} from '@/module/config/schema';

export async function getConfig(): Promise<ExtensionConfig> {
  const data = await chrome.storage.sync.get(DEFAULT_CONFIG)
  return data as ExtensionConfig
}

export async function setConfig(patch: Partial<ExtensionConfig>) {
  await chrome.storage.sync.set(patch)
}
