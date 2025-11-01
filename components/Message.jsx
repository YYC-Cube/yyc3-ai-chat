import { useEffect, useState } from 'react';

import { cls } from './utils';

import { useI18n } from '@/lib/i18n';
import { useUserProfile } from '@/lib/user-profile';

export default function Message({ role, children, avatarSrc, name }) {
  const isUser = role === 'user';
  const { t } = useI18n();
  const { profile } = useUserProfile();

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  const getUserMonogram = () => {
    const nameText = (profile.name || '').trim();
    const ch = nameText.charAt(0);
    if (!ch) return t('common.userLabel');
    return /[a-z]/.test(ch) ? ch.toUpperCase() : ch;
  };

  const userTitle = (profile.name || '').trim() || t('common.userLabel');

  return (
    <div className={cls('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <img
          src={avatarSrc || (isDark ? '/yyc3-logo-white.png' : '/yyc3-logo-blue.png')}
          alt={name || t('common.aiAssistant')}
          className="mt-0.5 h-7 w-7 rounded-full object-contain"
        />
      )}
      <div
        className={cls(
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          isUser
            ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
            : 'bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800'
        )}
      >
        {children}
      </div>
      {isUser && (
        <div
          className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-900"
          title={userTitle}
          aria-label={userTitle}
        >
          {getUserMonogram()}
        </div>
      )}
    </div>
  );
}
