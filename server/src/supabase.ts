import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

let supabase: any = null;

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseKey);
}

export async function getSupabase() {
  if (!supabase) {
    if (isSupabaseConfigured()) {
      const { createClient } = await import('@supabase/supabase-js');
      supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      console.log('[Supabase] 连接成功');
    } else {
      console.warn('[Supabase] 未配置 SUPABASE_URL/SUPABASE_SERVICE_KEY，使用本地降级模式');
    }
  }
  return supabase;
}
