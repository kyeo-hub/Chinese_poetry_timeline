-- 安全更新脚本，用于更新已有数据库中的朝代和诗人信息

-- 首先插入新的朝代（如果不存在）
INSERT INTO dynasties (name, start_year, end_year, description) 
VALUES 
  ('魏晋南北朝', 220, 589, '魏晋南北朝时期，诗歌艺术的重要发展期，包括建安文学、竹林七贤、山水诗派等')
ON CONFLICT (name) DO NOTHING;

-- 删除不再需要的朝代
DELETE FROM dynasties WHERE name IN ('三国', '魏晋', '南北朝', '辽', '金');

-- 更新诗人的朝代信息
UPDATE poets 
SET dynasty = '魏晋南北朝'
WHERE dynasty IN ('三国', '魏晋', '南北朝');

-- 删除辽、金朝代的诗人（如果有的话）
DELETE FROM poets WHERE dynasty IN ('辽', '金');

-- 为新朝代插入额外的诗人数据（如果之前不存在）
INSERT INTO poets (name, birth_year, death_year, dynasty, portrait_url, introduction, brief_tag) VALUES
  ('曹操', 155, 220, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '东汉末年权臣、政治家、军事家、文学家，曹魏政权的奠基者。', '建安风骨'),
  ('曹丕', 187, 226, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '三国时期政治家、文学家，曹魏开国皇帝，与其父曹操、弟曹植并称"三曹"。', '帝王诗人'),
  ('曹植', 192, 232, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '三国时期文学家，建安文学的代表人物，被誉为"才高八斗"。', '建安之杰'),
  ('阮籍', 210, 263, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '三国时期魏国诗人，竹林七贤之一，崇奉老庄之学，政治上则采谨慎避祸的态度。', '竹林七贤'),
  ('嵇康', 223, 262, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '三国曹魏时著名思想家、音乐家、文学家，竹林七贤的精神领袖。', '竹林七贤'),
  ('陶渊明', 365, 427, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '东晋末至南朝宋初期伟大的诗人、辞赋家，中国第一位田园诗人。', '田园诗派'),
  ('谢灵运', 385, 433, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '南北朝时期杰出的诗人、文学家，开创了中国文学史上的山水诗派。', '山水诗祖'),
  ('鲍照', 414, 466, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '南朝宋文学家，与颜延之、谢灵运合称"元嘉三大家"。', '元嘉三大家'),
  ('庾信', 513, 581, '魏晋南北朝', '/placeholder.svg?height=100&width=100', '南北朝时期文学家，由南入北的最著名的诗人，其诗赋为北朝文人之冠。', '集大成者')
ON CONFLICT (name, dynasty) DO NOTHING;

INSERT INTO poets (name, birth_year, death_year, dynasty, portrait_url, introduction, brief_tag) VALUES 
('孔子', -551, -479, '春秋', '/placeholder.svg?height=100&width=100', '春秋末期思想家、教育家，儒家学派创始人，曾整理《诗经》，提出"诗教"思想，对中国诗歌发展有深远影响。', '诗教奠基者'),
('尹吉甫', NULL, NULL, '春秋', '/placeholder.svg?height=100&width=100', '西周至春秋之际政治家、军事家，相传为《诗经》中多篇诗歌的作者，被誉为"中华诗祖"。', '中华诗祖'),
('老子', NULL, NULL, '春秋', '/placeholder.svg?height=100&width=100', '春秋末期思想家，道家学派创始人，《道德经》以诗化语言阐述哲学，对后世哲理诗有深远影响。', '哲理诗先驱')
ON CONFLICT (name, dynasty) DO NOTHING;

