'use client';
import { MoreHorizontal, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import GhostIconButton from './GhostIconButton';
import { useI18n } from '@/lib/i18n';
import { useUserProfile } from '@/lib/user-profile';

export default function Header({ createNewChat, sidebarCollapsed, setSidebarOpen }) {
  const [selectedBot, setSelectedBot] = useState('GPT-5');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, setLocale, locale } = useI18n();
  const { profile } = useUserProfile();
  const nickName = profile.name || '';

  function LogoIcon({ alt }) {
    // 取消 logo 图片渲染，避免因主题状态导致的水合不匹配
    return null;
  }

  const chatbots = [
    { name: 'GPT-5', icon: '🤖' },
    { name: 'Claude Sonnet 4', icon: '🎭' },
    { name: 'Gemini', icon: '💎' },
    { name: 'Assistant', icon: <LogoIcon alt={t('common.aiAssistant')} /> },
  ];

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
          aria-label={t('common.openSidebar')}
          aria-describedby="desc-open-sidebar-mobile"
          title={t('common.openSidebar') + ' (⌘B)'}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <span id="desc-open-sidebar-mobile" className="sr-only">
        打开侧边栏，支持快捷键 ⌘B
      </span>

      <div className="hidden md:flex relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
          aria-label={t('common.model') || '模型选择'}
          aria-describedby="desc-model-select"
          title={t('common.model') || '模型选择'}
        >
          {typeof chatbots.find((bot) => bot.name === selectedBot)?.icon === 'string' ? (
            <span className="text-sm">
              {chatbots.find((bot) => bot.name === selectedBot)?.icon}
            </span>
          ) : (
            chatbots.find((bot) => bot.name === selectedBot)?.icon
          )}
          {selectedBot}
          <ChevronDown className="h-4 w-4" />
        </button>
        <span id="desc-model-select" className="sr-only">
          选择当前对话模型
        </span>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
            {chatbots.map((bot) => (
              <button
                key={bot.name}
                onClick={() => {
                  setSelectedBot(bot.name);
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
              >
                {typeof bot.icon === 'string' ? (
                  <span className="text-sm">{bot.icon}</span>
                ) : (
                  bot.icon
                )}
                {bot.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {nickName && (
        <div className="hidden md:flex items-center text-sm text-zinc-600 dark:text-zinc-400 ml-2">
          {locale === 'zh-CN' ? `你好，${nickName}` : `Hi, ${nickName}`}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsLangOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
            aria-label={t('common.language')}
            aria-describedby="desc-language"
            title={t('common.language')}
          >
            {t(locale === 'zh-CN' ? 'common.zhCN' : 'common.enUS')}
            <ChevronDown className="h-4 w-4" />
          </button>
          <span id="desc-language" className="sr-only">
            选择界面语言
          </span>
          {isLangOpen && (
            <div className="absolute top-full right-0 mt-1 w-40 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
              <button
                onClick={() => {
                  setLocale('zh-CN');
                  setIsLangOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg"
                aria-label={t('common.zhCN')}
                title={t('common.zhCN')}
              >
                {t('common.zhCN')}
              </button>
              <button
                onClick={() => {
                  setLocale('en-US');
                  setIsLangOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 last:rounded-b-lg"
                aria-label={t('common.enUS')}
                title={t('common.enUS')}
              >
                {t('common.enUS')}
              </button>
            </div>
          )}
        </div>

        <GhostIconButton label={t('common.more')}>
          <MoreHorizontal className="h-4 w-4" />
        </GhostIconButton>
      </div>
    </div>
  );
}
