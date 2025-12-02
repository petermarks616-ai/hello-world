// review-old.js - 复习旧词逻辑
import { ProgressManager } from './progress.js';

class ReviewOldWords {
    constructor() {
        this.currentIndex = 0;
        this.words = [];
        this.currentWord = null;
        this.options = [];
        this.progressManager = new ProgressManager();
        this.init();
    }

    async init() {
        this.words = this.progressManager.getWordsForReview(10);
        console.log('复习词汇:', this.words);
        
        if (this.words.length === 0) {
            this.showNoWordsMessage();
            return;
        }
        await this.loadWord();
        this.setupEventListeners();
    }

    async loadWord() {
        this.currentWord = this.words[this.currentIndex];
        
        // 如果是真实单词，需要从AI获取完整信息
        const wordData = await this.getWordDetails(this.currentWord);
        this.currentWord = wordData;
        
        this.renderWord();
        this.generateOptions();
    }

    async getWordDetails(word) {
        // 这里可以调用API获取单词详情，或从本地存储获取
        // 简化实现，使用示例数据
        return {
            german: word,
            translation: '示例翻译',
            partOfSpeech: '名词',
            examples: [{ german: '示例句子', chinese: '翻译' }],
            hints: ['错误选项1', '错误选项2', '错误选项3']
        };
    }

    renderWord() {
        document.getElementById('reviewGermanWord').textContent = this.currentWord.german;
        this.updateProgressBar();
    }

    generateOptions() {
        // 生成4个选项（1个正确，3个干扰项）
        this.options = [
            { text: this.currentWord.translation, correct: true },
            ...this.currentWord.hints.map(hint => ({ text: hint, correct: false }))
        ].sort(() => Math.random() - 0.5);
        
        this.renderOptions();
    }

    renderOptions() {
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        this.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option.text}`;
            button.dataset.correct = option.correct;
            button.addEventListener('click', () => this.handleOptionClick(option));
            container.appendChild(button);
        });
    }

    handleOptionClick(option) {
        const buttons = document.querySelectorAll('.option-btn');
        
        buttons.forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            } else if (btn === event.target && !option.correct) {
                btn.classList.add('wrong');
            }
        });

        setTimeout(() => {
            if (option.correct) {
                this.nextWord();
            } else {
                this.showLearningCard();
            }
        }, 1500);
    }

    showLearningCard() {
        // 显示详细学习页面
        document.getElementById('reviewCard').style.display = 'none';
        document.getElementById('learningCard').style.display = 'block';
        
        document.getElementById('detailGerman').textContent = this.currentWord.german;
        document.getElementById('detailTranslation').textContent = 
            `(${this.currentWord.partOfSpeech}) ${this.currentWord.translation}`;
    }

    nextWord() {
        this.currentIndex++;
        
        if (this.currentIndex < this.words.length) {
            document.getElementById('learningCard').style.display = 'none';
            document.getElementById('reviewCard').style.display = 'block';
            this.loadWord();
        } else {
            this.showCompletion();
        }
    }

    updateProgressBar() {
        const progress = ((this.currentIndex + 1) / this.words.length) * 100;
        document.getElementById('reviewProgressFill').style.width = `${progress}%`;
        document.getElementById('reviewProgressText').textContent = 
            `进度: ${this.currentIndex + 1}/${this.words.length}`;
    }

    showCompletion() {
        document.body.innerHTML = `
            <div class="completion-screen">
                <i class="fas fa-star" style="font-size: 4rem; color: #fbbf24; margin-bottom: 20px;"></i>
                <h2>复习完成！🌟</h2>
                <p>你已经复习了 ${this.words.length} 个单词</p>
                <button onclick="window.location.href='overview.html'" class="primary-btn">
                    返回概览
                </button>
            </div>
        `;
    }

    showNoWordsMessage() {
        document.body.innerHTML = `
            <div class="completion-screen">
                <i class="fas fa-book" style="font-size: 4rem; color: var(--primary-color);"></i>
                <h2>还没有学习的单词</h2>
                <p>先去学习一些新单词吧！</p>
                <button onclick="window.location.href='learn-new.html'" class="primary-btn">
                    学习新词
                </button>
            </div>
        `;
    }
}

// 页面初始化
window.addEventListener('DOMContentLoaded', () => {
    new ReviewOldWords();
});
