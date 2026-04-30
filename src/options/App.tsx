import React, {useEffect, useState} from 'react';
import {hideConfigItemList} from '@/hide_element/hide_config_item';
import {BilibiliOpenAllPageEnum, ExtensionConfig} from '@/module/config/schema';
import {getConfig, setConfig} from '@/module/config/storage';

export function App() {
  const [config, setLocalConfig] = useState<ExtensionConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('Saved');

  useEffect(() => {
    async function init() {
      const loadedConfig = await getConfig();
      setLocalConfig(loadedConfig);
    }

    init().then();
  }, []);

  async function updateConfig(nextConfig: ExtensionConfig) {
    setLocalConfig(nextConfig);
    setIsSaving(true);
    setSaveMessage('Saving...');
    await setConfig(nextConfig);
    setIsSaving(false);
    setSaveMessage('Saved');
  }

  function getHideItemIsOn(index: number) {
    if (!config) {
      return false;
    }
    return config.hideElementItemIsOnList[index] ?? hideConfigItemList[index]?.is_on ?? false;
  }

  function updateHideItemIsOn(index: number, nextIsOn: boolean) {
    if (!config) {
      return;
    }

    const nextIsOnList = hideConfigItemList.map((item, currentIndex) => {
      if (currentIndex === index) {
        return nextIsOn;
      }
      return config.hideElementItemIsOnList[currentIndex] ?? item.is_on;
    });

    updateConfig({
      ...config,
      hideElementItemIsOnList: nextIsOnList
    }).then();
  }

  if (!config) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
      <div style={styles.page}>
        <div style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>Handy Tools</div>
            <h1 style={styles.title}>Hide Element Rules</h1>
            <p style={styles.subtitle}>
              Rules are defined manually in `hide_config_item.ts`. This page only controls whether each rule is on.
            </p>
          </div>
          <div style={styles.saveBadge(isSaving)}>{saveMessage}</div>
        </div>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Hide Rules</h2>
              <p style={styles.sectionText}>
                Toggle each predefined rule without editing its description, pattern, or XPath here.
              </p>
            </div>
          </div>

          {hideConfigItemList.length === 0 ? (
              <div style={styles.emptyState}>
                No hide rules found in `src/hide_element/hide_config_item.ts`.
              </div>
          ) : (
              <div style={styles.ruleList}>
                {hideConfigItemList.map((item, index) => (
                    <article key={index} style={styles.ruleCard}>
                      <div style={styles.ruleCardHeader}>
                        <strong style={styles.ruleTitle}>
                          {item.desc.trim() || `Rule ${index + 1}`}
                        </strong>
                        <label style={styles.toggleLabel}>
                          <input
                              type="checkbox"
                              checked={getHideItemIsOn(index)}
                              onChange={(event) => {
                                updateHideItemIsOn(index, event.target.checked);
                              }}
                          />
                          Enabled
                        </label>
                      </div>

                      <div style={styles.formGrid}>
                        <div style={styles.field}>
                          <span style={styles.label}>Site pattern</span>
                          <code style={styles.codeBlock}>{item.site_pattern}</code>
                        </div>

                        <div style={styles.fieldWide}>
                          <span style={styles.label}>Element XPath</span>
                          <code style={styles.codeBlock}>{item.element_xpath}</code>
                        </div>
                      </div>
                    </article>
                ))}
              </div>
          )}
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Bilibili</h2>
          <p style={styles.sectionText}>Keep the existing popup option mirrored here for convenience.</p>
          <div style={styles.radioRow}>
            {[BilibiliOpenAllPageEnum.FIVE, BilibiliOpenAllPageEnum.TEN].map((value) => (
                <label key={value} style={styles.radioCard(config.bilibiliOpenAllPages === value)}>
                  <input
                      type="radio"
                      name="openPages"
                      checked={config.bilibiliOpenAllPages === value}
                      onChange={() => {
                        updateConfig({
                          ...config,
                          bilibiliOpenAllPages: value
                        }).then();
                      }}
                  />
                  <span>{value} pages</span>
                </label>
            ))}
          </div>
        </section>
      </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '32px',
    color: '#0f172a',
    background: 'linear-gradient(180deg, #fffaf0 0%, #f8fafc 45%, #eef2ff 100%)',
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif'
  },
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif'
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    alignItems: 'flex-start',
    margin: '0 auto 24px',
    maxWidth: '1080px'
  },
  eyebrow: {
    fontSize: '12px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: '#9a3412',
    marginBottom: '10px'
  },
  title: {
    margin: 0,
    fontSize: '40px',
    lineHeight: 1.05
  },
  subtitle: {
    maxWidth: '760px',
    margin: '12px 0 0',
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#475569'
  },
  saveBadge: (isSaving: boolean) => ({
    padding: '10px 14px',
    borderRadius: '999px',
    background: isSaving ? '#ffedd5' : '#dcfce7',
    color: isSaving ? '#9a3412' : '#166534',
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const
  }),
  section: {
    maxWidth: '1080px',
    margin: '0 auto 24px',
    padding: '24px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.84)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
    backdropFilter: 'blur(10px)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    marginBottom: '20px'
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '24px'
  },
  sectionText: {
    margin: 0,
    color: '#475569',
    lineHeight: 1.6
  },
  emptyState: {
    border: '1px dashed #cbd5e1',
    borderRadius: '18px',
    padding: '24px',
    color: '#64748b',
    background: '#f8fafc'
  },
  ruleList: {
    display: 'grid',
    gap: '16px'
  },
  ruleCard: {
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    padding: '20px',
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
  },
  ruleCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '16px'
  },
  ruleTitle: {
    fontSize: '18px'
  },
  toggleLabel: {
    display: 'inline-flex',
    gap: '8px',
    alignItems: 'center',
    fontWeight: 600
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px'
  },
  field: {
    display: 'grid',
    gap: '8px'
  },
  fieldWide: {
    display: 'grid',
    gap: '8px',
    gridColumn: '1 / -1'
  },
  label: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#334155'
  },
  codeBlock: {
    display: 'block',
    padding: '12px 14px',
    borderRadius: '12px',
    background: '#e2e8f0',
    color: '#0f172a',
    fontSize: '13px',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const
  },
  radioRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const
  },
  radioCard: (checked: boolean) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    borderRadius: '16px',
    border: checked ? '1px solid #0f766e' : '1px solid #cbd5e1',
    background: checked ? '#ccfbf1' : '#ffffff',
    cursor: 'pointer',
    fontWeight: 600
  })
};
