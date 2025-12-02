// config.js
const AI_CONFIG = {
    // 尝试这些可能的 URL
    baseURL: 'https://gemini.beijixingxing.com/v1/chat/completions', // 方案1
    // baseURL: 'https://gemini.beijixingxing.com/v1L/v1/completions', // 方案2
    // baseURL: 'https://gemini.beijixingxing.com/api/v1/chat', // 方案3
    apiKey: 'sk-piAuLNkpYsL0EzpM9EcR0hN8sej9eBIwV3rgeDJzgKi2hoYh', // 替换为你的实际密钥
    model: 'gemini-2.5-pro[真流-50/次]' // Gemini 模型，不是 gpt-3.5-turbo
};

// 或者使用通用的配置
const CONFIG = {
    // 调试模式
    DEBUG: true,
    
    // API 提供商
    PROVIDER: 'gemini', // 或 'openai', 'custom'
    
    // 备用模式：如果 API 失败，使用本地数据
    USE_FALLBACK: true,
    
    // API 配置
    API_CONFIG: {
        gemini: {
            baseURL: 'https://gemini.beijixingxing.com/v1/chat/completions',
            apiKey: 'YOUR_API_KEY',
            model: 'gemini-pro'
        },
        openai: {
            baseURL: 'https://api.openai.com/v1/chat/completions',
            apiKey: 'YOUR_API_KEY',
            model: 'gpt-3.5-turbo'
        }
    }
};
