// 学习进度跟踪和管理
class ProgressTracker {
    constructor() {
        this.sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');
    }
    
    // 开始新的学习会话
    startNewSession(type) {
        const session = {
            id: Date.now(),
            type: type, // 'learn' 或 'review'
            startTime: new Date().toISOString(),
            words: [],
            completed: false
        };
        
        this.sessionHistory.push(session);
        this.save();
        return session;
    }
    
    // 结束会话
    endSession(sessionId, results) {
        const session = this.sessionHistory.find(s => s.id === sessionId);
        if (session) {
            session.endTime = new Date().toISOString();
            session.results = results;
            session.completed = true;
            this.save();
        }
    }
    
    // 获取今日学习统计
    getTodayStats() {
        const today = new Date().toDateString();
        const todaySessions = this.sessionHistory.filter(s => 
            new Date(s.startTime).toDateString() === today && s.completed
        );
        
        let learned = 0;
        let reviewed = 0;
        
        todaySessions.forEach(session => {
            if (session.type === 'learn') {
                learned += session.results?.length || 0;
            } else if (session.type === 'review') {
                reviewed += session.results?.length || 0;
            }
        });
        
        return { learned, reviewed, sessions: todaySessions.length };
    }
    
    // 保存到本地存储
    save() {
        localStorage.setItem('sessionHistory', JSON.stringify(this.sessionHistory));
    }
}

export const progressTracker = new ProgressTracker();
