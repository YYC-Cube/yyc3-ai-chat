/**
 * @file 用户档案上下文
 * @description 提供昵称等用户信息的统一来源与更新机制
 * @module user-profile
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * @description 用户档案数据结构
 */
export interface UserProfile {
  name: string;
}

interface UserProfileContextValue {
  profile: UserProfile;
  setName: (name: string) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

/**
 * @description 用户档案 Provider - 统一管理昵称，并与 localStorage 同步
 */
export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string>('');

  // 初始化：从 localStorage 读取昵称
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('userName');
        if (saved) setNameState(saved);
      }
    } catch {}
  }, []);

  // 跨标签页同步：监听 storage 事件
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'userName') {
        setNameState((e.newValue || '').trim());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setName = (name: string) => {
    const trimmed = (name || '').trim();
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('userName', trimmed);
        // 触发自定义事件，通知同页面其他组件
        window.dispatchEvent(new CustomEvent('userProfile:change', { detail: { name: trimmed } }));
      }
    } catch {}
    setNameState(trimmed);
  };

  // 同页面同步：监听自定义事件
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const custom = e as CustomEvent<{ name: string }>;
        if (custom?.detail?.name !== undefined) {
          setNameState(custom.detail.name);
        }
      } catch {}
    };
    window.addEventListener('userProfile:change', handler as EventListener);
    return () => window.removeEventListener('userProfile:change', handler as EventListener);
  }, []);

  const value = useMemo<UserProfileContextValue>(() => ({ profile: { name }, setName }), [name]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

/**
 * @description Hook: 使用用户档案
 * @returns { profile, setName }
 */
export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile 必须在 UserProfileProvider 内使用');
  }
  return ctx;
}
