/**
 * @file 开发环境配置
 * @description 提供开发环境的基础配置项，便于按环境切换
 * @module config/development
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

export const environmentConfig = {
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3005',
    timeout: 30000,
  },
  features: {
    enableNewFeature: process.env.ENABLE_NEW_FEATURE === 'true',
    experimentalMode: true,
  },
  projectSettings: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['jpg', 'png', 'pdf'],
  },
};
