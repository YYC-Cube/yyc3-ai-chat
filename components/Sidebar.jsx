'use client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Asterisk,
  Clock,
  FileText,
  FolderIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  SearchIcon,
  Settings,
  X,
  Star,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ConversationRow from './ConversationRow';
import CreateFolderModal from './CreateFolderModal';
import CreateTemplateModal from './CreateTemplateModal';
import FolderRow from './FolderRow';
import SearchModal from './SearchModal';
import SettingsPopover from './SettingsPopover';
import SidebarSection from './SidebarSection';
import TemplateRow from './TemplateRow';
import ThemeToggle from './ThemeToggle';
import { cls } from './utils';
import { useI18n } from '@/lib/i18n';
import { useUserProfile } from '@/lib/user-profile';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollapsedControls } from '@/hooks/use-collapsed-controls';

export default function Sidebar({
  open,
  onClose,
  theme,
  setTheme,
  collapsed,
  setCollapsed,
  conversations,
  pinned,
  recent,
  folders,
  folderCounts,
  selectedId,
  onSelect,
  togglePin,
  query,
  setQuery,
  searchRef,
  createFolder,
  createNewChat,
  templates = [],
  setTemplates = () => {},
  onUseTemplate = () => {},
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  onRenameConversation,
  onDeleteConversation,
  onMoveConversation,
  onClearConversation,
  onExportConversation,
}) {
  const { t, tPlural, locale } = useI18n();
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [folderMenuOpen, setFolderMenuOpen] = useState(false);
  const [folderMenuSheetOpen, setFolderMenuSheetOpen] = useState(false);
  const isMobile = useIsMobile();
  const { collapseAll, expandAll } = useCollapsedControls(collapsed, setCollapsed);
  const { profile } = useUserProfile();

  // 在客户端挂载后再打开侧边栏，避免 SSR/CSR 初始渲染不一致
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // 语言自适应问候语
  const nickName = profile.name || '';
  const greeting = nickName
    ? locale === 'zh-CN'
      ? `你好，${nickName}`
      : `Hi, ${nickName}`
    : locale === 'zh-CN'
      ? '你好'
      : 'Hi';

  const getConversationsByFolder = (folderName) => {
    return conversations.filter((conv) => conv.folder === folderName);
  };

  const handleCreateFolder = (folderName) => {
    return createFolder(folderName);
  };

  const handleDeleteFolder = (folderName) => {
    const updatedConversations = conversations.map((conv) =>
      conv.folder === folderName ? { ...conv, folder: null } : conv
    );
    console.log('Delete folder:', folderName, 'Updated conversations:', updatedConversations);
  };

  const handleRenameFolder = (oldName, newName) => {
    const updatedConversations = conversations.map((conv) =>
      conv.folder === oldName ? { ...conv, folder: newName } : conv
    );
    console.log(
      'Rename folder:',
      oldName,
      'to',
      newName,
      'Updated conversations:',
      updatedConversations
    );
  };

  const handleCreateTemplate = (templateData) => {
    if (editingTemplate) {
      const updatedTemplates = templates.map((t) =>
        t.id === editingTemplate.id ? { ...templateData, id: editingTemplate.id } : t
      );
      setTemplates(updatedTemplates);
      setEditingTemplate(null);
    } else {
      const newTemplate = {
        ...templateData,
        id: Date.now().toString(),
      };
      setTemplates([...templates, newTemplate]);
    }
    setShowCreateTemplateModal(false);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowCreateTemplateModal(true);
  };

  const handleRenameTemplate = (templateId, newName) => {
    const updatedTemplates = templates.map((t) =>
      t.id === templateId ? { ...t, name: newName, updatedAt: new Date().toISOString() } : t
    );
    setTemplates(updatedTemplates);
  };

  const handleDeleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(updatedTemplates);
  };

  const handleUseTemplate = (template) => {
    onUseTemplate(template);
  };

  if (sidebarCollapsed) {
    return (
      <motion.aside
        initial={{ width: 320 }}
        animate={{ width: 64 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="z-50 flex min-h-dvh h-full shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:sticky md:top-0"
      >
        <div className="flex items-center justify-center border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="md:hidden rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label={t('common.openSidebar')}
            title={(t('common.openSidebar') || 'Open sidebar') + ' (⌘B)'}
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <button
            onClick={createNewChat}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label={t('common.newChat')}
            aria-describedby="desc-newchat"
            title={t('common.newChat') + ' (⌘N)'}
          >
            <Plus className="h-5 w-5" />
          </button>
          <span id="desc-newchat" className="sr-only">
            新建会话，创建一个新的聊天
          </span>

          <button
            onClick={() => setShowSearchModal(true)}
            className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
            aria-label={t('common.search')}
            aria-describedby="desc-search"
            title={t('common.search') + ' (⌘K)'}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <span id="desc-search" className="sr-only">
            搜索会话与模板
          </span>

          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Popover open={folderMenuOpen} onOpenChange={setFolderMenuOpen}>
                <PopoverTrigger asChild>
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    onTouchStart={() => {
                      const timer = setTimeout(() => {
                        if (isMobile) {
                          setFolderMenuSheetOpen(true);
                        } else {
                          setFolderMenuOpen(true);
                        }
                      }, 500);
                      // 保存到元素上，避免状态污染
                      // @ts-ignore
                      window.__folderMenuTimer = timer;
                    }}
                    onTouchEnd={() => {
                      // @ts-ignore
                      if (window.__folderMenuTimer) clearTimeout(window.__folderMenuTimer);
                    }}
                    className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                    aria-label={t('common.folders')}
                    aria-describedby="desc-folders"
                    title={t('common.folders')}
                  >
                    <FolderIcon className="h-5 w-5" />
                  </button>
                  <span id="desc-folders" className="sr-only">
                    打开文件夹菜单，支持创建/折叠全部/展开全部
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-2" align="center">
                  <button
                    className="w-full text-left px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      setShowCreateFolderModal(true);
                      setFolderMenuOpen(false);
                    }}
                  >
                    {t('button.createFolder')}
                  </button>
                  <button
                    className="mt-1 w-full text-left px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      collapseAll();
                      setFolderMenuOpen(false);
                    }}
                  >
                    {t('button.collapseAll')}
                  </button>
                  <button
                    className="mt-1 w-full text-left px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      expandAll();
                      setFolderMenuOpen(false);
                    }}
                  >
                    {t('button.expandAll')}
                  </button>
                </PopoverContent>
              </Popover>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-44">
              <ContextMenuItem onSelect={() => setShowCreateFolderModal(true)}>
                {t('button.createFolder')}
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => collapseAll()}>
                {t('button.collapseAll')}
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => expandAll()}>
                {t('button.expandAll')}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {/* Mobile Folder Menu Sheet */}
          {isMobile && (
            <Sheet open={folderMenuSheetOpen} onOpenChange={setFolderMenuSheetOpen}>
              <SheetContent side="bottom" className="p-4">
                <div className="space-y-2">
                  <button
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      setShowCreateFolderModal(true);
                      setFolderMenuSheetOpen(false);
                    }}
                  >
                    {t('button.createFolder')}
                  </button>
                  <button
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      collapseAll();
                      setFolderMenuSheetOpen(false);
                    }}
                  >
                    {t('button.collapseAll')}
                  </button>
                  <button
                    className="w-full text-left px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => {
                      expandAll();
                      setFolderMenuSheetOpen(false);
                    }}
                  >
                    {t('button.expandAll')}
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="mt-auto mb-4">
            <SettingsPopover>
              <button
                className="rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                aria-label={t('common.settings')}
                aria-describedby="desc-settings"
                title={t('common.settings')}
              >
                <Settings className="h-5 w-5" />
              </button>
              <span id="desc-settings" className="sr-only">
                打开设置与偏好
              </span>
            </SettingsPopover>
          </div>
        </div>
      </motion.aside>
    );
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(open || mounted) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -340 }}
            animate={{ x: open ? 0 : 0 }}
            exit={{ x: -340 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={cls(
              'z-50 flex min-h-dvh h-full w-80 shrink-0 flex-col border-r border-zinc-200/60 bg-white dark:border-zinc-800 dark:bg-zinc-900',
              'fixed inset-y-0 left-0 md:sticky md:top-0 md:translate-x-0'
            )}
          >
            <div className="flex items-center gap-2 border-b border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <img
                  src={theme === 'dark' ? '/yyc3-logo-white.png' : '/yyc3-logo-blue.png'}
                  alt="YYC³ AI"
                  className="h-8 w-8 rounded-xl object-contain"
                />
                <div className="flex flex-col">
                  <div className="text-sm font-semibold tracking-tight">
                    {t('common.aiAssistant')}
                  </div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => setSidebarCollapsed(true)}
                  className="hidden md:block rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                  aria-label={t('common.closeSidebar')}
                  aria-describedby="desc-collapse-sidebar"
                  title={(t('common.closeSidebar') || 'Close sidebar') + ' (⌘B)'}
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
                <span id="desc-collapse-sidebar" className="sr-only">
                  折叠侧边栏以节省空间
                </span>

                <button
                  onClick={onClose}
                  className="md:hidden rounded-xl p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
                  aria-label={t('common.close')}
                  aria-describedby="desc-close-sidebar-mobile"
                  title={t('common.closeSidebar') || 'Close sidebar'}
                >
                  <X className="h-5 w-5" />
                </button>
                <span id="desc-close-sidebar-mobile" className="sr-only">
                  关闭移动端侧边栏
                </span>
              </div>
            </div>

            <div className="px-3 pt-3">
              <label htmlFor="search" className="sr-only">
                {t('common.search')}
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  id="search"
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('input.searchPlaceholder')}
                  onClick={() => setShowSearchModal(true)}
                  onFocus={() => setShowSearchModal(true)}
                  className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950/50"
                />
              </div>
            </div>

            <div className="px-3 pt-3">
              <button
                onClick={createNewChat}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-zinc-900"
                aria-label={t('common.newChat')}
                aria-describedby="desc-newchat-main"
                title={t('common.newChat') + ' (⌘N)'}
              >
                <Plus className="h-4 w-4" /> {t('common.newChat')}
              </button>
              <span id="desc-newchat-main" className="sr-only">
                创建新会话，支持快捷键 ⌘N
              </span>
            </div>

            <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
              <SidebarSection
                icon={<Star className="h-4 w-4" />}
                title={t('common.pinnedChats') || 'PINNED CHATS'}
                collapsed={collapsed.pinned}
                onToggle={() => setCollapsed((s) => ({ ...s, pinned: !s.pinned }))}
              >
                {pinned.length === 0 ? (
                  <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    {t('message.pinnedEmpty')}
                  </div>
                ) : (
                  pinned.map((c) => (
                    <ConversationRow
                      key={c.id}
                      data={c}
                      active={c.id === selectedId}
                      onSelect={() => onSelect(c.id)}
                      onTogglePin={() => togglePin(c.id)}
                      onRenameConversation={onRenameConversation}
                      onDeleteConversation={onDeleteConversation}
                      availableFolders={folders}
                      onMoveConversation={onMoveConversation}
                      onClearConversation={onClearConversation}
                      onExportConversation={onExportConversation}
                    />
                  ))
                )}
              </SidebarSection>

              <SidebarSection
                icon={<Clock className="h-4 w-4" />}
                title={t('common.recent')}
                collapsed={collapsed.recent}
                onToggle={() => setCollapsed((s) => ({ ...s, recent: !s.recent }))}
              >
                {recent.length === 0 ? (
                  <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                    {t('message.recentEmpty')}
                  </div>
                ) : (
                  recent.map((c) => (
                    <ConversationRow
                      key={c.id}
                      data={c}
                      active={c.id === selectedId}
                      onSelect={() => onSelect(c.id)}
                      onTogglePin={() => togglePin(c.id)}
                      onRenameConversation={onRenameConversation}
                      onDeleteConversation={onDeleteConversation}
                      availableFolders={folders}
                      onMoveConversation={onMoveConversation}
                      onClearConversation={onClearConversation}
                      onExportConversation={onExportConversation}
                    />
                  ))
                )}
              </SidebarSection>

              <SidebarSection
                icon={<FolderIcon className="h-4 w-4" />}
                title={
                  <span className="flex items-center gap-2">
                    <span>{t('common.folders')}</span>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {folders.length} {tPlural('common.folders', folders.length)}
                    </span>
                  </span>
                }
                collapsed={collapsed.folders}
                onToggle={() => setCollapsed((s) => ({ ...s, folders: !s.folders }))}
              >
                <div className="-mx-1">
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    aria-label={t('button.createFolder')}
                    aria-describedby="desc-create-folder"
                    title={t('button.createFolder')}
                  >
                    <Plus className="h-4 w-4" /> {t('button.createFolder')}
                  </button>
                  <span id="desc-create-folder" className="sr-only">
                    创建新的文件夹以组织会话
                  </span>

                  {folders.map((f) => (
                    <FolderRow
                      key={f.id}
                      name={f.name}
                      count={folderCounts[f.name] || 0}
                      conversations={getConversationsByFolder(f.name)}
                      selectedId={selectedId}
                      onSelect={onSelect}
                      togglePin={togglePin}
                      onDeleteFolder={handleDeleteFolder}
                      onRenameFolder={handleRenameFolder}
                      onRenameConversation={onRenameConversation}
                      onDeleteConversation={onDeleteConversation}
                      availableFolders={folders}
                      onMoveConversation={onMoveConversation}
                    />
                  ))}
                </div>
              </SidebarSection>

              <SidebarSection
                icon={<FileText className="h-4 w-4" />} // Replaced StarOff with FileText for better template metaphor
                title={
                  <span className="flex items-center gap-2">
                    <span>{t('common.templates')}</span>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {(Array.isArray(templates) ? templates : []).length}{' '}
                      {tPlural(
                        'common.templates',
                        (Array.isArray(templates) ? templates : []).length
                      )}
                    </span>
                  </span>
                }
                collapsed={collapsed.templates}
                onToggle={() => setCollapsed((s) => ({ ...s, templates: !s.templates }))}
              >
                <div className="-mx-1">
                  <button
                    onClick={() => setShowCreateTemplateModal(true)}
                    className="mb-2 inline-flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    aria-label={t('button.createTemplate')}
                    aria-describedby="desc-create-template"
                    title={t('button.createTemplate')}
                  >
                    <Plus className="h-4 w-4" /> {t('button.createTemplate')}
                  </button>
                  <span id="desc-create-template" className="sr-only">
                    创建新的模板以复用提示与设置
                  </span>

                  {(Array.isArray(templates) ? templates : []).map((template) => (
                    <TemplateRow
                      key={template.id}
                      template={template}
                      onUseTemplate={handleUseTemplate}
                      onEditTemplate={handleEditTemplate}
                      onRenameTemplate={handleRenameTemplate}
                      onDeleteTemplate={handleDeleteTemplate}
                    />
                  ))}

                  {(!templates || templates.length === 0) && (
                    <div className="select-none rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {t('message.template.empty')} {t('message.template.emptyAction')}
                      <div className="mt-1 opacity-70">{t('message.template.searchTip')}</div>
                    </div>
                  )}
                </div>
              </SidebarSection>
            </nav>

            <div className="mt-auto border-t border-zinc-200/60 px-3 py-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <SettingsPopover>
                  <button className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800">
                    <Settings className="h-4 w-4" /> {t('common.settings')}
                  </button>
                </SettingsPopover>
                <div className="ml-auto">
                  <ThemeToggle theme={theme} setTheme={setTheme} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-zinc-50 p-2 dark:bg-zinc-800/60">
                {(() => {
                  const name = (nickName || '').trim();
                  const ch = name.charAt(0);
                  const monogram = ch
                    ? /[a-z]/.test(ch)
                      ? ch.toUpperCase()
                      : ch
                    : t('common.userLabel');
                  const displayName = name || t('common.userLabel');
                  return (
                    <>
                      <div
                        className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900"
                        title={displayName}
                        aria-label={displayName}
                      >
                        {monogram}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{displayName}</div>
                        <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {t('common.proWorkspace')}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreateFolder={handleCreateFolder}
      />

      <CreateTemplateModal
        isOpen={showCreateTemplateModal}
        onClose={() => {
          setShowCreateTemplateModal(false);
          setEditingTemplate(null);
        }}
        onCreateTemplate={handleCreateTemplate}
        editingTemplate={editingTemplate}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        conversations={conversations}
        selectedId={selectedId}
        onSelect={onSelect}
        togglePin={togglePin}
        createNewChat={createNewChat}
      />
    </>
  );
}

{
  /* 新建文件夹按钮 */
}
