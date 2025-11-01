/**
 * @file 全局客户端 Providers 组合
 * @description 在客户端边界中统一组合 I18n 与用户档案等上下文，避免在服务端布局中直接引入客户端模块造成边界冲突
 * @module app/providers
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 */

'use client';

import { I18nProvider } from '@/lib/i18n';
import { UserProfileProvider } from '@/lib/user-profile';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nProvider>
      <UserProfileProvider>
        {children}
        {/* 全局提示挂载：确保按钮操作与系统消息可见 */}
        <Toaster />
        <Analytics />
      </UserProfileProvider>
    </I18nProvider>
  );
}
