// app.js - 尝试不同的导入方式

// 方案1：尝试默认导入（如果 progress.js 使用 export default）
try {
    import ProgressManager from 'js/progress.js';
    console.log('✅ 默认导入成功');
} catch (e1) {
    console.log('默认导入失败:', e1.message);
}

// 方案2：尝试命名导入（这是我们期望的方式）
try {
    import { ProgressManager } from './progress.js';
    console.log('✅ 命名导入成功');
} catch (e2) {
    console.log('命名导入失败:', e2.message);
}

// 方案3：动态导入
try {
    const progressModule = await import('./progress.js');
    const ProgressManager = progressModule.ProgressManager || progressModule.default;
    console.log('✅ 动态导入成功');
} catch (e3) {
    console.log('动态导入失败:', e3.message);
}
