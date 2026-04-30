import {hideConfigItemList} from '@/hide_element/hide_config_item';
import {getConfig} from '@/module/config/storage';

function sitePatternToRegExp(sitePattern: string): RegExp {
  const escapedPattern = sitePattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedPattern.replace(/\*/g, '.*')}$`);
}

function shouldApplyHideRule(sitePattern: string): boolean {
  return sitePatternToRegExp(sitePattern).test(location.href);
}

function hideElementsByXPath(elementXPath: string) {
  try {
    const result = document.evaluate(
        elementXPath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );

    for (let index = 0; index < result.snapshotLength; index += 1) {
      const node = result.snapshotItem(index);
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      node.style.setProperty('display', 'none', 'important');
    }
  } catch (error) {
    console.warn('Failed to apply hide rule XPath:', elementXPath, error);
  }
}

export async function hideElementMain() {
  const config = await getConfig();
  const activeHideRules = hideConfigItemList.filter((item, index) => {
    const isOn = config.hideElementItemIsOnList[index] ?? item.is_on;
    return isOn && shouldApplyHideRule(item.site_pattern);
  });

  if (activeHideRules.length === 0) {
    return;
  }

  const applyRules = () => {
    activeHideRules.forEach((item) => {
      item.element_xpath.forEach((elementXPath) => {
        hideElementsByXPath(elementXPath);
      });
    });
  };

  applyRules();

  const observer = new MutationObserver(() => {
    applyRules();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  setTimeout(() => {
    observer.disconnect();
  }, 5000);
}
