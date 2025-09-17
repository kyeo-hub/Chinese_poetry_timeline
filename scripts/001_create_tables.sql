-- 创建朝代表
CREATE TABLE dynasties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_year INT,
  end_year INT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建诗人表
CREATE TABLE poets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  birth_year INT,        -- 使用负数表示公元前
  death_year INT,
  dynasty VARCHAR(50),
  portrait_url TEXT,
  introduction TEXT,
  brief_tag VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建诗词表
CREATE TABLE poems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  poet_id INT REFERENCES poets(id) ON DELETE CASCADE,
  dynasty VARCHAR(50),
  writing_year INT,      -- 创作年份
  content TEXT NOT NULL, -- 诗词原文
  translation TEXT,      -- 白话翻译
  appreciation TEXT,     -- 赏析
  background TEXT,       -- 创作背景
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_poets_birth_year ON poets(birth_year);
CREATE INDEX idx_poets_dynasty ON poets(dynasty);
CREATE INDEX idx_poems_poet_id ON poems(poet_id);
CREATE INDEX idx_poems_dynasty ON poems(dynasty);
CREATE INDEX idx_poems_writing_year ON poems(writing_year);

-- 启用行级安全 (RLS) - 由于这是公开的诗词数据，我们允许所有人读取
ALTER TABLE dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE poets ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- 创建允许所有人读取的策略
CREATE POLICY "Allow public read access to dynasties" ON dynasties FOR SELECT USING (true);
CREATE POLICY "Allow public read access to poets" ON poets FOR SELECT USING (true);
CREATE POLICY "Allow public read access to poems" ON poems FOR SELECT USING (true);
