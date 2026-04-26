let charts = { money: null, hours: null };

function initGauge(id, pct, col) {
    const ctx = document.getElementById(id).getContext('2d');
    return new Chart(ctx, { 
        type: 'doughnut', 
        data: { datasets: [{ data: [pct, 100-pct], backgroundColor: [col, 'rgba(255,255,255,0.05)'], borderWidth: 0, circumference: 180, rotation: 270, borderRadius: 5, cutout: '80%' }] }, 
        options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false }, legend: { display: false } } } 
    });
}

function initRevenue() {
    const r = window.db.revenue;
    if (!r) return;

    document.getElementById('today-rev').innerText = r.today.rev.toLocaleString();
    document.getElementById('today-clients').innerText = r.today.clients;
    document.getElementById('today-hours').innerText = r.today.hours + 'h';
    document.getElementById('month-rev').innerText = r.month.rev.toLocaleString();
    document.getElementById('month-hours').innerText = r.month.hours + 'h';

    const mP = Math.min(Math.round((r.month.rev/20000)*100), 100);
    const hP = Math.min(Math.round((r.month.hours/200)*100), 100);

    if (charts.money) charts.money.destroy();
    charts.money = initGauge('moneyGauge', mP, '#22c55e');

    if (charts.hours) charts.hours.destroy();
    charts.hours = initGauge('hoursGauge', hP, '#facc15');

    let html = '';
    r.structure.forEach(s => {
        html += `<div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;"><span style="color:var(--text-dim)">${s.name}</span><span>${s.value.toLocaleString()} PLN</span></div>`;
    });
    document.getElementById('struct-list').innerHTML = html;
}
