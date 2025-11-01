/**
 * @file 环境配置动态加载器
 * @description 根据 NODE_ENV 自动导出对应环境配置
 * @module config/index
 * @author YYC
 * @version 1.0.0
 * @created 2025-10-31
 * @updated 2025-10-31
 */

import { env } from '../lib/env';
import { environmentConfig as development } from './development';
import { environmentConfig as production } from './production';

export const environmentConfig = env.NODE_ENV === 'production' ? production : development;
