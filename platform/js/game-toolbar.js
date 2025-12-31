(function() {
    // 动态加载 CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // 假设脚本被引用时，相对路径是 ../platform/css/game-toolbar.css
    // 或者我们可以使用绝对路径，或者根据当前脚本路径推断
    // 为了简单起见，我们假设目录结构是固定的：game_folder/index.html -> 引用 ../platform/js/game-toolbar.js
    
    // 获取当前脚本的路径，以便定位 CSS
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const scriptPath = currentScript.src;
    const cssPath = scriptPath.replace('/js/game-toolbar.js', '/css/game-toolbar.css');

    link.href = cssPath;
    document.head.appendChild(link);

    // 创建 Toolbar 容器
    const container = document.createElement('div');
    container.id = 'platform-toolbar-container';

    // 创建 Home 按钮
    const homeBtn = document.createElement('a');
    homeBtn.href = '../index.html'; // 假设游戏都在一级子目录下
    homeBtn.className = 'platform-home-btn';
    homeBtn.innerHTML = '🏠<span>返回大厅</span>';
    homeBtn.title = '返回游戏大厅';

    container.appendChild(homeBtn);
    document.body.appendChild(container);
})();
