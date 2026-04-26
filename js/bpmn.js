async function initBPMN() {
    console.log("Инициализация BPMN Viewer...");
    const container = document.getElementById('bpmn-canvas');
    
    // Определяем конструктор. В разных сборках он может называться по-разному.
    const BpmnConstructor = window.BpmnJS || window.BpmnNavigatedViewer || window.BpmnModeler;

    if (!BpmnConstructor) {
        const errorMsg = "Ошибка: Библиотека bpmn-js не загружена.";
        console.error(errorMsg);
        container.innerHTML = `<div style="color:red; padding:20px;">${errorMsg}</div>`;
        return;
    }

    // Подготавливаем модули
    const modules = [];
    const tokenSimulation = window.BpmnTokenSimulation || window.bpmnTokenSimulation;
    if (tokenSimulation) {
        modules.push(tokenSimulation);
    }

    // Создаем экземпляр, если его еще нет
    if (!window.bpmnViewer) {
        try {
            window.bpmnViewer = new BpmnConstructor({
                container: '#bpmn-canvas',
                keyboard: { bindTo: window },
                additionalModules: modules
            });
        } catch (e) {
            console.error("Ошибка при создании вьювера:", e);
            container.innerHTML = `<div style="color:red; padding:20px;">Ошибка инициализации: ${e.message}</div>`;
            return;
        }
    }

    try {
        console.log("Загрузка файла test.bpmn...");
        const response = await fetch('test.bpmn');
        if (!response.ok) throw new Error(`Файл не найден (Status: ${response.status})`);
        const xml = await response.text();

        // Импортируем XML
        await window.bpmnViewer.importXML(xml);
        
        // Масштабируем
        const canvas = window.bpmnViewer.get('canvas');
        canvas.zoom('fit-viewport');

        // Включаем симуляцию, если модуль загружен
        try {
            const simulation = window.bpmnViewer.get('tokenSimulation', false);
            if (simulation) {
                simulation.toggle();
                console.log("Симуляция токенов активирована");
            }
        } catch (simErr) {
            console.warn("Модуль симуляции недоступен или не загружен:", simErr);
        }

        tg.HapticFeedback.notificationOccurred('success');
        console.log("BPMN успешно отрисован");

    } catch (err) {
        console.error("Ошибка загрузки или импорта BPMN:", err);
        container.innerHTML = `
            <div style="color:red; padding:20px; background: rgba(255,255,255,0.9); position:relative; z-index:1000;">
                <h3>Ошибка BPMN</h3>
                <p>${err.message}</p>
                <small>Убедитесь, что файл 'test.bpmn' находится в той же папке, что и index.html</small>
            </div>`;
    }
}
