import { CONFIG } from './config.js';

class AIService {
    constructor() {
        this.baseURL = CONFIG.AI_API.BASE_URL;
        this.apiKey = CONFIG.AI_API.API_KEY;
    }
    
    // 生成单词的详细解释和例句
    async generateWordDetail(germanWord, pos) {
        try {
            const prompt = `作为德语老师，请为单词"${germanWord}"（词性：${pos}）提供：
1. 准确的中文翻译（不超过5个词）
2. 一个德语例句（使用该单词的正确形式）
3. 例句的中文翻译

请以JSON格式返回：
{
    "translation": "中文翻译",
    "example_de": "德语例句",
    "example_cn": "例句中文翻译"
}`;

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.AI_API.MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            const content = JSON.parse(data.choices[0].message.content);
            return content;
            
        } catch (error) {
            console.error('AI服务调用失败:', error);
            // 返回默认值作为fallback
            return {
                translation: germanWord,
                example_de: `${germanWord} ist ein wichtiges Wort.`,
                example_cn: `${germanWord}是一个重要的单词。`
            };
        }
    }
    
    // 为复习生成干扰选项
    async generateDistractors(germanWord, correctPos, correctTranslation) {
        try {
            const prompt = `为德语单词"${germanWord}"（正确词性和翻译：${correctPos}, ${correctTranslation}）生成三个错误的词性和翻译选项。
每个选项格式：词性|中文翻译
词性只能是：n（名词）、v（动词）、adj（形容词）、adv（副词）

请以JSON数组格式返回：
[
    {"pos": "错误词性1", "translation": "错误翻译1"},
    {"pos": "错误词性2", "translation": "错误翻译2"},
    {"pos": "错误词性3", "translation": "错误翻译3"}
]`;

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.AI_API.MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.8
                })
            });
            
            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
            
        } catch (error) {
            console.error('生成干扰选项失败:', error);
            return [
                { pos: 'v', translation: '跑步' },
                { pos: 'adj', translation: '美丽的' },
                { pos: 'adv', translation: '快速地' }
            ];
        }
    }
    
    // 生成新的学习单词
    async generateNewWords(count, difficulty = 'A1') {
        // 实现单词生成逻辑
    }
}

export const aiService = new AIService();
