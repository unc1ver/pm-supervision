import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = createApp();
const PORT = parseInt(process.env.PORT || '3001', 10);
const host = process.env.HOST || '127.0.0.1';

app.listen(PORT, host, () => {
  console.log(`\n  🏢 物业集团综合监察系统`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(`  地址:    http://${host}:${PORT}`);
  console.log(`  Supabase: ${process.env.SUPABASE_URL ? '已配置' : '未配置 (使用降级数据)'}`);
  console.log(`  ─────────────────────────────────────────\n`);
});
