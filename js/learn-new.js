// learn-new.js - 修改导入路径
import { generateVocabulary } from './api.js';
import { ProgressManager } from './progress.js';

// 添加调试信息
console.log('🚀 learn-new.js 加载成功');
console.log('当前文件路径:', import.meta.url);

class LearnNewWords {
    constructor() {
        console.log('🔧 LearnNewWords 初始化');
        this.currentIndex = 0;
        this.words = [];
        this.isProcessing = false;
        this.init();
    }
    
    async init() {
        console.log('📋 初始化开始');
        
        try {
            // 使用导入的 generateVocabulary 函数
            if (typeof generateVocabulary === 'function') {
                console.log('✅ generateVocabulary 函数可用');
                this.words = await generateVocabulary('日常德语', 10);
            } else {
                console.error('❌ generateVocabulary 未定义');
                throw new Error('generateVocabulary 函数未定义');
            }
            
            console.log('✅ 获取到词汇:', this.words.length, '个');
            
            if (!this.words || this.words.length === 0) {
                console.error('❌ 没有获取到词汇');
                this.showError('无法获取词汇数据');
                return;
            }
            
            // 渲染第一个单词
            this.renderWord();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 更新进度条
            this.updateProgressBar();
            
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            this.showError('初始化失败: ' + error.message);
        }
    }
    
    // ... 其他方法保持不变 ...
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM 加载完成');
    
    if (document.getElementById('learningCard')) {
        console.log('✅ 在学习页面，开始初始化');
        
        setTimeout(function() {
            window.learnNewInstance = new LearnNewWords();
            console.log('🚀 LearnNewWords 实例已创建');
        }, 100);
    }
});
