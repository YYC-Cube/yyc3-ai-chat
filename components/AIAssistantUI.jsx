'use client';

import { Calendar, LayoutGrid, MoreHorizontal } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ChatPane from './ChatPane';
import GhostIconButton from './GhostIconButton';
import Header from './Header';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { INITIAL_CONVERSATIONS, INITIAL_FOLDERS, INITIAL_TEMPLATES } from './mockData';
import { useI18n } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

export default function AIAssistantUI() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme');
    if (saved) return saved;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      return 'dark';
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      const media = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
      if (!media) return;
      const listener = (e) => {
        const saved = localStorage.getItem('theme');
        if (!saved) setTheme(e.matches ? 'dark' : 'light');
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } catch {}
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem('sidebar-collapsed');
      return raw
        ? JSON.parse(raw)
        : { pinned: true, recent: false, folders: false, templates: true };
    } catch {
      return { pinned: true, recent: false, folders: false, templates: true };
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed-state');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed-state', JSON.stringify(sidebarCollapsed));
    } catch {}
  }, [sidebarCollapsed]);

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('chat-conversations');
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });
  const [selectedId, setSelectedId] = useState(null);
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [folders, setFolders] = useState(INITIAL_FOLDERS);

  useEffect(() => {
    localStorage.setItem('chat-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const composerRef = useRef(null);

  const [isThinking, setIsThinking] = useState(false);
  const [thinkingConvId, setThinkingConvId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewChat();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // 聚焦搜索框以触发搜索弹窗
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
      // 删除消息：⌘D
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId && selectedMessageId) {
          deleteMessage(selectedId, selectedMessageId);
        }
      }
      // 清空会话：⌘⇧K
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (selectedId) clearConversation(selectedId);
      }
      // 导出会话：⌘E
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (selectedId) exportConversation(selectedId);
      }
      // 复制选中消息（可选）：⌘C
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        if (selectedId && selectedMessageId) {
          e.preventDefault();
          copyMessage(selectedId, selectedMessageId);
        }
      }
      if (!e.metaKey && !e.ctrlKey && e.key === '/') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          searchRef.current?.focus();
        }
      }
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen, conversations, selectedId, selectedMessageId]);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      createNewChat();
    }
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const pinned = filtered
    .filter((c) => c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10);

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]));
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1;
    return map;
  }, [conversations, folders]);

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)));
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2);
    const item = {
      id,
      title: t('common.newChat'),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: t('chat.previewHello'),
      pinned: false,
      folder: t('folders.default'),
      messages: [], // Ensure messages array is empty for new chats
    };
    setConversations((prev) => [item, ...prev]);
    setSelectedId(id);
    setSidebarOpen(false);
  }

  function deleteConversation(id) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    toast({
      title: t('button.delete'),
      description: t('message.conversationDeleted') || '会话已删除',
    });
  }

  function renameConversation(id, newTitle) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c
      )
    );
    toast({
      title: t('button.rename'),
      description: newTitle,
    });
  }

  function sendMessage(convId, content) {
    const now = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [
                ...(c.messages || []),
                { id: Math.random().toString(36).slice(2), content, createdAt: now },
              ],
              updatedAt: now,
              preview: content.slice(0, 80),
            }
          : c
      )
    );
    setThinkingConvId(convId);
    setIsThinking(true);
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString();
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m
        );
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        };
      })
    );
  }

  function resendMessage(convId, messageId) {
    const msg = conversations
      .find((c) => c.id === convId)
      ?.messages?.find((m) => m.id === messageId);
    if (msg) sendMessage(convId, msg.content);
  }

  function deleteMessage(convId, messageId) {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const msgs = (c.messages || []).filter((m) => m.id !== messageId);
        return {
          ...c,
          messages: msgs,
          messageCount: msgs.length,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || t('chat.previewHello'),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    toast({
      title: t('button.delete'),
      description: t('message.messageDeleted') || '消息已删除',
    });
    setSelectedMessageId(null);
  }

  async function copyMessage(convId, messageId) {
    const msg = conversations
      .find((c) => c.id === convId)
      ?.messages?.find((m) => m.id === messageId);
    if (!msg) return;
    try {
      await navigator.clipboard.writeText(msg.content || '');
      toast({ title: t('button.copy') || '复制', description: t('message.copied') || '已复制' });
    } catch (e) {
      toast({ title: t('button.copy') || '复制', description: '复制失败' });
    }
  }

  function clearConversation(convId) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [],
              messageCount: 0,
              preview: t('chat.previewHello'),
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
    toast({
      title: t('button.delete'),
      description: t('message.conversationCleared') || '会话已清空',
    });
    setSelectedMessageId(null);
  }

  async function exportConversation(convId) {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv) return;
    const title = conv.title || 'conversation';
    const md =
      `# ${title}\n\n` + (conv.messages || []).map((m, i) => `- ${m.content || ''}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(md);
    } catch {}
    try {
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {}
    toast({ title: t('common.export') || '导出', description: '会话已导出为 Markdown' });
  }

  function moveConversationToFolder(convId, folderName) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, folder: folderName, updatedAt: new Date().toISOString() } : c
      )
    );
    toast({ title: t('button.moveToFolder') || '移动到文件夹', description: `“${folderName}”` });
  }

  function pauseThinking() {
    setIsThinking(false);
    setThinkingConvId(null);
  }

  function createFolder(name) {
    setFolders((prev) => [...prev, { name }]);
  }

  function handleUseTemplate(template) {
    const id = Math.random().toString(36).slice(2);
    const item = {
      id,
      title: template.name,
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: template.content.slice(0, 80),
      pinned: false,
      folder: t('folders.default'),
      messages: [],
    };
    setConversations((prev) => [item, ...prev]);
    setSelectedId(id);
    setSidebarOpen(false);
  }

  const selected = conversations.find((c) => c.id === selectedId) || null;

  return (
    <div className="min-h-dvh min-h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col">
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="ml-1 flex items-center gap-2 text-sm font-semibold tracking-tight">
          {/* 取消 logo 图片，避免 SSR/CSR 主题差异导致水合不匹配 */}
          {t('common.aiAssistant')}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <GhostIconButton label={t('common.schedule')}>
            <Calendar className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label={t('common.apps')}>
            <LayoutGrid className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label={t('common.more')}>
            <MoreHorizontal className="h-4 w-4" />
          </GhostIconButton>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="flex flex-1 w-full overflow-hidden 2xl:max-w-[1920px] 2xl:mx-auto">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          conversations={conversations}
          pinned={pinned}
          recent={recent}
          folders={folders}
          folderCounts={folderCounts}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          togglePin={togglePin}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          createFolder={createFolder}
          createNewChat={createNewChat}
          templates={templates}
          setTemplates={setTemplates}
          onUseTemplate={handleUseTemplate}
          onRenameConversation={renameConversation}
          onDeleteConversation={deleteConversation}
          onMoveConversation={moveConversationToFolder}
          availableFolders={folders}
          onClearConversation={clearConversation}
          onExportConversation={exportConversation}
        />

        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header
            createNewChat={createNewChat}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarOpen={setSidebarOpen}
          />
          <ChatPane
            ref={composerRef}
            conversation={selected}
            onSend={(content) => selected && sendMessage(selected.id, content)}
            onEditMessage={(messageId, newContent) =>
              selected && editMessage(selected.id, messageId, newContent)
            }
            onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
            onDeleteMessage={(convId, messageId) => deleteMessage(convId, messageId)}
            onCopyMessage={(convId, messageId) => copyMessage(convId, messageId)}
            onSelectMessage={(messageId) => setSelectedMessageId(messageId)}
            selectedMessageId={selectedMessageId}
            isThinking={isThinking && thinkingConvId === selected?.id}
            onPauseThinking={pauseThinking}
          />
        </main>
      </div>
    </div>
  );
}
