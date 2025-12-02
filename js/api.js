// api.js - 支持多种 API 提供商
import CONFIG from './config.js';

class VocabularyAPI {
    constructor() {
        this.config = CONFIG.API_CONFIG[CONFIG.PROVIDER] || CONFIG.API_CONFIG.openai;
        this.fallbackEnabled = CONFIG.USE_FALLBACK;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async generateVocabulary(topic = '日常德语词汇', count = 10) {
        console.group('🚀 生成词汇请求');
        console.log('主题:', topic);
        console.log('数量:', count);
        console.log('API提供商:', CONFIG.PROVIDER);
        console.log('API配置:', this.config);
        
        try {
            let vocabulary;
            
            // 根据提供商选择不同的请求方式
            switch (CONFIG.PROVIDER) {
                case 'gemini':
                    vocabulary = await this.callGeminiAPI(topic, count);
                    break;
                case 'openai':
                    vocabulary = await this.callOpenAIAPI(topic, count);
                    break;
                default:
                    vocabulary = await this.callCustomAPI(topic, count);
            }
            
            console.log('✅ API调用成功，返回词汇:', vocabulary);
            console.groupEnd();
            
            return vocabulary;
            
        } catch (error) {
            console.error('❌ API调用失败:', error);
            console.groupEnd();
            
            // 重试逻辑
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 重试 ${this.retryCount}/${this.maxRetries}...`);
                return this.generateVocabulary(topic, count);
            }
            
            // 使用备用数据
            if (this.fallbackEnabled) {
                console.warn('⚠️ 使用备用词汇数据');
                return this.getFallbackVocabulary(count);
            }
            
            throw error;
        }
    }

    async callGeminiAPI(topic, count) {
        console.log('📡 调用 Gemini API...');
        
        const prompt = `请生成${count}个${topic}相关的德语词汇，按以下JSON数组格式返回：
        [
            {
                "german": "das Haus",
                "partOfSpeech": "名词",
                "translation": "房子",
                "examples": [
                    {"german": "Das Haus ist groß.", "chinese": "这个房子很大。"},
                    {"german": "Ich wohne in einem Haus.", "chinese": "我住在一个房子里。"}
                ],
                "hint": "联想记忆：想象一栋漂亮的房子",
                "difficulty": "初级"
            }
        ]
        
        只返回JSON数组，不要有其他文本。`;
        
        // Gemini API 可能需要不同的请求格式
        const response = await fetch(`${this.config.baseURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的德语老师。请生成适合德语初学者的词汇。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });
        
        console.log('📊 Gemini API响应状态:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Gemini API错误响应:', errorText);
            throw new Error(`Gemini API 请求失败: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📥 Gemini API原始响应:', data);
        
        // 尝试解析 Gemini 的响应
        let words;
        try {
            // Gemini 可能返回不同的结构
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                // Google Gemini 格式
                const content = data.candidates[0].content.parts[0]?.text || data.candidates[0].content;
                words = this.parseAPIResponse(content);
            } else if (data.choices && data.choices[0] && data.choices[0].message) {
                // OpenAI 兼容格式
                const content = data.choices[0].message.content;
                words = this.parseAPIResponse(content);
            } else if (Array.isArray(data)) {
                // 直接返回数组
                words = data;
            } else {
                throw new Error('无法识别的API响应格式');
            }
        } catch (parseError) {
            console.error('解析响应失败:', parseError);
            words = this.getFallbackVocabulary(count);
        }
        
        return words;
    }

    async callOpenAIAPI(topic, count) {
        console.log('📡 调用 OpenAI API...');
        
        const response = await fetch(`${this.config.baseURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
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
                                "hint": "联想记忆：想象一栋漂亮的房子",
                                "difficulty": "初级"
                            }
                        ]
                        只返回JSON数组，不要有其他文本。`
                    }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API 请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 OpenAI API原始响应:', data);
        
        return this.parseAPIResponse(data.choices[0].message.content);
    }

    async callCustomAPI(topic, count) {
        console.log('📡 调用自定义 API...');
        
        // 根据你的自定义 API 格式调整
        const response = await fetch(`${this.config.baseURL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                // 根据你的 API 文档调整
                prompt: `生成${count}个${topic}相关的德语词汇`,
                format: 'json'
            })
        });
        
        if (!response.ok) {
            throw new Error(`自定义 API 请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 自定义API原始响应:', data);
        
        return this.parseAPIResponse(data);
    }

    parseAPIResponse(content) {
        console.log('🔍 解析API响应:', typeof content, content);
        
        let parsed;
        
        try {
            // 如果 content 是字符串，解析它
            if (typeof content === 'string') {
                // 清理可能的 markdown 代码块
                const cleanedContent = content
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();
                
                parsed = JSON.parse(cleanedContent);
            } else {
                // 如果已经是对象，直接使用
                parsed = content;
            }
            
            // 处理不同的响应格式
            let words;
            
            if (Array.isArray(parsed)) {
                // 直接是数组
                words = parsed;
            } else if (parsed.words && Array.isArray(parsed.words)) {
                // 包含 words 字段的对象
                words = parsed.words;
            } else if (parsed.data && Array.isArray(parsed.data)) {
                // 包含 data 字段的对象
                words = parsed.data;
            } else if (parsed.result && Array.isArray(parsed.result)) {
                // 包含 result 字段的对象
                words = parsed.result;
            } else {
                console.warn('⚠️ 无法识别的响应格式，使用备用数据');
                words = this.getFallbackVocabulary(10);
            }
            
            // 验证和清理数据
            return words.map((word, index) => ({
                german: word.german || `德语单词 ${index + 1}`,
                partOfSpeech: word.partOfSpeech || '名词',
                translation: word.translation || `翻译 ${index + 1}`,
                examples: word.examples || [
                    { german: `例句 ${index + 1}`, chinese: `例句翻译 ${index + 1}` }
                ],
                hint: word.hint || '暂无提示',
                difficulty: word.difficulty || '初级',
                pinyin: word.pinyin || '',
                category: word.category || '基本词汇'
            }));
            
        } catch (error) {
            console.error('❌ 解析响应失败:', error);
            console.log('原始内容:', content);
            return this.getFallbackVocabulary(10);
        }
    }

    getFallbackVocabulary(count = 10) {
        console.log('🔄 使用备用词汇，数量:', count);
        
        const fallbackVocabulary = [
            {
                german: "der Apfel",
                partOfSpeech: "名词",
                translation: "苹果",
                examples: [
                    { german: "Der Apfel ist rot.", chinese: "这个苹果是红色的。" },
                    { german: "Ich esse einen Apfel.", chinese: "我在吃一个苹果。" }
                ],
                hint: "联想记忆：德语中的苹果是阳性名词，要用der",
                difficulty: "初级",
                category: "食物"
            },
            {
                german: "die Schule",
                partOfSpeech: "名词",
                translation: "学校",
                examples: [
                    { german: "Ich gehe zur Schule.", chinese: "我去学校。" },
                    { german: "Die Schule beginnt um 8 Uhr.", chinese: "学校8点开始。" }
                ],
                hint: "die Schule是阴性名词，注意冠词",
                difficulty: "初级",
                category: "场所"
            },
            {
                german: "das Buch",
                partOfSpeech: "名词",
                translation: "书",
                examples: [
                    { german: "Das Buch ist interessant.", chinese: "这本书很有趣。" },
                    { german: "Ich lese ein Buch.", chinese: "我在读一本书。" }
                ],
                hint: "das Buch是中性名词，和英语的book相似",
                difficulty: "初级",
                category: "物品"
            },
            {
                german: "der Tisch",
                partOfSpeech: "名词",
                translation: "桌子",
                examples: [
                    { german: "Der Tisch ist groß.", chinese: "这张桌子很大。" },
                    { german: "Das Buch liegt auf dem Tisch.", chinese: "书在桌子上。" }
                ],
                hint: "阳性名词，记忆：桌子通常是男性化的",
                difficulty: "初级",
                category: "家具"
            },
            {
                german: "die Tür",
                partOfSpeech: "名词",
                translation: "门",
                examples: [
                    { german: "Die Tür ist geschlossen.", chinese: "门关着。" },
                    { german: "Bitte schließen Sie die Tür.", chinese: "请关上门。" }
                ],
                hint: "阴性名词，注意变音符号 ü",
                difficulty: "初级",
                category: "家居"
            },
            {
                german: "das Fenster",
                partOfSpeech: "名词",
                translation: "窗户",
                examples: [
                    { german: "Das Fenster ist offen.", chinese: "窗户开着。" },
                    { german: "Ich schaue aus dem Fenster.", chinese: "我往窗外看。" }
                ],
                hint: "中性名词，和英语window相似",
                difficulty: "初级",
                category: "家居"
            },
            {
                german: "der Stuhl",
                partOfSpeech: "名词",
                translation: "椅子",
                examples: [
                    { german: "Der Stuhl ist bequem.", chinese: "这把椅子很舒服。" },
                    { german: "Setzen Sie sich auf den Stuhl.", chinese: "请坐在椅子上。" }
                ],
                hint: "阳性名词，和英语的stool发音相似",
                difficulty: "初级",
                category: "家具"
            },
            {
                german: "die Lampe",
                partOfSpeech: "名词",
                translation: "灯",
                examples: [
                    { german: "Die Lampe ist hell.", chinese: "这盏灯很亮。" },
                    { german: "Schalten Sie die Lampe ein.", chinese: "请开灯。" }
                ],
                hint: "阴性名词，来自法语lampe",
                difficulty: "初级",
                category: "家电"
            },
            {
                german: "der Computer",
                partOfSpeech: "名词",
                translation: "电脑",
                examples: [
                    { german: "Der Computer ist neu.", chinese: "这台电脑是新的。" },
                    { german: "Ich arbeite am Computer.", chinese: "我在电脑上工作。" }
                ],
                hint: "阳性名词，和英语相同",
                difficulty: "初级",
                category: "电子产品"
            },
            {
                german: "das Handy",
                partOfSpeech: "名词",
                translation: "手机",
                examples: [
                    { german: "Das Handy ist kaputt.", chinese: "手机坏了。" },
                    { german: "Mein Handy klingelt.", chinese: "我的手机在响。" }
                ],
                hint: "中性名词，德语中常用Handy表示手机",
                difficulty: "初级",
                category: "电子产品"
            }
        ];
        
        // 如果需要的数量多于备用词汇，循环使用
        if (count > fallbackVocabulary.length) {
            const repeated = [];
            const repeatTimes = Math.ceil(count / fallbackVocabulary.length);
            
            for (let i = 0; i < repeatTimes; i++) {
                repeated.push(...fallbackVocabulary);
            }
            
            return repeated.slice(0, count);
        }
        
        return fallbackVocabulary.slice(0, count);
    }
}

// 导出单例实例
const vocabularyAPI = new VocabularyAPI();

// 兼容旧版本的函数
async function generateVocabulary(topic = '日常德语词汇', count = 10) {
    console.log('⚠️ 使用旧版函数，建议升级到新的 VocabularyAPI 类');
    return await vocabularyAPI.generateVocabulary(topic, count);
}

export { vocabularyAPI, generateVocabulary };
export default vocabularyAPI;
