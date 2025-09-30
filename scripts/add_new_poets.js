#!/usr/bin/env node

/**
 * 添加新诗人到数据库
 * 
 * 此脚本将：
 * 1. 根据chinese-poetry项目中的诗词作者信息
 * 2. 生成插入新诗人记录的SQL语句
 */

const fs = require('fs');
const path = require('path');

// 模拟从chinese-poetry项目中提取的诗人信息
function getNewPoets() {
  // 在实际使用中，这里应该分析chinese-poetry项目的JSON文件提取作者信息
  return [
    {
      name: "王之涣",
      birth_year: 688,
      death_year: 742,
      dynasty: "唐",
      introduction: "唐代诗人，字季凌，祖籍晋阳（今山西太原），其高祖迁居绛州（今山西新绛县）。开元（唐玄宗年号，713—741年）初年，曾任冀州衡水主簿，被人诬告罢官。后到洛阳、太原等地漫游。性格傲岸，不愿折节以媚权贵。晚年任文安郡（今河北任丘市）文安县尉，卒于任所。",
      brief_tag: "边塞诗人"
    },
    {
      name: "孟浩然",
      birth_year: 689,
      death_year: 740,
      dynasty: "唐",
      introduction: "唐代著名田园山水派诗人，襄州襄阳（今湖北襄阳）人，世称孟襄阳。因他未曾入仕，又称之为孟山人。孟浩然生当盛唐，早年有志用世，在仕途困顿、痛苦失望后，尚能自重，不媚俗世，修道归隐终身。曾隐居鹿门山。40岁时，游长安，应进士举不第。曾在太学赋诗，名动公卿，一座倾服，为之搁笔。开元二十五年（737年）张九龄招致幕府，后隐居。孟浩然的诗歌主要表达自己闲适、恬淡、清高的思想情感，诗风清淡自然。",
      brief_tag: "山水田园"
    }
  ];
}

// 生成插入诗人的SQL语句
function generateInsertPoetsSQL(poets) {
  let sql = '-- 添加从chinese-poetry项目中发现的新诗人\n';
  sql += '-- 注意：portrait_url使用占位符，后续可替换为实际图片\n\n';
  
  for (const poet of poets) {
    sql += `INSERT INTO poets (name, birth_year, death_year, dynasty, portrait_url, introduction, brief_tag) VALUES (\n`;
    sql += `  '${poet.name.replace(/'/g, "''")}',\n`;
    sql += `  ${poet.birth_year},\n`;
    sql += `  ${poet.death_year},\n`;
    sql += `  '${poet.dynasty}',\n`;
    sql += `  '/placeholder.svg?height=100&width=100',\n`;
    sql += `  '${poet.introduction.replace(/'/g, "''")}',\n`;
    sql += `  '${poet.brief_tag}'\n`;
    sql += `) ON CONFLICT (name, dynasty) DO NOTHING;\n\n`;
  }
  
  return sql;
}

// 主处理函数
async function addNewPoets() {
  try {
    console.log('开始处理新诗人数据...');
    
    // 获取新诗人信息
    const newPoets = getNewPoets();
    console.log(`发现 ${newPoets.length} 位新诗人`);
    
    // 生成SQL
    const sqlContent = generateInsertPoetsSQL(newPoets);
    
    // 保存SQL文件
    const outputPath = path.join(__dirname, '005_add_new_poets.sql');
    fs.writeFileSync(outputPath, sqlContent);
    
    console.log(`处理完成，SQL文件已保存到: ${outputPath}`);
    console.log('提示：导入诗人数据后，再导入其诗词作品');
    
  } catch (error) {
    console.error('处理新诗人数据时出错:', error);
  }
}

// 如果直接运行此脚本，则执行主函数
if (require.main === module) {
  addNewPoets();
}

module.exports = {
  getNewPoets,
  generateInsertPoetsSQL,
  addNewPoets
};