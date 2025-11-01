'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// 确保 zh-CN.json 和 en-US.json 结构完全一致（字段一一对应）
import zhCN from '@/locales/zh-CN.json';
import enUS from '@/locales/en-US.json';

// 语言类型定义
type Locale = 'zh-CN' | 'en-US';
// 基于完整的语言包结构定义翻译类型（以字段更全的为准）
type Translations = Record<string, any>;

// 确保 en-US 符合 Translations 类型（若不符合需补充缺失字段）
// 若 en-US 字段不全，可临时断言（建议优先补全语言包）
const translations: Record<Locale, Translations> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  tWithVars?: (key: string, vars?: Record<string, string | number>) => string;
  tPlural?: (key: string, count: number, vars?: Record<string, string | number>) => string;
}

// 上下文默认值（安全降级）
const I18nContext = createContext<I18nContextType>({
  locale: 'zh-CN',
  setLocale: () => {},
  t: (key) => key,
  tWithVars: (key) => key,
  tPlural: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [localeState, setLocaleState] = useState<Locale>('zh-CN');

  // 初始化：从 localStorage 读取语言设置
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
      if (stored === 'zh-CN' || stored === 'en-US') {
        setLocaleState(stored as Locale);
      }
    } catch {}
  }, []);

  // 同步 <html lang>，增强可访问性与 SEO
  useEffect(() => {
    try {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = localeState;
      }
    } catch {}
  }, [localeState]);

  // 包装 setter：更新状态并持久化
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', next);
      }
    } catch {}
  };

  // 翻译函数（支持嵌套键）
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[localeState];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return typeof value === 'string' ? value : key;
  };

  const tWithVars = (key: string, vars: Record<string, string | number> = {}): string => {
    const raw = t(key);
    if (typeof raw !== 'string') return key;
    return raw.replace(/\{(\w+)\}/g, (_, v) =>
      vars[v] !== undefined ? String(vars[v]) : `{${v}}`
    );
  };

  // 复数规则支持：使用 Intl.PluralRules，根据当前 locale 自动选择 category
  const tPlural = (
    key: string,
    count: number,
    vars: Record<string, string | number> = {}
  ): string => {
    try {
      const rules = new Intl.PluralRules(localeState);
      const category = rules.select(count); // 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'
      const candidateKeys = [`${key}_${category}`, `${key}_other`, key];
      for (const ck of candidateKeys) {
        const raw = t(ck);
        if (raw !== ck) {
          return raw.includes('{') ? tWithVars(ck, { count, ...vars }) : raw;
        }
      }
      // 未命中任何翻译时，回退为 key
      return key;
    } catch {
      // Safari 等环境异常时的安全回退
      const raw = t(`${key}_other`) || t(key);
      return raw.includes('{') ? tWithVars(`${key}_other`, { count, ...vars }) : raw;
    }
  };

  return (
    <I18nContext.Provider value={{ locale: localeState, setLocale, t, tWithVars, tPlural }}>
      {children}
    </I18nContext.Provider>
  );
}

// 确保在 Provider 内使用
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
