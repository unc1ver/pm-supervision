-- ============================================================================
-- 物业集团综合监察系统 - Supabase 数据库 Schema
-- ============================================================================

-- 1. 系统用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '监察员',
  avatar TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认管理员 (密码: admin123)
INSERT INTO users (id, name, role, avatar, password_hash) VALUES
('USR-001', '张建华', '集团超级管理员',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4pUwodDqUbY4WSllKoBjZUc7C8vVRe0di1b_yDityVupD3YONvpb59PoD6lGh1EIjx9dGwwzZp6YW5UZlsokpiyYOM5dn0ajoJLj_SmmtS-YGI_pT7JIyXfNzj5Dfv_h12OfTwFXtwGlNYdgHG-_EgyEM3N_q6R_W9G8BigDdfzZdTFXwySfr6r1FkbHotFcHMH-JagC-AhB9z2qYFpmpJBYN2GGR6NTtzqLPZwKmexAKpZacajlyQ87mhNz-YTk21R3WsCeFJII',
 '$2a$10$rdYjMid5lfyni0paVGW81.J20RvkV8TB.bgwh8VFR8RKOO519GVWu')
ON CONFLICT (id) DO NOTHING;

-- 2. 巡检记录表
CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'ongoing', 'pending')),
  date TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT -1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 告警记录表
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('critical', 'system', 'warning', 'info')),
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  time TEXT NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 监控节点表
CREATE TABLE IF NOT EXISTS nodes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('normal', 'syncing', 'disconnected')),
  kpi INTEGER NOT NULL DEFAULT -1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 操作日志表
CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  operator TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'system', 'error')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 组织架构表
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  leader TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'error')),
  parent_id TEXT REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 仪表盘统计缓存表
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id SERIAL PRIMARY KEY,
  total_projects INTEGER DEFAULT 0,
  project_growth REAL DEFAULT 0,
  security_rating REAL DEFAULT 0,
  security_trend TEXT DEFAULT '',
  compliance_rate REAL DEFAULT 0,
  compliance_trend TEXT DEFAULT '',
  active_alerts INTEGER DEFAULT 0,
  completed_inspections INTEGER DEFAULT 0,
  total_inspections INTEGER DEFAULT 0,
  coverage_rate REAL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 插入默认统计数据
INSERT INTO dashboard_stats (total_projects, project_growth, security_rating, security_trend, compliance_rate, compliance_trend, active_alerts, completed_inspections, total_inspections, coverage_rate)
VALUES (1284, 12.0, 98.4, '+0.4%', 92.1, '-1.2%', 4, 21, 25, 84.0)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RLS (行级安全策略)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

-- 允许所有已认证用户读取所有表
CREATE POLICY "允许所有已认证用户读取" ON users FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON inspections FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON alerts FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON nodes FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON logs FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON organizations FOR SELECT USING (true);
CREATE POLICY "允许所有已认证用户读取" ON dashboard_stats FOR SELECT USING (true);

-- 允许所有已认证用户写入
CREATE POLICY "允许所有已认证用户写入" ON inspections FOR INSERT WITH CHECK (true);
CREATE POLICY "允许所有已认证用户写入" ON inspections FOR UPDATE USING (true);
CREATE POLICY "允许所有已认证用户写入" ON alerts FOR UPDATE USING (true);
CREATE POLICY "允许所有已认证用户写入" ON nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "允许所有已认证用户写入" ON nodes FOR UPDATE USING (true);
CREATE POLICY "允许所有已认证用户写入" ON logs FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 插入种子数据
-- ============================================================================

-- 巡检种子数据
INSERT INTO inspections (id, name, status, date, score) VALUES
('1', '华东地区 (上海/浙江/江苏)', 'completed', '2024-11-05', 98),
('2', '华南地区 (广东/广西/海南)', 'ongoing', '2024-11-10', -1),
('3', '华北地区 (北京/天津/河北)', 'completed', '2024-11-02', 95)
ON CONFLICT (id) DO NOTHING;

-- 告警种子数据
INSERT INTO alerts (id, type, title, desc, time) VALUES
('A-101', 'critical', '【紧急】消防系统离线告警', '华北区域 3 栋写字楼消防水压传感器离线超过 30 分钟', '2分钟前'),
('A-102', 'system', '月度能耗数据同步完成', '华东区域 12 个项目的电表数据已与主数据库完成同步', '15分钟前'),
('A-103', 'warning', '设备维保到期预警', '华南区域 8 部电梯维保合同将于 7 天内到期，请及时续签', '42分钟前'),
('A-104', 'info', '新项目入驻审批通过', '成都高新区 AI 大厦物业管理合同已签署，系统接入中', '1小时前')
ON CONFLICT (id) DO NOTHING;

-- 节点种子数据
INSERT INTO nodes (id, name, location, status, kpi) VALUES
('NODE-SH-01', '上海中心大厦', '上海市浦东新区', 'normal', 82),
('NODE-BJ-01', '北京国贸大厦', '北京市朝阳区', 'syncing', 45),
('NODE-GZ-01', '广州国际金融中心', '广州市天河区', 'normal', 94),
('NODE-CD-01', '成都天府金融中心', '成都市高新区', 'disconnected', -1)
ON CONFLICT (id) DO NOTHING;

-- 组织架构种子数据
INSERT INTO organizations (id, name, role, leader, phone, email, status, parent_id) VALUES
('ORG-ROOT', '物业集团管理总部', '集团管理中心', '张建国 (董事长)', '010-88889999', 'board@pmgroup.com', 'normal', NULL),
('ORG-EC', '华东区域公司', '区域管理中心', '李向阳 (区域总经理)', '021-66554433', 'east@pmgroup.com', 'normal', 'ORG-ROOT'),
('ORG-NC', '华北区域公司', '区域管理中心', '赵国强 (区域总经理)', '010-55443322', 'north@pmgroup.com', 'normal', 'ORG-ROOT'),
('ORG-SC', '华南区域公司', '区域管理中心', '孙志远 (区域总经理)', '020-33221100', 'south@pmgroup.com', 'warning', 'ORG-ROOT'),
('ORG-WC', '西南区域公司', '区域管理中心', '钱震 (区域总经理)', '028-44332211', 'west@pmgroup.com', 'normal', 'ORG-ROOT')
ON CONFLICT (id) DO NOTHING;
