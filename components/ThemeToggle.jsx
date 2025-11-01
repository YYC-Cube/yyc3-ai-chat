import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * @file 主题切换按钮
 * @description 为避免 SSR/CSR 水合不匹配，图标与文案在客户端挂载后再根据 theme 渲染
 * @author YYC
 */
export default function ThemeToggle({ theme, setTheme }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-2.5 py-1.5 text-sm hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {/* 客户端挂载前渲染固定图标，避免与服务器输出不一致 */}
      {mounted ? (
        theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <Sun className="h-4 w-4" aria-hidden />
      )}
      <span className="hidden sm:inline">
        {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
      </span>
    </button>
  );
}
