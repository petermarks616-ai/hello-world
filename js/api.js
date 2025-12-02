// api.js - 使用 ES6 模块导出
import { CONFIG } from './config.js';

async function generateVocabulary(topic = '日常德语词汇', count = 10) {
    console.log('📚 生成词汇:', topic, '数量:', count);
    
    // 暂时使用本地数据，避免 API 问题
    if (CONFIG.USE_FALLBACK) {
        console.log('🔄 使用本地词汇数据');
        return getLocalVocabulary(count);
    }
    
    try {
        // API 调用逻辑
        const API_CONFIG = CONFIG.API_CONFIG[CONFIG.PROVIDER] || CONFIG.API_CONFIG.gemini;
        
        const response = await fetch(`${API_CONFIG.baseURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的德语老师。请生成适合德语初学者的词汇。'
                    },
                    {
                        role: 'user',
                        content: `请生成${count}个${topic}相关的德语词汇，按以下JSON数组格式返回：
                        [
                            {
                                "german": "das Haus",
                                "partOfSpeech": "名词",
                                "translation": "房子",
                                "examples": [
                                    {"german": "Das Haus ist groß.", "chinese": "这个房子很大。"},
                                    {"german": "Ich wohne in einem Haus.", "chinese": "我住在一个房子里。"}
                                ],
                                "hint": "联想记忆：想象一栋漂亮的房子"
                            }
                        ]`
                    }
                ],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API返回数据:', data);
        
        // 解析响应...
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('❌ API调用失败:', error);
        return getLocalVocabulary(count);
    }
}

function getLocalVocabulary(count = 10) {
    // 本地词汇数据（同上，保持不变）
    const vocabulary = [
        {
            german: "der Apfel",
            partOfSpeech: "名词",
            translation: "苹果",
            examples: [
                { german: "Der Apfel ist rot.", chinese: "这个苹果是红色的。" },
                { german: "Ich esse einen Apfel.", chinese: "我在吃一个苹果。" }
            ],
            hint: "联想记忆：德语中的苹果是阳性名词，要用der",
            difficulty: "初级"
        },
        // ... 其他词汇
    ];
    
    return vocabulary.slice(0, count);
}

// 导出函数
export { generateVocabulary, getLocalVocabulary };
