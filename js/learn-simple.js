// learn-simple.js - 完整的学习新词逻辑，不使用模块

// 进度管理器类
class ProgressManager {
    constructor() {
        this.storageKey = 'german_vocab_progress';
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.progress = JSON.parse(saved);
        } else {
            this.progress = {
                masteredWords: [],
                todayWords: [],
                streakDays: 0,
                lastStudyDate: null,
                totalWords: 0
            };
        }
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    addMasteredWord(word) {
        if (!this.progress.masteredWords.includes(word)) {
            this.progress.masteredWords.push(word);
            this.progress.totalWords++;
            this.updateStreak();
            this.saveProgress();
        }
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastDate = this.progress.lastStudyDate;
        
        if (!lastDate) {
            this.progress.streakDays = 1;
        } else if (lastDate === today) {
            return;
        } else {
            const last = new Date(lastDate);
            const diffDays = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                this.progress.streakDays++;
            } else {
                this.progress.streakDays = 1;
            }
        }
        
        this.progress.lastStudyDate = today;
        this.saveProgress();
    }

    addToTodayWords(word) {
        if (!this.progress.todayWords.includes(word)) {
            this.progress.todayWords.push(word);
            this.saveProgress();
        }
    }
}

// 学习新词主类
class LearnNewWords {
    constructor() {
        console.log('🚀 初始化学习新词页面');
        this.currentIndex = 0;
        this.words = [];
        this.progressManager = null;
        this.isProcessing = false;
        this.startTime = null;
        
        this.init();
    }
    
    async init() {
        console.log('📋 开始初始化');
        
        try {
            // 1. 获取词汇数据
            console.log('🔍 获取词汇数据...');
            this.words = generateVocabulary('日常德语', 10);
            
            if (!this.words || this.words.length === 0) {
                throw new Error('无法获取词汇数据');
            }
            
            console.log('✅ 获取到词汇:', this.words.length, '个');
            
            // 2. 初始化进度管理器
            this.progressManager = new ProgressManager();
            
            // 3. 记录开始时间
            this.startTime = new Date();
            
            // 4. 渲染第一个单词
            this.renderWord();
            
            // 5. 设置事件监听器
            this.setupEventListeners();
            
            // 6. 更新进度条
            this.updateProgressBar();
            
            console.log('🎉 初始化完成');
            
        } catch (error) {
            console.error('❌ 初始化失败:', error);
            this.showError('初始化失败: ' + error.message);
        }
    }
    
    renderWord() {
        console.log(`🎨 渲染单词 ${this.currentIndex + 1}/${this.words.length}`);
        
        // 检查索引是否有效
        if (this.currentIndex >= this.words.length) {
            console.error('❌ 索引超出范围');
            return;
        }
        
        const word = this.words[this.currentIndex];
        console.log('📖 当前单词:', word);
        
        // 获取DOM元素
        const germanWord = document.getElementById('germanWord');
        const partOfSpeech = document.getElementById('partOfSpeech');
        const translationContent = document.getElementById('translationContent');
        const germanExample = document.getElementById('germanExample');
        const chineseExample = document.getElementById('chineseExample');
        const germanExample2 = document.getElementById('germanExample2');
        const chineseExample2 = document.getElementById('chineseExample2');
        const hintContent = document.getElementById('hintContent');
        const wordNumber = document.getElementById('wordNumber');
        
        // 更新DOM元素内容
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
            if (germanExample) germanExample.textContent = word.examples[0].german || '';
            if (chineseExample) chineseExample.textContent = word.examples[0].chinese || '';
            
            if (word.examples.length > 1) {
                if (germanExample2) germanExample2.textContent = word.examples[1].german || '';
                if (chineseExample2) chineseExample2.textContent = word.examples[1].chinese || '';
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
            // 移除现有监听器（避免重复绑定）
            const newNextBtn = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
            
            // 添加新的监听器
            newNextBtn.addEventListener('click', () => {
                console.log('🖱️ 下一步按钮被点击');
                this.handleNextWord();
            });
        }
        
        // 键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('⌨️ 键盘快捷键触发');
                this.handleNextWord();
            }
        });
        
        // 完成弹窗的按钮
        const backToOverviewBtn = document.getElementById('backToOverviewBtn');
        if (backToOverviewBtn) {
            backToOverviewBtn.addEventListener('click', () => {
                window.location.href = 'overview.html';
            });
        }
        
        const reviewNowBtn = document.getElementById('reviewNowBtn');
        if (reviewNowBtn) {
            reviewNowBtn.addEventListener('click', () => {
                window.location.href = 'review-old.html';
            });
        }
    }
    
    handleNextWord() {
        console.log('🔄 处理下一个单词');
        console.log('当前索引:', this.currentIndex);
        
        // 防止重复点击
        if (this.isProcessing) {
            console.log('⏳ 正在处理中，跳过');
            return;
        }
        
        this.isProcessing = true;
        
        // 保存当前单词到进度
        const currentWord = this.words[this.currentIndex];
        if (this.progressManager) {
            this.progressManager.addMasteredWord(currentWord.german);
            this.progressManager.addToTodayWords(currentWord.german);
        }
        
        // 短暂延迟，让用户看到反馈
        setTimeout(() => {
            this.currentIndex++;
            console.log('新索引:', this.currentIndex);
            
            if (this.currentIndex < this.words.length) {
                // 还有更多单词，渲染下一个
                this.renderWord();
            } else {
                // 完成所有单词
                console.log('✅ 完成所有单词学习');
                this.showCompletionMessage();
            }
            
            this.isProcessing = false;
        }, 300);
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
            // 计算用时
            const endTime = new Date();
            const timeDiff = Math.round((endTime - this.startTime) / 1000 / 60); // 分钟
            
            // 更新完成时间
            const timeElement = document.getElementById('completionTime');
            if (timeElement) {
                timeElement.textContent = `${timeDiff}分钟`;
            }
            
            // 显示弹窗
            modal.style.display = 'flex';
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM 加载完成');
    
    // 检查是否在学习新词页面
    if (document.getElementById('learningCard')) {
        console.log('✅ 在学习新词页面，开始初始化');
        
        // 延迟初始化确保DOM完全加载
        setTimeout(function() {
            window.learnNewInstance = new LearnNewWords();
            console.log('🚀 LearnNewWords 实例已创建');
        }, 100);
    }
});
