// api.js - 修复导入和 API 问题
import CONFIG from './config.js';

// 调试信息
console.log('🔧 api.js 加载成功');
console.log('CONFIG:', CONFIG);

// 本地备用词汇数据（先绕过 API 问题）
const localVocabulary = [
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

async function generateVocabulary(topic = '日常德语词汇', count = 10) {
    console.log('📚 生成词汇请求:', topic, count);
    console.log('CONFIG.USE_FALLBACK:', CONFIG.USE_FALLBACK);
    
    // 如果配置为使用备用数据或API失败，直接返回本地数据
    if (CONFIG.USE_FALLBACK) {
        console.log('🔄 使用本地备用词汇数据');
        return getLocalVocabulary(count);
    }
    
    try {
        console.log('📡 尝试调用API...');
        const API_CONFIG = CONFIG.API_CONFIG[CONFIG.PROVIDER] || CONFIG.API_CONFIG.gemini;
        console.log('API配置:', API_CONFIG);
        
        // 测试API连接
        const response = await fetch(API_CONFIG.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    {
                        role: 'user',
                        content: 'Hello'
                    }
                ]
            })
        });
        
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
            console.warn('API请求失败，使用本地数据');
            return getLocalVocabulary(count);
        }
        
        // 实际的API调用逻辑
        const data = await response.json();
        console.log('API响应数据:', data);
        
        // 这里需要根据实际API响应格式解析
        // 暂时返回本地数据
        return getLocalVocabulary(count);
        
    } catch (error) {
        console.error('❌ API调用失败:', error);
        console.log('使用本地备用数据');
        return getLocalVocabulary(count);
    }
}

function getLocalVocabulary(count = 10) {
    console.log('📋 获取本地词汇，数量:', count);
    
    // 如果请求的数量大于本地数据量，重复使用
    if (count > localVocabulary.length) {
        const repeated = [];
        const repeatTimes = Math.ceil(count / localVocabulary.length);
        
        for (let i = 0; i < repeatTimes; i++) {
            repeated.push(...localVocabulary);
        }
        
        return repeated.slice(0, count);
    }
    
    return localVocabulary.slice(0, count);
}

// 导出函数
export { generateVocabulary, getLocalVocabulary };
