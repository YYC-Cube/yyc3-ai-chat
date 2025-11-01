/**
 * @file 品牌横幅预览页
 * @description 本地预览 README 顶图与工具链徽章的布局与主题适配效果（暗/亮主题）
 * @module brand-preview
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 *
 * 使用说明：
 * - 该页面用于在本地 Dev Server 下预览图片与徽章的展示效果
 * - 资源来源于 /public 目录，Next.js 将以根路径提供静态资源
 */

export default function BrandPreviewPage() {
  return (
    <div className="mx-auto max-w-[980px] p-6">
      {/* 顶图横幅，使用 <picture> 进行暗/亮主题适配 */}
      <div className="text-center">
        {/*
         * @description 横幅图主题适配
         * 暗色：/Github-Nexus.png
         * 亮色：/Git-Expansion.png
         */}
        <picture>
          <source media="(prefers-color-scheme: dark)" srcSet="/Github-Nexus.png" />
          <source media="(prefers-color-scheme: light)" srcSet="/Git-Expansion.png" />
          <img
            src="/Github-Nexus.png"
            alt="YanYu Cloud³ — Nexus Expansion"
            style={{ width: '100%', borderRadius: '12px' }}
          />
        </picture>

        {/* 工具链徽章：保持居中、可点击 */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node >= 18" />
          </a>
          <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/Next.js-15.2-black" alt="Next.js 15.2" />
          </a>
          <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/TypeScript-5.9-blue" alt="TypeScript 5.9" />
          </a>
          <a href="https://react.dev/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/React-19-61DAFB" alt="React 19" />
          </a>
          <a href="https://pnpm.io/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/pnpm-8-ffdd00" alt="pnpm 8" />
          </a>
          <a href="https://playwright.dev/" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/Playwright-E2E-2ea44f" alt="Playwright E2E" />
          </a>
          <a href="/api/health" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/CI-GitHub%20Actions-blue" alt="CI GitHub Actions" />
          </a>
        </div>
      </div>

      {/* 预览说明与提示 */}
      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          说明：该页面仅用于视觉校对，实际 README 渲染以 GitHub 为准；如需在站点内使用横幅，可将此结构复用到首页或文档页。
        </p>
      </div>
    </div>
  );
}
