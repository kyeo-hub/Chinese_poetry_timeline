#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
本地AI诗词内容生成器

此脚本演示如何使用本地部署的开源大模型来生成诗词的翻译、背景和赏析。
支持的模型：
1. ChatGLM系列
2. LLaMA系列
3. Baichuan系列
"""

import json
import requests
import time
import os

class LocalAIPoemGenerator:
    def __init__(self, api_url="http://localhost:8000/v1/completions"):
        """
        初始化本地AI诗词生成器
        
        Args:
            api_url (str): 本地模型API地址
        """
        self.api_url = api_url
        
    def generate_poem_content(self, poem):
        """
        为诗词生成翻译、背景和赏析
        
        Args:
            poem (dict): 诗词信息
            
        Returns:
            dict: 生成的内容
        """
        prompt = f"""你是一位古典诗词研究专家，请为以下古诗提供详细的白话翻译、创作背景和赏析解读。

要求：
1. 白话翻译要准确传达原诗意境，语言流畅自然
2. 创作背景要结合诗人经历和历史背景
3. 赏析解读要从艺术手法、思想情感等角度深入分析
4. 用中文回答，结构清晰

诗名：《{poem['title']}》
作者：{poem['author']}
朝代：{poem['dynasty']}
内容：{poem['content']}

请按照以下格式输出：
【白话翻译】
[你的翻译内容]

【创作背景】
[创作背景说明]

【赏析解读】
[赏析内容]"""
        
        try:
            # 调用本地模型API
            response = requests.post(
                self.api_url,
                headers={"Content-Type": "application/json"},
                json={
                    "prompt": prompt,
                    "max_tokens": 1000,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "stop": ["\n\n"]
                },
                timeout=300  # 5分钟超时
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['text']
                return self.parse_poem_content(content)
            else:
                print(f"API调用失败，状态码: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"生成诗词《{poem['title']}》内容时出错: {e}")
            return None
    
    def parse_poem_content(self, content):
        """
        解析诗词内容
        
        Args:
            content (str): AI生成的内容
            
        Returns:
            dict: 解析后的内容
        """
        translation = ""
        background = ""
        appreciation = ""
        
        # 解析白话翻译
        if "【白话翻译】" in content:
            parts = content.split("【白话翻译】")
            if len(parts) > 1:
                translation_part = parts[1].split("【")[0].strip()
                translation = translation_part
        
        # 解析创作背景
        if "【创作背景】" in content:
            parts = content.split("【创作背景】")
            if len(parts) > 1:
                background_part = parts[1].split("【")[0].strip()
                background = background_part
        
        # 解析赏析解读
        if "【赏析解读】" in content:
            parts = content.split("【赏析解读】")
            if len(parts) > 1:
                appreciation_part = parts[1].strip()
                appreciation = appreciation_part
        
        return {
            "translation": translation,
            "background": background,
            "appreciation": appreciation
        }
    
    def process_poems_batch(self, poems, delay=1):
        """
        批量处理诗词
        
        Args:
            poems (list): 诗词列表
            delay (int): 处理间隔（秒）
            
        Returns:
            list: 处理结果
        """
        results = []
        
        for i, poem in enumerate(poems):
            print(f"正在处理第 {i+1}/{len(poems)} 首诗词: 《{poem['title']}》")
            
            content = self.generate_poem_content(poem)
            if content:
                results.append({
                    "id": poem.get("id", ""),
                    "title": poem["title"],
                    "author": poem["author"],
                    "generated_content": content
                })
            
            # 添加延迟避免过载
            if i < len(poems) - 1:
                time.sleep(delay)
        
        return results

def main():
    """主函数"""
    # 示例诗词数据
    sample_poems = [
        {
            "id": 1,
            "title": "静夜思",
            "author": "李白",
            "dynasty": "唐",
            "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。"
        },
        {
            "id": 2,
            "title": "春望",
            "author": "杜甫",
            "dynasty": "唐",
            "content": "国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。"
        }
    ]
    
    # 初始化生成器
    generator = LocalAIPoemGenerator()
    
    # 检查API是否可用
    try:
        response = requests.get("http://localhost:8000/v1/models", timeout=5)
        if response.status_code != 200:
            print("警告: 无法连接到本地模型API，将使用模拟数据")
            use_mock = True
        else:
            print("成功连接到本地模型API")
            use_mock = False
    except:
        print("警告: 无法连接到本地模型API，将使用模拟数据")
        use_mock = True
    
    if use_mock:
        # 使用模拟数据
        results = []
        for poem in sample_poems:
            results.append({
                "id": poem["id"],
                "title": poem["title"],
                "author": poem["author"],
                "generated_content": {
                    "translation": f"这里是《{poem['title']}》的模拟白话翻译",
                    "background": f"这里是《{poem['title']}》的模拟创作背景",
                    "appreciation": f"这里是《{poem['title']}》的模拟赏析解读"
                }
            })
    else:
        # 使用真实模型生成内容
        results = generator.process_poems_batch(sample_poems)
    
    # 保存结果
    output_file = os.path.join(os.path.dirname(__file__), "generated_poem_contents.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    
    print(f"处理完成，结果已保存到: {output_file}")

if __name__ == "__main__":
    main()