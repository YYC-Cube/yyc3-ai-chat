// @file e2e 测试基类
// @description 使用 test.extend 注入统一的初始化脚本，免去每个用例手写 beforeEach
// @author YYC
// @created 2025-11-01

import { test as base, expect } from '@playwright/test';

import { installDefaultInitScripts } from './setup';

/**
 * 扩展 page fixture：在每个测试开始前注入默认初始化脚本
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await installDefaultInitScripts(page);
    await use(page);
  },
});

export { expect };
