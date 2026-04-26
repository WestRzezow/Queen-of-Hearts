function initSegments() {
    const s = window.db.segments;
    if (!s) return;

    let lH = '', iH = '';
    s.loyalty.forEach((c, i) => {
        lH += `<div class="client-card">
            <div class="client-info"><span class="name">${c.name}</span><span class="rank">Pozycja #${i+1}</span></div>
            <div class="client-stat"><div class="val">${c.count}</div><div style="font-size:8px; color:var(--text-dim)">Wizyt</div></div>
        </div>`;
    });
    s.income.forEach((c, i) => {
        iH += `<div class="client-card">
            <div class="client-info"><span class="name">${c.name}</span><span class="rank">Pozycja #${i+1}</span></div>
            <div class="client-stat"><div class="val" style="color:var(--accent-green)">${Math.round(c.total).toLocaleString()}</div><div style="font-size:8px; color:var(--text-dim)">PLN</div></div>
        </div>`;
    });
    document.getElementById('loyalty-list').innerHTML = lH;
    document.getElementById('income-list').innerHTML = iH;
}
