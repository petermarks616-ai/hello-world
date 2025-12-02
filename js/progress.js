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
                totalWords: 0,
                reviewQueue: []
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
            // 今天已经学习过
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

    getStats() {
        return {
            mastered: this.progress.masteredWords.length,
            todayLearned: this.progress.todayWords.length,
            streak: this.progress.streakDays,
            total: this.progress.totalWords
        };
    }

    addToTodayWords(word) {
        if (!this.progress.todayWords.includes(word)) {
            this.progress.todayWords.push(word);
            this.saveProgress();
        }
    }

    resetDailyStats() {
        const today = new Date().toDateString();
        const lastDate = this.progress.lastStudyDate;
        
        if (lastDate !== today) {
            this.progress.todayWords = [];
            this.saveProgress();
        }
    }

    getWordsForReview(count = 10) {
        // 获取需要复习的单词
        const mastered = this.progress.masteredWords;
        return mastered.slice(-count * 2).slice(0, count); // 复习最近学习的单词
    }
}
