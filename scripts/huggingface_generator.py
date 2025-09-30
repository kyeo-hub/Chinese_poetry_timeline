#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
使用Hugging Face模型的诗词内容生成器

此脚本演示如何使用Hugging Face上的开源模型来生成诗词的翻译、背景和赏析。
这些模型可以免费使用，但需要先下载到本地。
"""

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import json
import os

class HuggingFacePoemGenerator:
    def __init__(self, model_name="THUDM/chatglm2-6b"):
        """
        初始化Hugging Face诗词生成器
        
        Args:
            model_name (str): 模型名称
        """
        print(f"正在加载模型: {model_name}")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, 
            trust_remote_code=True,
            torch_dtype=torch.float16,
            device_map="auto"
        )
        self.model.eval()
        print("模型加载完成")
        
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
            # 编码输入
            inputs = self.tokenizer.encode(prompt, return_tensors="pt").to(self.model.device)
            
            # 生成文本
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_new_tokens=800,
                    num_return_sequences=1,
                    temperature=0.7,
                    top_p=0.9,
                    do_sample=True
                )
            
            # 解码输出
            generated_text = self.tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)
            
            # 解析内容
            return self.parse_poem_content(generated_text)
            
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

def main():
    """主函数"""
    # 检查是否有足够资源加载模型
    print("检查系统资源...")
    
    # 示例诗词数据
    sample_poems = [
        {
            "id": 1,
            "title": "静夜思",
            "author": "李白",
            "dynasty": "唐",
            "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。"
        }
    ]
    
    try:
        # 初始化生成器（首次运行会自动下载模型）
        generator = HuggingFacePoemGenerator("THUDM/chatglm2-6b-int4")
        
        # 处理诗词
        results = []
        for poem in sample_poems:
            print(f"正在处理诗词: 《{poem['title']}》")
            content = generator.generate_poem_content(poem)
            if content:
                results.append({
                    "id": poem["id"],
                    "title": poem["title"],
                    "author": poem["author"],
                    "generated_content": content
                })
        
        # 保存结果
        output_file = os.path.join(os.path.dirname(__file__), "hf_generated_poem_contents.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        print(f"处理完成，结果已保存到: {output_file}")
        
    except Exception as e:
        print(f"处理过程中出错: {e}")
        print("提示: 如果是资源不足，可以尝试使用量化版本的模型，如 THUDM/chatglm2-6b-int4")

if __name__ == "__main__":
    main()