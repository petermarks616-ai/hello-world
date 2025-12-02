// app.js - 主应用控制器
import { ProgressManager } from './progress.js';

class GermanVocabApp {
    constructor() {
        console.log('🎮 GermanVocabApp 初始化');
        this.init();
    }

    init() {
        this.bindEvents();
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

        // 返回概览按钮
        const backToOverviewBtns = document.querySelectorAll('[id*="backToOverview"]');
        backToOverviewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'overview.html';
            });
        });

        // 完成弹窗按钮
        document.addEventListener('click', (e) => {
            if (e.target.id === 'reviewNowBtn') {
                window.location.href = 'review-old.html';
            }
        });
    }

    updateDailyStats() {
        const progressManager = new ProgressManager();
        progressManager.resetDailyStats();
        
        const stats = progressManager.getStats();
        
        // 更新概览页面的统计数字
        const elements = {
            'masteredCount': stats.mastered,
            'todayCount': stats.todayLearned,
            'streakCount': stats.streak
        };
        
        Object.keys(elements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
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
    console.log('✅ 主应用已启动');
});
