// 页面导航和全局功能
import { wordManager } from './word-data.js';
import { progressTracker } from './progress.js';

// 页面导航控制
class PageManager {
    constructor() {
        this.currentPage = 'welcome';
        this.init();
    }
    
    init() {
        // 绑定全局事件
        this.bindEvents();
        // 更新统计数据
        this.updateStats();
        // 检查连续学习天数
        this.checkDailyStreak();
    }
    
    // 页面切换
    navigateTo(page, data = {}) {
        // 实现页面切换逻辑
        // 根据页面名称加载对应的HTML文件或显示隐藏div
    }
    
    // 更新概览页面的统计数据
    updateStats() {
        const stats = wordManager.getStats();
        
        // 更新DOM元素
        document.getElementById('mastered-count').textContent = stats.mastered;
        document.getElementById('today-count').textContent = stats.todayLearned;
        document.getElementById('streak-count').textContent = stats.streakDays;
    }
    
    // 检查并更新连续学习天数
    checkDailyStreak() {
        const today = new Date().toDateString();
        const lastDate = wordManager.lastStudyDate;
        
        if (lastDate && new Date(today) - new Date(lastDate) > 86400000) {
            // 超过一天没学习，重置连续天数
            wordManager.streakDays = 0;
            wordManager.saveProgress();
        }
    }
    
    bindEvents() {
        // 全局事件绑定
        document.addEventListener('DOMContentLoaded', () => {
            this.updateStats();
        });
    }
}

// 初始化应用
const app = new PageManager();

// 导出常用函数
export const navigateTo = (page) => app.navigateTo(page);
export const updateStats = () => app.updateStats();
