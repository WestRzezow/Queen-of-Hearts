async function initBPMN() {
    console.log("Инициализация BPMN Modeler...");
    const container = document.getElementById('bpmn-canvas');
    
    const BpmnModeler = window.BpmnJS;

    if (!BpmnModeler) {
        if (!window._retry) window._retry = 0;
        if (window._retry < 15) {
            window._retry++;
            setTimeout(initBPMN, 200);
            return;
        }
        container.innerHTML = "Ошибка: Библиотека BPMN не загружена.";
        return;
    }

    // Поиск модуля симуляции
    const simModule = window.BpmnTokenSimulation || (window.bpmnTokenSimulation && window.bpmnTokenSimulation.default);

    if (!window.modelerInstance) {
        try {
            window.modelerInstance = new BpmnModeler({
                container: '#bpmn-canvas',
                keyboard: { bindTo: window },
                additionalModules: simModule ? [simModule] : []
            });
        } catch (err) {
            console.error("Ошибка создания моделера:", err);
            return;
        }
    }

    try {
        const response = await fetch('test.bpmn?v=' + Date.now());
        const xml = await response.text();
        await window.modelerInstance.importXML(xml);
        
        const canvas = window.modelerInstance.get('canvas');
        canvas.zoom('fit-viewport');

        // Авто-активация симуляции
        setTimeout(() => {
            try {
                const simulation = window.modelerInstance.get('tokenSimulation', false);
                if (simulation) {
                    simulation.toggle();
                    console.log("Симуляция включена");
                }
            } catch (e) {
                console.warn("Модуль симуляции не готов");
            }
        }, 300);

    } catch (err) {
        console.error("Ошибка XML:", err);
    }
}
