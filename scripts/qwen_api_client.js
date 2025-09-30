// 通义千问API客户端
const https = require('https');
const crypto = require('crypto');

class QwenAPIClient {
  constructor(apiKey, baseUrl = 'https://dashscope.aliyuncs.com') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // 生成请求签名
  generateSignature(method, uri, date, body = '') {
    // 实际实现需要根据阿里云签名规范进行
    // 这里简化处理
    return '';
  }

  // 调用通义千问文本生成API
  async callTextGeneration(prompt, parameters = {}) {
    const url = `${this.baseUrl}/api/v1/services/aigc/text-generation/generation`;
    
    const data = {
      model: 'qwen-plus', // 或使用 qwen-max, qwen-turbo 等模型
      input: {
        prompt: prompt
      },
      parameters: {
        max_tokens: 1500,
        temperature: 0.8,
        top_p: 0.8,
        ...parameters
      }
    };

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-Async': 'false'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          try {
            const result = JSON.parse(responseData);
            if (result.output && result.output.text) {
              resolve(result.output.text);
            } else {
              reject(new Error('API调用失败: ' + JSON.stringify(result)));
            }
          } catch (error) {
            reject(new Error('解析API响应失败: ' + error.message));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(new Error('网络请求失败: ' + error.message));
      });
      
      req.write(JSON.stringify(data));
      req.end();
    });
  }

  // 为诗词生成翻译、背景和赏析
  async generatePoemContent(poem) {
    const prompt = `你是一位古典诗词研究专家，请为以下古诗提供详细的白话翻译、创作背景和赏析解读。

要求：
1. 白话翻译要准确传达原诗意境，语言流畅自然
2. 创作背景要结合诗人经历和历史背景
3. 赏析解读要从艺术手法、思想情感等角度深入分析
4. 用中文回答，结构清晰

诗名：《${poem.title}》
作者：${poem.poet}
朝代：${poem.dynasty}
内容：${poem.content}

请按照以下格式输出：
【白话翻译】
[你的翻译内容]

【创作背景】
[创作背景说明]

【赏析解读】
[赏析内容]`;

    try {
      const result = await this.callTextGeneration(prompt);
      return this.parsePoemContent(result);
    } catch (error) {
      console.error(`生成诗词《${poem.title}》内容时出错:`, error);
      return null;
    }
  }

  // 解析诗词内容
  parsePoemContent(content) {
    const translationMatch = content.match(/【白话翻译】\s*([\s\S]*?)(?=【|$)/);
    const backgroundMatch = content.match(/【创作背景】\s*([\s\S]*?)(?=【|$)/);
    const appreciationMatch = content.match(/【赏析解读】\s*([\s\S]*?)(?=【|$)/);

    return {
      translation: translationMatch ? translationMatch[1].trim() : '',
      background: backgroundMatch ? backgroundMatch[1].trim() : '',
      appreciation: appreciationMatch ? appreciationMatch[1].trim() : ''
    };
  }
}

module.exports = QwenAPIClient;