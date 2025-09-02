document.addEventListener('DOMContentLoaded', function () {

    // --- STATE & CONFIGURATION ---
    let pollingIntervalId = null;
    let simulationTime = 0;
    const MAX_INVERTER_POWER = 4000; // kW
    let chartObjects = {}; // To hold all chart instances
    
    // --- MOCK DATA ---
    const createMockData = () => ({
        delhi: { marketInfo: "Notes for Delhi.", 
            kpis: { energyYesterday: 12.3, realPower: 159.0, setpoint: 159.0, reactivePower: 22.1, lmpPrice: 22.4, powerFactor: 0.99 }, 
            weather: { poa: 1066.4, ghi: 816.0, temp: 21.0, wind: 3.0 }, 
            gauge: { value: 159.0, max: 250, irradiance: 977 }, 
            inverters: [{ name: 'DLI11', power: 3223.0 }, { name: 'DLI12', power: 3509.7 }, { name: 'DLI13', power: 3510.1 },
                        { name: 'DLI21', power: 3490.3 }, { name: 'DLI22', power: 3485.6 }, { name: 'DLI23', power: 3478.9 },
                        { name: 'DLI31', power: 3223.0 }, { name: 'DLI32', power: 3509.7 }, { name: 'DLI33', power: 3510.1 },]},
        mumbai: { marketInfo: "Mumbai is stable.", 
            kpis: { energyYesterday: 15.1, realPower: 182.5, setpoint: 182.0, reactivePower: 25.0, lmpPrice: 24.1, powerFactor: 0.98 }, 
            weather: { poa: 1100.2, ghi: 850.5, temp: 28.5, wind: 4.5 }, 
            gauge: { value: 182.5, max: 250, irradiance: 1050 }, 
            inverters: [{ name: 'MBI01', power: 3800.1 }, { name: 'MBI02', power: 3815.2 },{ name: 'MBI03', power: 3815.2 },
                        { name: 'MBI04', power: 3815.2 }, { name: 'MBI05', power: 3815.2 }, { name: 'MBI06', power: 3815.2 },
                        { name: 'MBI07', power: 3815.2 }, { name: 'MBI08', power: 3815.2 }, { name: 'MBI09', power: 3815.2 },]},
        kolkata: { marketInfo: "High winds in Kolkata.", 
            kpis: { energyYesterday: 10.5, realPower: 130.2, setpoint: 130.0, reactivePower: 18.2, lmpPrice: 21.5, powerFactor: 0.99 }, 
            weather: { poa: 950.0, ghi: 750.1, temp: 25.2, wind: 6.1 }, 
            gauge: { value: 130.2, max: 250, irradiance: 890 }, 
            inverters: [{ name: 'KL08', power: 3105.1 }, { name: 'KL09', power: 3115.9 },{ name: 'KL10', power: 3115.9 },
                        { name: 'KL11', power: 3115.9 }, { name: 'KL12', power: 3115.9 }, { name: 'KL13', power: 3115.9 },
                        { name: 'KL14', power: 3115.9 }, { name: 'KL15', power: 3115.9 }, { name: 'KL16', power: 3115.9 }]},
        chennai: { marketInfo: "Chennai grid normal.", 
            kpis: { energyYesterday: 18.2, realPower: 205.8, setpoint: 205.0, reactivePower: 28.9, lmpPrice: 25.8, powerFactor: 0.98 }, 
            weather: { poa: 1150.7, ghi: 880.3, temp: 31.4, wind: 2.8 }, 
            gauge: { value: 205.8, max: 250, irradiance: 1120 }, 
            inverters: [{ name: 'CH11', power: 3901.7 }, { name: 'CH12', power: 3888.1 }, { name: 'CH13', power: 3888.1 },
                        { name: 'CH14', power: 3888.1 }, { name: 'CH15', power: 3888.1 }, { name: 'CH16', power: 3888.1 },
                        { name: 'CH17', power: 3888.1 }, { name: 'CH18', power: 3888.1 }, { name: 'CH19', power: 3888.1 }]},
    });
    let currentDataStore = createMockData();

    // --- INITIALIZATION ---
    function initializeCharts() {
        Chart.defaults.color = '#8b949e';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = "'Poppins', sans-serif";

        const perfCtx = document.getElementById('performanceChart').getContext('2d');
        chartObjects.performance = new Chart(perfCtx, {
            type: 'line', 
            data: { labels: [], 
                datasets: [ { 
                    label: 'Expected Power', 
                    data: [], 
                    borderColor: '#36a2eb', 
                    backgroundColor: 'rgba(54, 162, 235, 0.5)', 
                    fill: true, 
                    yAxisID: 'yPower',
                    tension: 0.4
                    }, { 
                    label: 'Actual Power', 
                    data: [], 
                    borderColor: '#4bc0c0', 
                    backgroundColor: 'rgba(75, 192, 192, 0.5)', 
                    fill: true, 
                    yAxisID: 'yPower',
                    tension: 0.4
                    }, { 
                    label: 'Irradiance', 
                    data: [], 
                    borderColor: '#ffcd56', 
                    type: 'line', 
                    fill: false, 
                    yAxisID: 'yIrradiance' } ]},
            options: { responsive: true, maintainAspectRatio: false, animation: { duration: 400 }, interaction: { mode: 'index', intersect: false }, scales: { yPower: { type: 'linear', position: 'left', title: { display: true, text: 'Real Power [MW]' } }, yIrradiance: { type: 'linear', position: 'right', title: { display: true, text: 'Irradiance [W/m2]' }, grid: { drawOnChartArea: false } } }, plugins: { legend: { display: false } } }
        });

        const energyCtx = document.getElementById('energyProducedChart').getContext('2d');
        chartObjects.energy = new Chart(energyCtx, {
            type: 'bar', data: { labels: [], datasets: [{ label: 'Energy Produced', data: [], backgroundColor: '#36a2eb' }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, title: { display: true, text: 'Energy [MWh]' } } } }
        });
        
        const gaugeCtx = document.getElementById('powerGaugeChart').getContext('2d');
        chartObjects.gauge = new Chart(gaugeCtx, {
            type: 'doughnut', data: { labels: ['Power', 'Remaining'], datasets: [{ data: [50, 100], backgroundColor: ['#34d399', '#30363d'], borderColor: 'transparent' }] },
            options: { responsive: true, maintainAspectRatio: false, rotation: -90, circumference: 180, cutout: '70%', plugins: { tooltip: { enabled: false } } }
        });
    }

    // --- UI UPDATE FUNCTIONS ---
    const updateText = (id, value) => document.getElementById(id).textContent = value;
    
    function updateDashboardUI(plantData) {
        updateText('market-info-text', plantData.marketInfo);
        const kpis = plantData.kpis;
        updateText('kpi-energy-yesterday', kpis.energyYesterday.toFixed(1));
        updateText('kpi-real-power', kpis.realPower.toFixed(2));
        updateText('kpi-setpoint', kpis.setpoint.toFixed(1));
        updateText('kpi-reactive-power', kpis.reactivePower.toFixed(2));
        updateText('kpi-lmp-price', kpis.lmpPrice.toFixed(1));
        updateText('kpi-power-factor', kpis.powerFactor.toFixed(2));
        
        updateText('gauge-power-value', `${plantData.gauge.value.toFixed(1)} MW`);
        updateText('gauge-irradiance-value', `${plantData.gauge.irradiance.toFixed(0)} W/m2`);
        
        const inverterListEl = document.getElementById('inverter-list');
        inverterListEl.innerHTML = '';
        plantData.inverters.forEach(inv => {
            const percentage = (inv.power / MAX_INVERTER_POWER) * 100;
            inverterListEl.innerHTML += `<div class="inverter-item"><span>${inv.name}</span><div class="inverter-progress"><div class="inverter-progress-bar" style="width: ${percentage}%;"></div></div><span class="inverter-value">${inv.power.toFixed(1)} kW</span></div>`;
        });
    }

    // --- DATA & CHART LOGIC ---
    function updateChartsForNewRange() {
        const rangeValueEl = document.getElementById('range-value');
        let count = parseInt(rangeValueEl.value, 10);
        if (isNaN(count) || count < 1) {
            count = 1;
            rangeValueEl.value = count;
        }
        
        const labels = Array.from({ length: count }, (_, i) => `${i + 1}`);
        chartObjects.performance.data.labels = labels;
        chartObjects.energy.data.labels = labels;

        const basePower = 170 + Math.random() * 50;

        chartObjects.performance.data.datasets[0].data = Array.from({ length: count }, () => (170 + (Math.random() - .25) * 5) * 1.05);
        //console.log(basePower,count,chartObjects.performance.data.datasets[0].data);
        chartObjects.performance.data.datasets[1].data = Array.from({ length: count }, () => (170 + (Math.random() - .25) * 5));
        chartObjects.performance.data.datasets[2].data = Array.from({ length: count }, () => 800 + (Math.random() - .25) * 200);
        chartObjects.energy.data.datasets[0].data = Array.from({ length: count }, () => 1500 + (Math.random() - .25) * 500);

        chartObjects.performance.update();
        chartObjects.energy.update();
    }

    function simulateAndApplyLiveUpdates(plantId) {
        simulationTime += 0.25;
        const plantData = currentDataStore[plantId];
        const fluctuation = Math.sin(simulationTime) * 1.25;

        plantData.kpis.realPower += fluctuation;
        plantData.kpis.energyYesterday += Math.abs(fluctuation / 20);
        plantData.gauge.value = plantData.kpis.realPower;
        plantData.gauge.irradiance += fluctuation * 5;
        plantData.inverters.forEach(inv => inv.power += (Math.random() - 0.5) * 200);
        
        updateDashboardUI(plantData);
        
        chartObjects.gauge.data.datasets[0].data = [plantData.gauge.value, plantData.gauge.max - plantData.gauge.value];
        chartObjects.gauge.update('none');

        const dataLength = chartObjects.performance.data.labels.length;
        if (dataLength > 0) {
            const lastIndex = dataLength - 1;
            chartObjects.performance.data.datasets[1].data[lastIndex] = plantData.kpis.realPower;
            chartObjects.performance.data.datasets[0].data[lastIndex] = plantData.kpis.realPower * 1.05;
            chartObjects.performance.data.datasets[2].data[lastIndex] = plantData.gauge.irradiance;
            chartObjects.energy.data.datasets[0].data[lastIndex] = 1500 + Math.abs(fluctuation * 150);
            chartObjects.energy.data.datasets[0].data.forEach((value, index, arr) => {
                arr[index] = value + (Math.random() - .5) * (fluctuation * 150);
            });

            chartObjects.performance.update('quiet');
            chartObjects.energy.update('quiet');
        }
    }

    // --- EVENT HANDLERS & POLLING ---
    function startPolling() {
        if (pollingIntervalId) clearInterval(pollingIntervalId);
        const interval = parseInt(document.getElementById('interval-selector').value, 10);
        pollingIntervalId = setInterval(() => {
            const selectedPlant = document.getElementById('plant-selector').value;
            simulateAndApplyLiveUpdates(selectedPlant);
        }, interval);
    }
    
    document.getElementById('plant-selector').addEventListener('change', (event) => {
        const selectedPlant = event.target.value;
        currentDataStore = createMockData();
        updateText('gauge-title', `Plant ${selectedPlant.charAt(0).toUpperCase() + selectedPlant.slice(1)}`);
        updateDashboardUI(currentDataStore[selectedPlant]);
        updateChartsForNewRange();
        startPolling();
    });
    
    ['interval-selector', 'range-value', 'range-unit'].forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
             updateChartsForNewRange();
             startPolling();
        });
    });
    
    document.getElementById('main-nav').addEventListener('click', (event) => {
        if (event.target.classList.contains('nav-link')) {
            document.querySelector('#main-nav .active').classList.remove('active');
            event.target.classList.add('active');
        }
    });

    // --- STARTUP ---
    initializeCharts();
    updateDashboardUI(currentDataStore.delhi);
    updateChartsForNewRange();
    startPolling();
});