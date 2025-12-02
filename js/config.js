// config.js - 修复导出问题

// 方案1：使用默认导出
const CONFIG = {
    DEBUG: true,
    PROVIDER: 'gemini',
    USE_FALLBACK: true,  // 设为 true，使用本地数据避免 API 问题
    
    API_CONFIG: {
        gemini: {
            baseURL: 'https://gemini.beijixingxing.com/v1/chat/completions',
            apiKey: 'sk-piAuLNkpYsL0EzpM9EcR0hN8sej9eBIwV3rgeDJzgKi2hoYh',
            model: 'gemini-2.5-pro[真流-50/次]'
        },
        openai: {
            baseURL: 'https://api.openai.com/v1/chat/completions',
            apiKey: 'YOUR_API_KEY',
            model: 'gpt-3.5-turbo'
        }
    }
};

// 导出为默认导出
export default CONFIG;

// 或者也可以有命名导出（如果需要）
export const AI_CONFIG = CONFIG.API_CONFIG.gemini;
