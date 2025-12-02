<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>不背德语单词 - 学习新词</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/components.css">
    <link rel="stylesheet" href="styles/animations.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="learning-page">
    <!-- 学习页面头部 -->
    <header class="learning-header">
        <div class="container">
            <div class="learning-header-content">
                <button class="back-btn" onclick="window.location.href='overview.html'">
                    <i class="fas fa-arrow-left"></i>
                    返回
                </button>
                <div class="learning-title">
                    <h2>学习新词</h2>
                    <div class="learning-subtitle">
                        <i class="fas fa-robot"></i>
                        AI智能生成内容
                    </div>
                </div>
                <div class="learning-controls">
                    <button class="icon-btn" id="soundToggle">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="icon-btn" id="hintToggle">
                        <i class="fas fa-lightbulb"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- 进度指示器 -->
    <div class="progress-indicator">
        <div class="container">
            <div class="progress-content">
                <div class="progress-info">
                    <span class="progress-text">进度</span>
                    <span class="progress-count" id="progressCount">1/10</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>
        </div>
    </div>

    <main class="container">
        <!-- 单词学习卡片 -->
        <div class="learning-card" id="learningCard">
            <!-- 单词部分 -->
            <div class="word-section">
                <div class="word-header">
                    <span class="word-number" id="wordNumber">#1</span>
                    <span class="difficulty-badge" id="difficultyBadge">初级</span>
                </div>
                
                <div class="word-content">
                    <h1 class="german-word" id="germanWord">das Haus</h1>
                    
                    <div class="word-meta">
                        <div class="meta-item">
                            <i class="fas fa-tag"></i>
                            <span class="meta-label">词性</span>
                            <span class="meta-value" id="partOfSpeech">名词</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-flag"></i>
                            <span class="meta-label">级别</span>
                            <span class="meta-value" id="wordLevel">A1</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-soundcloud"></i>
                            <span class="meta-label">发音</span>
                            <button class="pronounce-btn" id="pronounceBtn">
                                <i class="fas fa-play"></i>
                                播放
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 翻译部分 -->
            <div class="translation-section">
                <h3 class="section-title">
                    <i class="fas fa-language"></i>
                    中文翻译
                </h3>
                <div class="translation-card">
                    <div class="translation-content" id="translationContent">
                        <span class="translation-text">房子</span>
                        <div class="translation-details">
                            <span class="pinyin">[fáng zi]</span>
                            <span class="category">名词</span>
                        </div>
                    </div>
                    <div class="translation-example" id="translationExample">
                        <p>例：我的房子很大。</p>
                    </div>
                </div>
            </div>

            <!-- 例句部分 -->
            <div class="examples-section">
                <h3 class="section-title">
                    <i class="fas fa-comment-alt"></i>
                    例句学习
                </h3>
                <div class="examples-container">
                    <div class="example-card">
                        <div class="example-header">
                            <span class="example-type">基本用法</span>
                            <button class="sound-btn">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="example-content">
                            <p class="german-example" id="germanExample">Das Haus ist sehr schön.</p>
                            <p class="chinese-example" id="chineseExample">这个房子很漂亮。</p>
                        </div>
                        <div class="example-tips">
                            <i class="fas fa-info-circle"></i>
                            <span>注意："das" 是德语中的中性冠词</span>
                        </div>
                    </div>

                    <div class="example-card">
                        <div class="example-header">
                            <span class="example-type">拓展用法</span>
                            <button class="sound-btn">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div class="example-content">
                            <p class="german-example" id="germanExample2">Ich wohne in einem großen Haus.</p>
                            <p class="chinese-example" id="chineseExample2">我住在一个大房子里。</p>
                        </div>
                        <div class="example-tips">
                            <i class="fas fa-lightbulb"></i>
                            <span>"wohnen" 表示居住，"in" 表示在...里面</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 记忆提示 -->
            <div class="hint-section" id="hintSection">
                <h3 class="section-title">
                    <i class="fas fa-brain"></i>
                    记忆技巧
                </h3>
                <div class="hint-content" id="hintContent">
                    <p>联想记忆：想象一栋漂亮的房子 (Haus)，德语发音类似"豪斯"</p>
                </div>
            </div>
        </div>

        <!-- 控制按钮 -->
        <div class="controls-section">
            <div class="controls-container">
                <button class="control-btn secondary-btn" id="showMoreBtn">
                    <i class="fas fa-plus-circle"></i>
                    显示更多例句
                </button>
                
                <button class="control-btn primary-btn" id="nextBtn">
                    <i class="fas fa-check-circle"></i>
                    我已记住，学习下一个
                    <span class="btn-countdown" id="countdown">3</span>
                </button>
            </div>
            
            <div class="controls-tip">
                <i class="fas fa-keyboard"></i>
                提示：按 <kbd>空格键</kbd> 或 <kbd>Enter</kbd> 快速进入下一个
            </div>
        </div>
    </main>

    <!-- 完成学习弹窗 -->
    <div class="completion-modal" id="completionModal">
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-trophy"></i>
                <h3>恭喜完成！</h3>
            </div>
            <div class="modal-body">
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">学习完成</span>
                        <span class="stat-value">10个单词</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">用时</span>
                        <span class="stat-value" id="completionTime">12分钟</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">掌握率</span>
                        <span class="stat-value">100%</span>
                    </div>
                </div>
                <div class="completion-actions">
                    <button class="modal-btn secondary-btn" id="reviewNowBtn">
                        <i class="fas fa-redo"></i>
                        立即复习
                    </button>
                    <button class="modal-btn primary-btn" id="backToOverviewBtn">
                        <i class="fas fa-home"></i>
                        返回概览
                    </button>
                </div>
            </div>
        </div>
    </div>

     <script type="module" src="js/learn-new.js"></script>
</body>
</html>
