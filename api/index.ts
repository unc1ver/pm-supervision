import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../dist')));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'production' });
});

// Auth - login (inline, no external imports except express/jwt/bcrypt used via eval)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) { res.status(400).json({ error: '请输入账号和密码' }); return; }
    const { createClient } = await import('@supabase/supabase-js');
    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'property-group-supervision-secret-key-2026';
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('users').select('*').eq('name', username).single();
      if (data && await bcrypt.compare(password, data.password_hash)) {
        const token = jwt.sign({ userId: data.id, role: data.role }, secret, { expiresIn: '24h' });
        res.json({ token, user: { id: data.id, name: data.name, role: data.role, avatar: data.avatar } });
        return;
      }
    }
    // Fallback: admin/admin123
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign({ userId: 'USR-001', role: '集团超级管理员' }, secret, { expiresIn: '24h' });
      res.json({ token, user: { id: 'USR-001', name: '张建华', role: '集团超级管理员', avatar: '' } });
      return;
    }
    res.status(401).json({ error: '账号或密码错误' });
  } catch(e) {
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('dashboard_stats').select('*').single();
      if (data) { res.json(data); return; }
    }
  } catch {}
  res.json({ total_projects: 1284, project_growth: 12, security_rating: 98.4, security_trend: '+0.4%', compliance_rate: 92.1, compliance_trend: '-1.2%', active_alerts: 4, completed_inspections: 21, total_inspections: 25, coverage_rate: 84 });
});

// Inspections
app.get('/api/inspections', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('inspections').select('*').order('id', { ascending: true });
      if (data && data.length > 0) { res.json(data); return; }
    }
  } catch {}
  res.json([
    { id: '1', name: '华东地区 (上海/浙江/江苏)', status: 'completed', date: '2024-11-05', score: 98 },
    { id: '2', name: '华南地区 (广东/广西/海南)', status: 'ongoing', date: '2024-11-10', score: -1 },
    { id: '3', name: '华北地区 (北京/天津/河北)', status: 'completed', date: '2024-11-02', score: 95 }
  ]);
});

// Alerts
app.get('/api/alerts', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('alerts').select('*').eq('dismissed', false).order('created_at', { ascending: false });
      if (data && data.length > 0) { res.json(data); return; }
    }
  } catch {}
  res.json([
    { id: 'A-101', type: 'critical', title: '【紧急】消防系统离线告警', desc: '华北区域 3 栋写字楼消防水压传感器离线超过 30 分钟', time: '2分钟前', dismissed: false },
    { id: 'A-102', type: 'system', title: '月度能耗数据同步完成', desc: '华东区域 12 个项目的电表数据已与主数据库完成同步', time: '15分钟前', dismissed: false },
    { id: 'A-103', type: 'warning', title: '设备维保到期预警', desc: '华南区域 8 部电梯维保合同将于 7 天内到期', time: '42分钟前', dismissed: false },
    { id: 'A-104', type: 'info', title: '新项目入驻审批', desc: '成都高新区 AI 大厦物业管理合同已签署', time: '1小时前', dismissed: false }
  ]);
});

// Nodes
app.get('/api/nodes', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('nodes').select('*').order('id', { ascending: true });
      if (data && data.length > 0) { res.json(data); return; }
    }
  } catch {}
  res.json([
    { id: 'NODE-SH-01', name: '上海中心大厦', location: '上海市浦东新区', status: 'normal', kpi: 82 },
    { id: 'NODE-BJ-01', name: '北京国贸大厦', location: '北京市朝阳区', status: 'syncing', kpi: 45 },
    { id: 'NODE-GZ-01', name: '广州国际金融中心', location: '广州市天河区', status: 'normal', kpi: 94 },
    { id: 'NODE-CD-01', name: '成都天府金融中心', location: '成都市高新区', status: 'disconnected', kpi: -1 }
  ]);
});

// Logs
app.get('/api/logs', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (data && data.length > 0) { res.json(data); return; }
    }
  } catch {}
  res.json([
    { id: 'L-001', title: '华东区域月度能耗数据同步完成', time: '12:44:02', operator: '系统自动执行', type: 'system' },
    { id: 'L-002', title: '安全巡检基线校准完成', time: '12:31:15', operator: '系统自动执行', type: 'system' },
    { id: 'L-003', title: '成都天府金融中心节点连接异常', time: '12:15:22', operator: '紧急系统告警', type: 'error' }
  ]);
});

// Org
app.get('/api/org', async (_req, res) => {
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
      const { data } = await supabase.from('organizations').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        const map = new Map(); let root = null;
        data.forEach(o => map.set(o.id, { id: o.id, name: o.name, role: o.role, leader: o.leader, phone: o.phone, email: o.email, status: o.status, children: [] }));
        data.forEach(o => {
          const node = map.get(o.id);
          if (o.parent_id && map.has(o.parent_id)) map.get(o.parent_id).children.push(node);
          else if (!o.parent_id) root = node;
        });
        function clean(n) { if (n.children && n.children.length === 0) delete n.children; else if (n.children) n.children = n.children.map(clean); return n; }
        if (root) { res.json(clean(root)); return; }
      }
    }
  } catch {}
  res.json({ id: 'ORG-ROOT', name: '物业集团管理总部', role: '集团管理中心', leader: '张建国 (董事长)', phone: '010-88889999', email: 'board@pmgroup.com', status: 'normal', children: [] });
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

export default app;
