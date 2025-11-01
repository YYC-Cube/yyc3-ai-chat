'use client';

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Pencil, RefreshCw, Check, X, Square, Copy, Trash2 } from 'lucide-react';
import Message from './Message';
import Composer from './Composer';
import { cls, timeAgo } from './utils';
import { useI18n } from '@/lib/i18n';
import { useUserProfile } from '@/lib/user-profile';

function ThinkingMessage({ onPause }) {
  const [streamedText, setStreamedText] = useState('');
  const [completed, setCompleted] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    let i = 0;
    const fullText = `${t('message.analyzingIntro')}\n\n${t('message.suggestIntro')}`;
    const words = fullText.split(' ');

    const interval = setInterval(() => {
      if (i < words.length) {
        setStreamedText((prev) => prev + (i > 0 ? ' ' : '') + words[i]);
        i++;
      } else {
        setCompleted(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [t]);

  return (
    <Message role="assistant">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
          </div>
          <span className="text-sm text-zinc-500">
            {completed ? t('message.responseReady') : t('message.generatingResponse')}
          </span>
          <button
            onClick={onPause}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title={t('button.pause')}
            aria-label={t('button.pause')}
          >
            <Square className="h-3 w-3" /> {t('button.pause')}
          </button>
        </div>
        {streamedText && (
          <div className="whitespace-pre-wrap text-sm">
            {streamedText}
            {!completed && <span className="animate-pulse">|</span>}
          </div>
        )}
      </div>
    </Message>
  );
}

function AssistantMessage({ streamedText, completed, onPauseThinking }) {
  const { t } = useI18n();
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
  return (
    <Message
      role="assistant"
      avatarSrc={isDark ? '/yyc3-logo-white.png' : '/yyc3-logo-blue.png'}
      name={t('common.aiLabel')}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            title={t('button.pause')}
            aria-label={t('button.pause')}
          >
            <Square className="h-3 w-3" /> {t('button.pause')}
          </button>
        </div>
        {streamedText && (
          <div className="whitespace-pre-wrap text-sm">
            {streamedText}
            {!completed && <span className="animate-pulse">|</span>}
          </div>
        )}
      </div>
    </Message>
  );
}

const ChatPane = forwardRef(function ChatPane(
  {
    conversation,
    onSend,
    onEditMessage,
    onResendMessage,
    onDeleteMessage,
    onCopyMessage,
    onSelectMessage,
    selectedMessageId,
    isThinking,
    onPauseThinking,
  },
  ref
) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const composerRef = useRef(null);
  const { t, tWithVars, tPlural, locale } = useI18n();
  const { profile } = useUserProfile();
  const nickName = profile.name || '';

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent);
      },
    }),
    []
  );

  if (!conversation) return null;

  const tags = [
    t('common.certified'),
    t('common.personalized'),
    t('common.experienced'),
    t('common.helpful'),
  ];
  const messages = Array.isArray(conversation.messages) ? conversation.messages : [];
  const count = messages.length || conversation.messageCount || 0;

  // 个性化欢迎语：无消息时展示
  const baseHello = t('chat.previewHello');
  const welcomeText = nickName
    ? locale === 'zh-CN'
      ? `你好，${nickName}，开始聊天吧...`
      : `Hi ${nickName}, say hello to start...`
    : baseHello && baseHello !== 'chat.previewHello'
      ? baseHello
      : locale === 'zh-CN'
        ? '你好，开始聊天吧...'
        : 'Say hello to start...';

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex-1 space-y-5 px-4 pt-14 sm:px-8 md:pt-6 pb-28">
        <div className="mb-2 text-3xl font-serif tracking-tight sm:text-4xl md:text-5xl">
          <span className="block leading-[1.05] font-sans text-2xl">{conversation.title}</span>
        </div>
        <div className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          {tWithVars('message.updatedAgo', { time: timeAgo(conversation.updatedAt, locale) })} ·{' '}
          {count} {tPlural('message.messages', count)}
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-zinc-200 pb-5 dark:border-zinc-800">
          {tags.map((tItem) => (
            <span
              key={tItem}
              className="inline-flex items-center rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
            >
              {tItem}
            </span>
          ))}
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            {welcomeText}
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div
                key={m.id}
                className={cls(
                  'space-y-2 rounded-lg',
                  selectedMessageId === m.id ? 'ring-2 ring-blue-500/70' : ''
                )}
                onClick={() => onSelectMessage?.(m.id)}
              >
                <Message role="user">
                  <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                </Message>
                <div className="pl-10 flex items-center gap-2">
                  <button
                    onClick={() => onCopyMessage?.(conversation.id, m.id)}
                    className="rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    title={t('button.copy') || '复制'}
                    aria-label={t('button.copy') || '复制'}
                  >
                    <Copy className="h-3 w-3" /> {t('button.copy') || '复制'}
                  </button>
                  <button
                    onClick={() => onDeleteMessage?.(conversation.id, m.id)}
                    className="rounded-full border border-zinc-300 px-2 py-1 text-xs text-red-600 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    title={t('button.delete')}
                    aria-label={t('button.delete')}
                  >
                    <Trash2 className="h-3 w-3" /> {t('button.delete')}
                  </button>
                  <button
                    onClick={() => onResendMessage?.(m.id)}
                    className="rounded-full border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    title={t('button.resend') || '重发'}
                    aria-label={t('button.resend') || '重发'}
                  >
                    <RefreshCw className="h-3 w-3" /> {t('button.resend') || '重发'}
                  </button>
                </div>
              </div>
            ))}

            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </>
        )}
      </div>
      <div className="sticky bottom-0 z-20 border-t border-zinc-200/70 bg-background/85 backdrop-blur dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]">
        <Composer ref={composerRef} onSend={onSend} busy={busy || isThinking} />
      </div>
    </div>
  );
});

export default ChatPane;
