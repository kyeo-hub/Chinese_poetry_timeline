import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// 禁用缓存，确保每次都执行
export const dynamic = 'force-dynamic'

// 更安全的哈希函数
async function hashIdentifier(input: string, salt: string = ''): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input + salt);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // 获取请求信息
    const { pathname } = new URL(request.url)
    
    // 获取客户端IP
    let ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
    
    // 处理x-forwarded-for可能包含多个IP的情况，取第一个
    if (ip !== 'unknown' && ip.includes(',')) {
      ip = ip.split(',')[0].trim()
    }
    
    // 获取User Agent
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // 使用环境变量中的盐值，如果没有则使用默认值
    const salt = process.env.SITE_SALT || 'default_salt'
    
    // 使用更安全的SHA-256哈希方法
    const ipHash = await hashIdentifier(ip, salt)
    const userAgentHash = await hashIdentifier(userAgent, salt)
    
    // 1. 更新总访问量
    const { data: siteViewData } = await supabase
      .from('site_views')
      .select('view_count')
      .limit(1)
      .single()
    
    if (siteViewData) {
      await supabase
        .from('site_views')
        .update({ 
          view_count: siteViewData.view_count + 1,
          updated_at: new Date()
        })
        .eq('id', 1)
    } else {
      await supabase
        .from('site_views')
        .insert({ view_count: 1 })
    }
    
    // 2. 更新页面访问量
    const { data: pageViewData } = await supabase
      .from('page_views')
      .select('view_count')
      .eq('page_path', pathname)
      .single()
    
    if (pageViewData) {
      await supabase
        .from('page_views')
        .update({ 
          view_count: pageViewData.view_count + 1,
          updated_at: new Date()
        })
        .eq('page_path', pathname)
    } else {
      await supabase
        .from('page_views')
        .insert({ 
          page_path: pathname, 
          view_count: 1 
        })
    }
    
    // 3. 处理唯一访问者
    const today = new Date().toISOString().split('T')[0]
    
    // 检查是否已记录此访问者
    const { data: visitorData, error: visitorError } = await supabase
      .from('unique_visitors')
      .select('id')
      .eq('ip_hash', ipHash)
      .eq('user_agent_hash', userAgentHash)
      .limit(1)
      .maybeSingle() // 使用maybeSingle而不是single，以防没有匹配项
    
    // 如果是新访问者，记录到unique_visitors表
    if (!visitorData) {
      await supabase
        .from('unique_visitors')
        .insert({
          ip_hash: ipHash,
          user_agent_hash: userAgentHash,
          first_visit: new Date(),
          last_visit: new Date()
        })
    } else {
      // 如果是已存在的访问者，更新最后访问时间
      await supabase
        .from('unique_visitors')
        .update({ last_visit: new Date() })
        .eq('id', visitorData.id)
    }
    
    // 4. 更新每日访问统计
    const { data: dailyViewData } = await supabase
      .from('daily_views')
      .select('view_count, unique_visitors')
      .eq('date', today)
      .single()
    
    if (dailyViewData) {
      // 更新现有记录
      const updates: any = { 
        view_count: dailyViewData.view_count + 1,
        updated_at: new Date()
      }
      
      // 如果是新访问者，增加唯一访问者计数
      if (!visitorData) {
        updates.unique_visitors = dailyViewData.unique_visitors + 1
      }
      
      await supabase
        .from('daily_views')
        .update(updates)
        .eq('date', today)
    } else {
      // 创建新记录
      await supabase
        .from('daily_views')
        .insert({
          date: today,
          view_count: 1,
          unique_visitors: 1
        })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'site'
    const page = searchParams.get('page') || '/'
    
    switch (type) {
      case 'site':
        // 获取总访问量
        const { data: siteData } = await supabase
          .from('site_views')
          .select('view_count')
          .single()
        return NextResponse.json({ count: siteData?.view_count || 0 })
      
      case 'page':
        // 获取页面访问量
        const { data: pageData } = await supabase
          .from('page_views')
          .select('view_count')
          .eq('page_path', page)
          .single()
        return NextResponse.json({ count: pageData?.view_count || 0 })
      
      case 'unique':
        // 获取唯一访问者数量
        const { count: uniqueCount, error } = await supabase
          .from('unique_visitors')
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          console.error('Error fetching unique visitors count:', error)
          return NextResponse.json({ count: 0 })
        }
        
        return NextResponse.json({ count: uniqueCount || 0 })
      
      default:
        return NextResponse.json({ count: 0 })
    }
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ count: 0 }, { status: 500 })
  }
}