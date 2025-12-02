// 应用主控制器
class GermanVocabApp {
    constructor() {
        this.init();
    }

    init() {
        // 初始化事件监听器
        this.bindEvents();
        // 检查并更新每日统计数据
        this.updateDailyStats();
    }

    bindEvents() {
        // 欢迎页面进入按钮
        const enterBtn = document.getElementById('enterBtn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                window.location.href = 'overview.html';
            });
        }

        // 学习新词按钮
        const learnNewBtn = document.getElementById('learnNewBtn');
        if (learnNewBtn) {
            learnNewBtn.addEventListener('click', () => {
                window.location.href = 'learn-new.html';
            });
        }

        // 复习旧词按钮
        const reviewOldBtn = document.getElementById('reviewOldBtn');
        if (reviewOldBtn) {
            reviewOldBtn.addEventListener('click', () => {
                window.location.href = 'review-old.html';
            });
        }
    }

    updateDailyStats() {
        const progressManager = new ProgressManager();
        progressManager.resetDailyStats();
        
        // 更新概览页面的统计数据
        const stats = progressManager.getStats();
        
        const elements = {
            'masteredCount': stats.mastered,
            'todayCount': stats.todayLearned,
            'streakCount': stats.streak
        };
        
        // 更新页面上的统计数字
        Object.keys(elements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                // 添加动画效果
                this.animateCounter(element, elements[key]);
            }
        });
    }

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 30);
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GermanVocabApp();
});
