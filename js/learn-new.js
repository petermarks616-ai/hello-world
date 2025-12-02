class LearnNewWords {
    constructor() {
        this.currentIndex = 0;
        this.words = [];
        this.progressManager = new ProgressManager();
        this.init();
    }

    async init() {
        // 从AI获取新词汇
        this.words = await generateVocabulary('日常德语', 10);
        this.renderWord();
        this.setupEventListeners();
        this.updateProgressBar();
    }

    renderWord() {
        const word = this.words[this.currentIndex];
        if (!word) return;

        document.getElementById('germanWord').textContent = word.german;
        document.getElementById('translation').textContent = 
            `(${word.partOfSpeech}) ${word.translation}`;
        
        const exampleContainer = document.getElementById('exampleContainer');
        exampleContainer.innerHTML = word.examples.map(ex => 
            `<div class="example-sentence">
                <p class="german-example">${ex.german}</p>
                <p class="chinese-example">${ex.chinese}</p>
            </div>`
        ).join('');
        
        this.updateProgressBar();
    }

    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.handleNextWord();
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.handleNextWord();
            }
        });
    }

    handleNextWord() {
        const currentWord = this.words[this.currentIndex];
        
        // 添加到已掌握和今日学习
        this.progressManager.addMasteredWord(currentWord.german);
        this.progressManager.addToTodayWords(currentWord.german);
        
        this.currentIndex++;
        
        if (this.currentIndex < this.words.length) {
            this.renderWord();
        } else {
            // 学习完成，返回概览页
            this.showCompletionMessage();
        }
    }

    updateProgressBar() {
        const progress = ((this.currentIndex + 1) / this.words.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = 
            `进度: ${this.currentIndex + 1}/${this.words.length}`;
    }

    showCompletionMessage() {
        // 显示完成动画，然后跳转
        document.body.innerHTML = `
            <div class="completion-screen">
                <i class="fas fa-trophy" style="font-size: 4rem; color: gold; margin-bottom: 20px;"></i>
                <h2>太棒了！🎉</h2>
                <p>你已完成今天的学习！</p>
                <p>学会了 ${this.words.length} 个新单词</p>
                <button onclick="window.location.href='overview.html'" class="primary-btn">
                    返回概览
                </button>
            </div>
        `;
    }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
    new LearnNewWords();
});
