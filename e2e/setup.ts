// @file e2e 测试工具模块
// @description 提供统一的初始化脚本安装，保证本地存储干净，提升回归稳定性
// @author YYC
// @created 2025-11-01

import type { Page } from '@playwright/test';

/**
 * 安装初始化脚本：清理本地存储（localStorage），减少跨用例状态干扰
 */
export async function installCleanLocalStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {}
  });
}

/**
 * 可扩展占位：如需后续统一清理 sessionStorage 或注入全局补丁，可在此集中管理
 */
export async function installDefaultInitScripts(page: Page): Promise<void> {
  await installCleanLocalStorage(page);
}
