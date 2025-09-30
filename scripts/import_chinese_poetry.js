#!/usr/bin/env node

/**
 * 将chinese-poetry项目的数据导入到当前项目的数据库中
 * 
 * 此脚本将：
 * 1. 读取chinese-poetry项目的JSON数据文件
 * 2. 转换为适合本项目数据库结构的格式
 * 3. 生成SQL插入语句，便于导入数据库
 */

const fs = require('fs');
const path = require('path');

// 模拟从chinese-poetry项目加载唐诗数据
function loadTangPoetryData() {
  // 在实际使用中，这里应该从chinese-poetry项目的JSON文件中读取数据
  // 示例数据结构
  return [
    {
      "title": "登鹳雀楼",
      "author": "王之涣",
      "dynasty": "唐",
      "content": "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。"
    },
    {
      "title": "春晓",
      "author": "孟浩然",
      "dynasty": "唐", 
      "content": "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。"
    },
    {
      "title": "望庐山瀑布",
      "author": "李白",
      "dynasty": "唐",
      "content": "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。"
    }
  ];
}

// 模拟从chinese-poetry项目加载宋词数据
function loadSongCiData() {
  // 在实际使用中，这里应该从chinese-poetry项目的JSON文件中读取数据
  // 示例数据结构
  return [
    {
      "title": "念奴娇·赤壁怀古",
      "author": "苏轼",
      "dynasty": "宋",
      "content": "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。"
    },
    {
      "title": "水调歌头·丙辰中秋",
      "author": "苏轼",
      "dynasty": "宋",
      "content": "丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由。明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆。人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。"
    }
  ];
}

// 查找或创建诗人
function findOrCreatePoet(author, dynasty) {
  // 在实际使用中，这里应该查询数据库或维护一个诗人映射表
  // 现在我们使用一个模拟的映射表
  const poetMap = {
    "李白": 17,
    "杜甫": 18,
    "苏轼": 35,
    "王之涣": 1001,
    "孟浩然": 1002
  };
  
  if (poetMap[author]) {
    return poetMap[author];
  } else {
    // 如果诗人不存在，返回一个新ID（在实际应用中需要插入诗人表）
    console.log(`警告: 发现新诗人 "${author}"，需要添加到诗人表中`);
    return 1000 + Object.keys(poetMap).length; // 临时ID
  }
}

// 转换诗词数据为SQL插入语句
function convertPoetryToSQL(poems) {
  let sql = '-- 从chinese-poetry项目导入的诗词数据\n';
  sql += '-- 注意：需要确保对应的诗人已存在于poets表中\n\n';
  
  for (const poem of poems) {
    const poetId = findOrCreatePoet(poem.author, poem.dynasty);
    
    sql += `INSERT INTO poems (title, poet_id, dynasty, content) VALUES (\n`;
    sql += `  '${poem.title.replace(/'/g, "''")}',\n`;
    sql += `  ${poetId},\n`;
    sql += `  '${poem.dynasty}',\n`;
    sql += `  '${poem.content.replace(/'/g, "''")}'\n`;
    sql += `) ON CONFLICT DO NOTHING;\n\n`;
  }
  
  return sql;
}

// 主处理函数
async function processChinesePoetry() {
  try {
    console.log('开始处理chinese-poetry项目数据...');
    
    // 加载唐诗数据
    const tangPoems = loadTangPoetryData();
    console.log(`加载了 ${tangPoems.length} 首唐诗`);
    
    // 加载宋词数据
    const songCi = loadSongCiData();
    console.log(`加载了 ${songCi.length} 首宋词`);
    
    // 合并所有诗词
    const allPoems = [...tangPoems, ...songCi];
    console.log(`总共 ${allPoems.length} 首诗词`);
    
    // 转换为SQL
    const sqlContent = convertPoetryToSQL(allPoems);
    
    // 保存SQL文件
    const outputPath = path.join(__dirname, '004_import_chinese_poetry.sql');
    fs.writeFileSync(outputPath, sqlContent);
    
    console.log(`处理完成，SQL文件已保存到: ${outputPath}`);
    console.log('注意：导入数据前请确保对应的诗人已存在于poets表中');
    console.log('对于新诗人，需要先添加到poets表，再导入其作品');
    
  } catch (error) {
    console.error('处理chinese-poetry数据时出错:', error);
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  processChinesePoetry();
}

module.exports = {
  loadTangPoetryData,
  loadSongCiData,
  findOrCreatePoet,
  convertPoetryToSQL,
  processChinesePoetry
};