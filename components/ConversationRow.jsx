import React, { useState, useRef, useEffect } from 'react';
import { Star, MoreHorizontal, FolderIcon } from 'lucide-react';
import { cls, timeAgo } from './utils';
import { useI18n } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function ConversationRow({ data, active, onSelect, onTogglePin, showMeta, onRenameConversation, onDeleteConversation, availableFolders = [], onMoveConversation, onClearConversation, onExportConversation }) {
  const { t, locale, tPlural } = useI18n();
  const { toast } = useToast();
  const count = Array.isArray(data.messages) ? data.messages.length : data.messageCount;
  const [showMenu, setShowMenu] = useState(false);
  const [showMoveList, setShowMoveList] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        setShowMoveList(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleRename = () => {
    const newTitle = prompt(`${t('message.conversationRename') || '重命名会话'}:`, data.title);
    if (newTitle && newTitle.trim() && newTitle.trim() !== data.title) {
      onRenameConversation?.(data.id, newTitle.trim());
      toast({
        title: t('button.rename'),
        description: `“${data.title}” → “${newTitle.trim()}”`,
      });
    }
    setShowMenu(false);
    setShowMoveList(false);
  };

  const handleDelete = () => {
    if (confirm(`${t('message.conversationConfirmDelete') || '确认删除会话'} "${data.title}"?`)) {
      onDeleteConversation?.(data.id);
      toast({
        title: t('button.delete'),
        description: `“${data.title}” ${t('message.deleted') || '已删除'}`,
      });
    }
    setShowMenu(false);
    setShowMoveList(false);
  };

  const handleMoveClick = () => {
    // 打开下拉列表选择文件夹
    if (Array.isArray(availableFolders) && availableFolders.length > 0) {
      setShowMoveList((v) => !v);
    } else {
      const target = prompt(`${t('button.moveToFolder') || '移动到文件夹'}:`, data.folder || '');
      if (target && target.trim()) {
        onMoveConversation?.(data.id, target.trim());
        toast({ title: t('button.moveToFolder') || '移动到文件夹', description: `“${target.trim()}”` });
      }
      setShowMenu(false);
      setShowMoveList(false);
    }
  };

  const handleSelectFolder = (folderName) => {
    onMoveConversation?.(data.id, folderName);
    toast({ title: t('button.moveToFolder') || '移动到文件夹', description: `“${folderName}”` });
    setShowMenu(false);
    setShowMoveList(false);
  };

  const handleClear = () => {
    onClearConversation?.(data.id);
    setShowMenu(false);
    setShowMoveList(false);
  };

  const handleExport = () => {
    onExportConversation?.(data.id);
    setShowMenu(false);
    setShowMoveList(false);
  };

  return (
    <div className="group relative">
      <div
        onClick={onSelect}
        className={cls(
          '-mx-1 flex w-[calc(100%+8px)] items-center gap-2 rounded-lg px-2 py-2 text-left',
          active
            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800/60 dark:text-zinc-100'
            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
        )}
        title={data.title}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium tracking-tight">{data.title}</span>
            <span className="shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400">
              {timeAgo(data.updatedAt, locale)}
            </span>
          </div>
          {showMeta && (
            <div className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              - {count} {t('message.messages')}+ {count} {tPlural('message.messages', count)}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin?.(data.id);
          }}
          className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          aria-label={data.pinned ? t('button.unpin') : t('button.pin')}
          title={(data.pinned ? t('button.unpin') : t('button.pin'))}
        >
          <Star className={cls('h-4 w-4', data.pinned ? 'fill-current text-current' : '')} />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((v) => !v);
              setShowMoveList(false);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-opacity"
            aria-label={t('button.moreOptions')}
            title={t('button.moreOptions')}
          >
            <MoreHorizontal className="h-3 w-3" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-[100]"
              >
                <button
                  onClick={handleRename}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={t('button.rename')}
                  title={t('button.rename')}
                >
                  {t('button.rename')}
                </button>
                <div className="px-2 py-1">
                  <button
                    onClick={handleMoveClick}
                    className="w-full rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label={t('button.moveToFolder') || '移动到文件夹'}
                    title={t('button.moveToFolder') || '移动到文件夹'}
                  >
                    <span className="inline-flex items-center gap-1"><FolderIcon className="h-3 w-3" />{t('button.moveToFolder') || '移动到文件夹'}</span>
                  </button>
                  {showMoveList && (
                    <div className="mt-1 max-h-40 overflow-auto rounded border border-zinc-200 dark:border-zinc-800">
                      {availableFolders.length === 0 && (
                        <div className="px-2 py-2 text-[11px] text-zinc-500 dark:text-zinc-400">{t('message.noFolders') || '暂无文件夹'}</div>
                      )}
                      {availableFolders.map((f) => (
                        <button
                          key={f.name}
                          onClick={() => handleSelectFolder(f.name)}
                          className={cls('block w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800', f.name === data.folder ? 'text-blue-600 dark:text-blue-400' : '')}
                          title={f.name}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleExport}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={t('common.export') || '导出'}
                  title={t('common.export') || '导出'}
                >
                  {t('common.export') || '导出'}
                </button>
                <button
                  onClick={handleClear}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={t('button.clearConversation') || '清空会话'}
                  title={t('button.clearConversation') || '清空会话'}
                >
                  {t('button.clearConversation') || '清空会话'}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={t('button.delete')}
                  title={t('button.delete')}
                >
                  {t('button.delete')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
