const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    if (current === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.removeItem('theme');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
});
// 游戏搜索过滤
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.game-card').forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = title.includes(keyword) ? 'block' : 'none';
    });
});
