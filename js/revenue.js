let charts = { money: null, hours: null };

function initGauge(id, pct, col) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, { 
        type: 'doughnut', 
        data: { datasets: [{ data: [pct, 100-pct], backgroundColor: [col, 'rgba(255,255,255,0.05)'], borderWidth: 0, circumference: 180, rotation: 270, borderRadius: 5, cutout: '80%' }] }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false }, legend: { display: false } } } 
    });
}

function changeMonth(month) {
    if (window.db.history && window.db.history[month]) {
        updateRevenueView(window.db.history[month]);
    }
}

function updateRevenueView(data) {
    if (!data) return;
    
    document.getElementById('today-rev').innerText = (data.rev || 0).toLocaleString();
    document.getElementById('today-clients').innerText = data.clients || 0;
    document.getElementById('today-hours').innerText = (data.hours || 0) + 'h';
    document.getElementById('month-rev').innerText = (data.rev || 0).toLocaleString();
    document.getElementById('month-hours').innerText = (data.hours || 0) + 'h';

    const mP = Math.min(Math.round(((data.rev || 0)/20000)*100), 100);
    const hP = Math.min(Math.round(((data.hours || 0)/200)*100), 100);

    if (charts.money) charts.money.destroy();
    charts.money = initGauge('moneyGauge', mP, '#22c55e');

    if (charts.hours) charts.hours.destroy();
    charts.hours = initGauge('hoursGauge', hP, '#facc15');

    // Структура
    let structHtml = '';
    if (data.structure) {
        data.structure.forEach(s => {
            structHtml += `<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;"><span style="color:var(--text-dim)">${s.name}</span><span>${s.value.toLocaleString()} PLN</span></div>`;
        });
    }
    document.getElementById('struct-list').innerHTML = structHtml || '<div style="text-align:center; color:gray; font-size:12px;">Brak danych</div>';

    // ТОПы
    let loyaltyHtml = '';
    if (data.loyalty) {
        data.loyalty.forEach((c, i) => {
            loyaltyHtml += `<div class="client-item mini"><span class="rank">${i+1}</span><span class="name">${c.name}</span><span class="count">${c.count}</span></div>`;
        });
    }
    document.getElementById('rev-loyalty-list').innerHTML = loyaltyHtml || '---';

    let incomeHtml = '';
    if (data.income) {
        data.income.forEach((c, i) => {
            incomeHtml += `<div class="client-item mini"><span class="rank">${i+1}</span><span class="name">${c.name}</span><span class="count">${c.total.toLocaleString()}</span></div>`;
        });
    }
    document.getElementById('rev-income-list').innerHTML = incomeHtml || '---';
}

function initRevenue() {
    const history = window.db.history;
    const select = document.getElementById('month-select');
    const selectorContainer = document.getElementById('month-selector-container');

    if (history && Object.keys(history).length > 0) {
        // Если есть история (новый формат)
        selectorContainer.style.display = 'block';
        if (select.options.length === 0) {
            Object.keys(history).forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.innerText = m;
                select.appendChild(opt);
            });
        }
        const firstMonth = Object.keys(history)[0];
        updateRevenueView(history[firstMonth]);
    } else if (window.db.revenue) {
        // Фолбек для старого формата
        selectorContainer.style.display = 'none';
        const r = window.db.revenue;
        updateRevenueView({
            rev: r.month.rev,
            clients: r.month.clients,
            hours: r.month.hours,
            structure: r.structure
        });
    }
}
