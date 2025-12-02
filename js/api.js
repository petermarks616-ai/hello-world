// AI API 配置
const AI_CONFIG = {
    baseURL: 'https://gemini.beijixingxing.com', // 你的自定义URL
    apiKey: 'sk-piAuLNkpYsL0EzpM9EcR0hN8sej9eBIwV3rgeDJzgKi2hoYh', // 你的API密钥
    model: 'gemini-2.5-pro-preview-06-05[真流-GG公益-50/次]' // 或你使用的模型
};

// 获取AI生成的词汇
// 修正后的 api.js 部分
async function generateVocabulary(topic = '日常德语词汇', count = 10) {
    try {
        const response = await fetch(`${AI_CONFIG.baseURL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的德语老师。请生成适合德语初学者的词汇，每个单词必须包含：德语单词、词性、中文翻译和至少2个例句。以严格的JSON数组格式返回。'
                    },
                    {
                        role: 'user',
                        content: `请生成${count}个${topic}相关的德语词汇，按以下JSON数组格式返回，不要有其他文本：
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
                temperature: 0.7,
                response_format: { type: "json_object" }  // 告诉API返回JSON
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        
        // 调试：查看API返回的数据
        console.log('API返回数据:', data);
        
        // 解析响应内容
        const content = data.choices[0].message.content;
        
        let words;
        try {
            words = JSON.parse(content);
            // 如果返回的是对象且包含words字段
            if (words.words && Array.isArray(words.words)) {
                words = words.words;
            } else if (Array.isArray(words)) {
                // 已经是数组
                words = words;
            } else {
                throw new Error('返回格式不正确');
            }
        } catch (parseError) {
            console.error('解析JSON失败:', parseError, '内容:', content);
            words = getFallbackVocabulary();
        }
        
        // 确保返回的是数组且长度正确
        if (!Array.isArray(words) || words.length === 0) {
            console.warn('返回的词汇数据为空或格式错误，使用备用数据');
            words = getFallbackVocabulary();
        }
        
        // 如果数量不够，用备用数据补充
        if (words.length < count) {
            const fallbackWords = getFallbackVocabulary();
            words = words.concat(fallbackWords.slice(0, count - words.length));
        }
        
        return words.slice(0, count);
        
    } catch (error) {
        console.error('AI API调用失败:', error);
        return getFallbackVocabulary(count);
    }
}

// 改进的备用词汇函数
function getFallbackVocabulary(count = 10) {
    const vocabulary = [
        {
            german: "der Apfel",
            partOfSpeech: "名词",
            translation: "苹果",
            examples: [
                { german: "Der Apfel ist rot.", chinese: "这个苹果是红色的。" },
                { german: "Ich esse einen Apfel.", chinese: "我在吃一个苹果。" }
            ],
            hint: "联想记忆：德语中的苹果是阳性名词，要用der"
        },
        {
            german: "die Schule",
            partOfSpeech: "名词",
            translation: "学校",
            examples: [
                { german: "Ich gehe zur Schule.", chinese: "我去学校。" },
                { german: "Die Schule beginnt um 8 Uhr.", chinese: "学校8点开始。" }
            ],
            hint: "die Schule是阴性名词，注意冠词"
        },
        // 添加更多备用词汇...
    ];
    
    // 如果需要的数量多于备用词汇，循环使用
    if (count > vocabulary.length) {
        const repeated = [];
        while (repeated.length < count) {
            repeated.push(...vocabulary);
        }
        return repeated.slice(0, count);
    }
    
    return vocabulary.slice(0, count);
}
