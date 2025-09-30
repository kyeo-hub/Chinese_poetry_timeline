-- 创建网站访问统计表
CREATE TABLE site_views (
  id SERIAL PRIMARY KEY,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建页面访问统计表
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL UNIQUE,
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建唯一访问者统计表
CREATE TABLE unique_visitors (
  id SERIAL PRIMARY KEY,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent_hash VARCHAR(64),
  first_visit TIMESTAMP DEFAULT NOW(),
  last_visit TIMESTAMP DEFAULT NOW()
);

-- 创建每日访问统计表
CREATE TABLE daily_views (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  view_count BIGINT DEFAULT 0,
  unique_visitors BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 插入初始数据
INSERT INTO site_views (view_count) VALUES (0);

-- 创建索引以提高查询性能
CREATE INDEX idx_page_views_path ON page_views(page_path);
CREATE INDEX idx_unique_visitors_ip ON unique_visitors(ip_hash);
CREATE INDEX idx_daily_views_date ON daily_views(date);

-- 启用行级安全 (RLS)
ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_views ENABLE ROW LEVEL SECURITY;

-- 创建允许所有人读取的策略
CREATE POLICY "Allow public read access to site_views" ON site_views FOR SELECT USING (true);
CREATE POLICY "Allow public read access to page_views" ON page_views FOR SELECT USING (true);
CREATE POLICY "Allow public read access to daily_views" ON daily_views FOR SELECT USING (true);

-- 创建插入和更新的策略（仅限服务端）
CREATE POLICY "Allow insert for analytics" ON unique_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for analytics" ON unique_visitors FOR UPDATE USING (true);
CREATE POLICY "Allow insert for analytics" ON site_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for analytics" ON site_views FOR UPDATE USING (true);
CREATE POLICY "Allow insert for analytics" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for analytics" ON page_views FOR UPDATE USING (true);
CREATE POLICY "Allow insert for analytics" ON daily_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for analytics" ON daily_views FOR UPDATE USING (true);