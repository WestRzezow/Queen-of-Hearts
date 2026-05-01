const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.headerColor = '#0b0e14';
tg.backgroundColor = '#0b0e14';

// Хелпер для тактильной отдачи
const haptic = {
    impact: (style = 'light') => tg.HapticFeedback.impactOccurred(style),
    notification: (type = 'success') => tg.HapticFeedback.notificationOccurred(type),
    selection: () => tg.HapticFeedback.selectionChanged()
};

window.db = { revenue: null, segments: null };

function decodeData(str) {
    if (!str) return null;
    try {
        return JSON.parse(decodeURIComponent(escape(atob(str))));
    } catch (e) {
        try { return JSON.parse(atob(str)); } catch(e2) { return null; }
    }
}

const urlParams = new URLSearchParams(window.location.search);
const raw = urlParams.get('data');
window.db = decodeData(raw) || { revenue: null, segments: null };

function showView(viewName) {
    if (viewName !== 'canvas') haptic.impact('medium');
    console.log("Switching view to:", viewName);
    
    // Скрываем все
    document.querySelectorAll('.view-screen').forEach(s => {
        s.classList.remove('active');
        s.style.setProperty('display', 'none', 'important');
    });
    
    // Показываем нужный
    const target = document.getElementById(viewName + '-view');
    if (target) {
        target.classList.add('active');
        const displayType = (viewName === 'canvas') ? 'grid' : 'block';
        target.style.setProperty('display', displayType, 'important');
        target.scrollTop = 0;
    }

    try {
        if (viewName === 'revenue') initRevenue();
        if (viewName === 'segments') initSegments();
        if (viewName === 'bpmn') initBPMN();
    } catch (e) { console.error("Init Error:", e); }
}

window.onload = () => showView('canvas');
