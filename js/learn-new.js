// learn-new.js - 完整修复版
import { generateVocabulary } from './api.js';
import { generateVocabulary } from './progress.js';

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
            this.words = await generateVocabulary('日常德语', 10);
            
            console.log('✅ 获取到词汇:', this.words.length, '个');
            console.log('词汇内容:', this.words);
            
            // 检查词汇是否有效
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
    
    renderWord() {
        console.log(`🎨 渲染单词 ${this.currentIndex + 1}/${this.words.length}`);
        
        if (this.currentIndex >= this.words.length) {
            console.error('❌ 索引超出范围');
            return;
        }
        
        const word = this.words[this.currentIndex];
        
        // 更新页面元素
        const germanWord = document.getElementById('germanWord');
        const partOfSpeech = document.getElementById('partOfSpeech');
        const translationContent = document.getElementById('translationContent');
        const germanExample = document.getElementById('germanExample');
        const chineseExample = document.getElementById('chineseExample');
        const germanExample2 = document.getElementById('germanExample2');
        const chineseExample2 = document.getElementById('chineseExample2');
        const hintContent = document.getElementById('hintContent');
        const wordNumber = document.getElementById('wordNumber');
        
        if (germanWord) germanWord.textContent = word.german || '无数据';
        if (partOfSpeech) partOfSpeech.textContent = word.partOfSpeech || '名词';
        
        if (translationContent) {
            translationContent.innerHTML = `
                <span class="translation-text">${word.translation || '无翻译'}</span>
                <div class="translation-details">
                    <span class="category">${word.partOfSpeech || '名词'}</span>
                </div>
            `;
        }
        
        if (word.examples && word.examples.length > 0) {
            if (germanExample) germanExample.textContent = word.examples[0].german;
            if (chineseExample) chineseExample.textContent = word.examples[0].chinese;
            
            if (word.examples.length > 1) {
                if (germanExample2) germanExample2.textContent = word.examples[1].german;
                if (chineseExample2) chineseExample2.textContent = word.examples[1].chinese;
            }
        }
        
        if (hintContent) {
            hintContent.innerHTML = `<p>${word.hint || '暂无提示'}</p>`;
        }
        
        if (wordNumber) {
            wordNumber.textContent = `#${this.currentIndex + 1}`;
        }
        
        this.updateProgressBar();
    }
    
    setupEventListeners() {
        console.log('🎮 设置事件监听器');
        
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            // 移除现有监听器（防止重复绑定）
            nextBtn.replaceWith(nextBtn.cloneNode(true));
            const newNextBtn = document.getElementById('nextBtn');
            
            newNextBtn.addEventListener('click', () => {
                console.log('🖱️ 下一步按钮被点击');
                this.handleNextWord();
            });
        }
        
        // 绑定完成弹窗的按钮
        this.bindCompletionModalButtons();
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                console.log('⌨️ 键盘快捷键触发');
                this.handleNextWord();
            }
        });
    }
    
    bindCompletionModalButtons() {
        console.log('🔗 绑定完成弹窗按钮');
        
        // 绑定返回概览按钮
        const backToOverviewBtn = document.getElementById('backToOverviewBtn');
        if (backToOverviewBtn) {
            console.log('✅ 找到返回概览按钮');
            // 移除已有的事件监听器
            const newBtn = backToOverviewBtn.cloneNode(true);
            backToOverviewBtn.parentNode.replaceChild(newBtn, backToOverviewBtn);
            
            // 添加新的事件监听器
            document.getElementById('backToOverviewBtn').addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🏠 返回概览');
                window.location.href = 'overview.html';
            });
        }
        
        // 绑定立即复习按钮
        const reviewNowBtn = document.getElementById('reviewNowBtn');
        if (reviewNowBtn) {
            console.log('✅ 找到立即复习按钮');
            // 移除已有的事件监听器
            const newReviewBtn = reviewNowBtn.cloneNode(true);
            reviewNowBtn.parentNode.replaceChild(newReviewBtn, reviewNowBtn);
            
            // 添加新的事件监听器
            document.getElementById('reviewNowBtn').addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 立即复习');
                window.location.href = 'review-old.html';
            });
        }
    }
    
    handleNextWord() {
        console.log('🔄 处理下一个单词');
        console.log('当前索引:', this.currentIndex);
        
        if (this.isProcessing) {
            console.log('⏳ 正在处理中，跳过');
            return;
        }
        
        this.isProcessing = true;
        
        // 保存当前单词到进度
        const currentWord = this.words[this.currentIndex];
        
        // 更新进度管理（简化版）
        this.saveProgress(currentWord.german);
        
        // 短暂延迟，让用户看到反馈
        setTimeout(() => {
            this.currentIndex++;
            console.log('新索引:', this.currentIndex);
            
            if (this.currentIndex < this.words.length) {
                this.renderWord();
            } else {
                console.log('✅ 完成所有单词学习');
                this.showCompletionMessage();
            }
            
            this.isProcessing = false;
        }, 300);
    }
    
    saveProgress(word) {
        try {
            const storageKey = 'german_vocab_progress';
            const saved = localStorage.getItem(storageKey);
            let progress = saved ? JSON.parse(saved) : {
                masteredWords: [],
                todayWords: []
            };
            
            if (!progress.masteredWords.includes(word)) {
                progress.masteredWords.push(word);
            }
            
            localStorage.setItem(storageKey, JSON.stringify(progress));
            console.log('💾 保存进度:', word);
        } catch (error) {
            console.error('保存进度失败:', error);
        }
    }
    
    updateProgressBar() {
        const progress = ((this.currentIndex + 1) / this.words.length) * 100;
        
        const progressFill = document.getElementById('progressFill');
        const progressCount = document.getElementById('progressCount');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressCount) {
            progressCount.textContent = `${this.currentIndex + 1}/${this.words.length}`;
        }
    }
    
    showCompletionMessage() {
        console.log('🏆 显示完成消息');
        
        const modal = document.getElementById('completionModal');
        if (modal) {
            modal.style.display = 'flex';
            
            // 重新绑定按钮（确保事件有效）
            this.bindCompletionModalButtons();
            
            // 更新完成时间
            const timeElement = document.getElementById('completionTime');
            if (timeElement) {
                // 简单估算：每个单词约30秒
                const totalMinutes = Math.round(this.words.length * 0.5);
                timeElement.textContent = `${totalMinutes}分钟`;
            }
        }
    }
    
    showError(message) {
        console.error('❌ 显示错误:', message);
        
        const learningCard = document.getElementById('learningCard');
        if (learningCard) {
            learningCard.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>出错了</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="primary-btn">
                        重新加载
                    </button>
                </div>
            `;
        }
    }
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM 加载完成');
    
    // 检查是否在正确页面
    if (document.getElementById('learningCard')) {
        console.log('✅ 在学习页面，开始初始化');
        
        // 延迟初始化确保 DOM 完全加载
        setTimeout(function() {
            window.learnNewInstance = new LearnNewWords();
            console.log('🚀 LearnNewWords 实例已创建');
        }, 100);
    }
});
