// app.js - 主应用控制器
import { ProgressManager } from './progress.js';

// 添加调试信息
console.log('🚀 app.js 开始加载');
console.log('ProgressManager:', ProgressManager);

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
        console.log('🔗 绑定事件');
        
        // 欢迎页面进入按钮
        const enterBtn = document.getElementById('enterBtn');
        if (enterBtn) {
            console.log('✅ 找到进入按钮');
            enterBtn.addEventListener('click', () => {
                window.location.href = 'overview.html';
            });
        }

        // 学习新词按钮
        const learnNewBtn = document.getElementById('learnNewBtn');
        if (learnNewBtn) {
            console.log('✅ 找到学习新词按钮');
            learnNewBtn.addEventListener('click', () => {
                window.location.href = 'learn-new.html';
            });
        }

        // 复习旧词按钮
        const reviewOldBtn = document.getElementById('reviewOldBtn');
        if (reviewOldBtn) {
            console.log('✅ 找到复习旧词按钮');
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
        console.log('📊 更新每日统计');
        
        try {
            const progressManager = new ProgressManager();
            console.log('✅ ProgressManager 实例创建成功');
            
            progressManager.resetDailyStats();
            
            const stats = progressManager.getStats();
            console.log('统计数据:', stats);
            
            // 更新概览页面的统计数字
            const elements = {
                'masteredCount': stats.mastered,
                'todayCount': stats.todayLearned,
                'streakCount': stats.streak
            };
            
            Object.keys(elements).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    console.log(`更新 ${key}: ${elements[key]}`);
                    this.animateCounter(element, elements[key]);
                }
            });
            
        } catch (error) {
            console.error('❌ 更新统计失败:', error);
        }
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
    console.log('📄 DOM 加载完成');
    console.log('当前页面:', window.location.href);
    
    window.app = new GermanVocabApp();
    console.log('✅ 主应用已启动');
});

// 导出类（如果需要）
// export { GermanVocabApp };
