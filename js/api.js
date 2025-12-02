// AI API 配置
const AI_CONFIG = {
    baseURL: 'https://gemini.beijixingxing.com/v1L', // 你的自定义URL
    apiKey: 'sk-piAuLNkpYsL0EzpM9EcR0hN8sej9eBIwV3rgeDJzgKi2hoYh', // 你的API密钥
    model: 'gemini-2.5-pro-preview-06-05[真流-GG公益-50/次]' // 或你使用的模型
};

// 获取AI生成的词汇
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
                        content: '你是一个专业的德语老师。请生成适合德语初学者的词汇，包含德语单词、词性、中文翻译和例句。'
                    },
                    {
                        role: 'user',
                        content: `请生成${count}个${topic}相关的德语词汇，按以下JSON格式返回：
                        {
                            "words": [
                                {
                                    "german": "das Haus",
                                    "partOfSpeech": "名词",
                                    "translation": "房子",
                                    "examples": [
                                        {"german": "Das Haus ist groß.", "chinese": "这个房子很大。"}
                                    ],
                                    "hints": ["错误的翻译1", "错误的翻译2", "错误的翻译3"]
                                }
                            ]
                        }`
                    }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 解析JSON响应
        const result = JSON.parse(content);
        return result.words;
    } catch (error) {
        console.error('AI API调用失败:', error);
        return getFallbackVocabulary(); // 返回备用词汇
    }
}

// 备用词汇数据
function getFallbackVocabulary() {
    return [
        {
            german: 'die Schule',
            partOfSpeech: '名词',
            translation: '学校',
            examples: [{"german": "Ich gehe zur Schule.", "chinese": "我去学校。"}],
            hints: ["学习", "老师", "班级"]
        },
        // 更多备用词汇...
    ];
}
