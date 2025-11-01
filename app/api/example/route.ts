/**
 * @file 示例 API 路由
 * @description 演示 GET/POST 双方法接入 ApiHealth.monitorRoute
 * @module api-example
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-31
 * @updated 2024-10-31
 */
import { NextRequest, NextResponse } from 'next/server'
import { ApiHealth } from '@/lib/api-health'
import { z } from 'zod'

// POST 请求体校验
const PostSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), z.number()]),
})

/**
 * GET: 返回示例数据
 */
export const GET = ApiHealth.monitorRoute(async (req: NextRequest) => {
  const data = {
    ok: true,
    message: 'example route GET',
    time: new Date().toISOString(),
  }
  return NextResponse.json(data)
}, { category: 'auto' })

/**
 * POST: 校验并回显请求体（重载路由，阈值更严格）
 */
export const POST = ApiHealth.monitorRoute(async (req: NextRequest) => {
  const json = await req.json().catch(() => null)
  const parsed = PostSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 })
  }
  return NextResponse.json({ ok: true, received: parsed.data })
}, { category: 'heavy', performanceThresholdMs: 500, rateLimitMax: 20, windowMs: 30_000 })
