document.addEventListener('DOMContentLoaded', function () {

    // --- CHART.JS GLOBAL CONFIG ---
    Chart.defaults.font.family = 'Poppins';
    Chart.defaults.color = '#a0b0d0';
    Chart.defaults.plugins.legend.display = false;
    
    const charts = {};
    let refreshInterval;
    let currentRefreshRate = 1000;
    let currentDataExchangePeriod = 'year';

    // --- MOCK DATA GENERATOR ---
    const generateMockData = () => ({
        catalogDistribution: [
            { label: "Enterprise Technology", value: Math.floor(Math.random() * 10) + 65 },
            { label: "School Information", value: Math.floor(Math.random() * 10) + 40 },
            { label: "Supervisor Engineer", value: Math.floor(Math.random() * 1000) + 6500, max: 10000 },
        ],
        department: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
        dataSampling: Array.from({ length: 7 }, () => Math.floor(Math.random() * 250) + 50),
        dataExchange: {
            month: { input: Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 150), output: Array.from({ length: 30 }, () => Math.floor(Math.random() * 250) + 180), x_data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 150) + 100), y_data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 180) + 120), z_data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 220) + 90) },
            quarter: { input: Array.from({ length: 4 }, () => Math.floor(Math.random() * 700) + 400), output: Array.from({ length: 4 }, () => Math.floor(Math.random() * 800) + 500), x_data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 600) + 300), y_data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 650) + 350), z_data: Array.from({ length: 4 }, () => Math.floor(Math.random() * 750) + 250) },
            year: { input: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2400) + 1800), output: Array.from({ length: 12 }, () => Math.floor(Math.random() * 3000) + 2200), x_data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2000) + 1500), y_data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2200) + 1600), z_data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 2600) + 1300) },
        },
        exchangeDetails: [ 
            { value: Math.floor(Math.random() * 100) + 850, month: 'February - This is cricial sample data to be updated. The data for the february represent this' }, 
            { value: Math.floor(Math.random() * 100) + 750, month: 'October - The data of october is not normal need correction, to b updated by APi' },
            { value: Math.floor(Math.random() * 100) + 650, month: 'November - this month data is highly rliable, need consideration' }, 
            { value: Math.floor(Math.random() * 100) + 550, month: 'August - This is basically a sample text, Actual data will be provide by API' },
            { value: Math.floor(Math.random() * 100) + 450, month: 'March - What to do with this data, Need actual data from API when integrated' },
        ],
       
        kpis: { input: Math.random() * 100 + 850, output: Math.random() * 100 + 970, inputTrend: (Math.random() * 40 - 20), outputTrend: (Math.random() * 40 - 20) },
        status: { succeed: Math.floor(Math.random() * 10) + 70, fail: Math.floor(Math.random() * 10) + 55, exchanging: Math.floor(Math.random() * 10) + 40 },
  
        interfacesRank: [ 
            { label: "Resident Information", value: Math.floor(Math.random() * 25) + 30 }, 
            { label: "Personnel Information", value: Math.floor(Math.random() * 10) + 40 }, 
            { label: "Social Security Information", value: Math.floor(Math.random() * 18) + 36 }, 
            { label: "School Information", value: Math.floor(Math.random() * 10) + 30 },
            { label: "Contestenst information", value: Math.floor(Math.random() * 12) + 25 },
            { label: "Sample information2", value: Math.floor(Math.random() * 15) + 20 }, 
            { label: "School Information", value: Math.floor(Math.random() * 23) + 30 },
            { label: "Sample information10", value: Math.floor(Math.random() * 12) + 25 },
            { label: "Sample information20", value: Math.floor(Math.random() * 15) + 20 }, 
        ],
  
  
        catalogStatus: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))
    });

    // --- CHART INITIALIZATION ---
    function initializeCharts() {
        const commonDoughnutOptions = { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: false } } };
        
        charts.catalogDistribution = new Chart('catalogDistributionChart', {
            type: 'doughnut', 
            data: { 
                datasets: [ { 
                    data: [], 
                    backgroundColor: ['#00b7ff', 'rgba(255, 255, 255, 0.05)'], 
                    borderWidth: 0, cutout: '80%' }, 
                            { 
                    data: [], 
                    backgroundColor: ['#1dc9b7', 'rgba(255, 255, 255, 0.05)'], 
                    borderWidth: 0, 
                    cutout: '65%' },
                            { 
                    data: [], 
                    backgroundColor: ['#ffc107', 'rgba(255, 255, 255, 0.05)'], 
                    borderWidth: 0, 
                    cutout: '50%' } 
                ] 
            }, 
            options: commonDoughnutOptions
        });

        charts.department = new Chart('departmentChart', { 
            type: 'radar', 
            data: { 
                labels: ['Treasury', 'Education', 'NSC', 'HUD', 'Transport', 'OSTP'], 
                datasets: [{ 
                    data: [], 
                    backgroundColor: 'rgba(29, 201, 183, 0.3)', 
                    borderColor: '#1dc9b7', 
                    pointBackgroundColor: '#1dc9b7' }] 
            }, 
            options: { 
                responsive: true, maintainAspectRatio: false, 
                scales: { 
                    r: { 
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' }, 
                        grid: { color: 'rgba(255, 255, 255, 0.2)' }, 
                        pointLabels: { color: '#e0e0e0', font: { size: 15 } }, 
                        ticks: { display: false } 
                    } } } });
        
        charts.dataSampling = new Chart('dataSamplingChart', { type: 'bar', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ data: [], backgroundColor: '#3d67ff', borderRadius: 5 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { enabled: true } }, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } }, x: { grid: { display: false } } } } });
        
        charts.dataExchange = new Chart('dataExchangeChart', { 
            type: 'line', 
            data: { 
                datasets: [ { 
                    label: 'Input', data: [], 
                    borderColor: '#1dc9b7', backgroundColor: 'rgba(29, 201, 183, 0.3)', fill: true, tension: 0.4 
                    }, { 
                    label: 'Output', data: [], 
                    borderColor: '#ff8800', backgroundColor: 'rgba(255, 136, 0, 0.3)',  fill: true, tension: 0.4 
                    }, { 
                    label: 'x-data', data: [], 
                    borderColor: '#8A2BE2', backgroundColor: 'rgba(138, 43, 226, 0.2)', fill: true, tension: 0.4 
                    }, { 
                    label: 'y-data', data: [], 
                    borderColor: '#30D5C8', backgroundColor: 'rgba(48, 213, 200, 0.2)', fill: true, tension: 0.4 
                    }, { 
                    label: 'z-data', data: [], 
                    borderColor: '#FF6347', backgroundColor: 'rgba(255, 99, 71, 0.2)', fill: true, tension: 0.4 
                    } ] }, 
                options: { 
                    responsive: true, maintainAspectRatio: false, 
                    plugins: { tooltip: { enabled: true } }, 
                    scales: { 
                        y: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }, 
                        x: { grid: { display: false } } 
                    }, 
                    plugins: { legend: { display: true, position: 'top', align: 'start', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } } } } });

        const statusDoughnutOptions = { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '80%', 
            plugins: { 
                tooltip: { 
                    enabled: true } } };
        
        charts.succeed = new Chart('succeedChart', { type: 'doughnut', data: { datasets: [{ data: [], backgroundColor: ['#00b7ff', 'rgba(0,0,0,0.2)'], borderWidth: 0 }] }, options: statusDoughnutOptions });
        charts.fail = new Chart('failChart', { type: 'doughnut', data: { datasets: [{ data: [], backgroundColor: ['#ff8800', 'rgba(0,0,0,0.2)'], borderWidth: 0 }] }, options: statusDoughnutOptions });
        charts.exchanging = new Chart('exchangingChart', { type: 'doughnut', data: { datasets: [{ data: [], backgroundColor: ['#ffc107', 'rgba(0,0,0,0.2)'], borderWidth: 0 }] }, options: statusDoughnutOptions });
        
        charts.catalogStatus = new Chart('catalogStatusChart', { type: 'doughnut', data: { labels: ["Submit", "Verify", "Sign In", "Release"], datasets: [{ data: [], backgroundColor: ['#00b7ff', '#1dc9b7', '#ffc107', '#3d67ff'], borderWidth: 0, cutout: '60%' }] }, options: { ...commonDoughnutOptions, plugins: { tooltip: { enabled: true }, legend: { display: true, position: 'right', labels: { color: '#a0b0d0' } } } } });
    }

    // --- DATA EXCHANGE CHART VIEW UPDATE ---
    function updateDataExchangeView(period, data) {
        const chart = charts.dataExchange;
        const exchangeData = data.dataExchange[period];
        let labels;
        if (period === 'month') labels = Array.from({ length: 30 }, (_, i) => i + 1);
        else if (period === 'quarter') labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        else labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        chart.data.labels = labels;
        chart.data.datasets[0].data = exchangeData.input;
        chart.data.datasets[1].data = exchangeData.output;
        chart.data.datasets[2].data = exchangeData.x_data;
        chart.data.datasets[3].data = exchangeData.y_data;
        chart.data.datasets[4].data = exchangeData.z_data;
    }

    // --- MAIN DASHBOARD UPDATE LOGIC ---
    function updateDashboard() {
        const data = generateMockData();
        const locale = 'de-DE';

        const catData = data.catalogDistribution;
        document.getElementById('catalogDistributionText').innerHTML = `<p><strong>${catData[0].value}%</strong> ${catData[0].label}</p><p><strong>${catData[1].value}%</strong> ${catData[1].label}</p><p><strong>${catData[2].value.toLocaleString()}</strong> ${catData[2].label}</p>`;
        charts.catalogDistribution.data.datasets[0].data = [catData[0].value, 100 - catData[0].value];
        charts.catalogDistribution.data.datasets[1].data = [catData[1].value, 100 - catData[1].value];

        const engineerPct = (catData[2].value / catData[2].max) * 100;
        charts.catalogDistribution.data.datasets[2].data = [engineerPct, 100 - engineerPct];
        
        document.getElementById('succeedText').innerHTML = `<span class="percent text-glow-blue">${data.status.succeed}%</span><span class="label">Succeed</span>`;
        document.getElementById('failText').innerHTML = `<span class="percent text-glow-orange">${data.status.fail}%</span><span class="label">Fail</span>`;
        document.getElementById('exchangingText').innerHTML = `<span class="percent" style="color:#ffc107;">${data.status.exchanging}%</span><span class="label">Exchanging</span>`;
        document.getElementById('succeedFeed').innerHTML = `Department of Build app<br>Information Exchange Succeed`;
        document.getElementById('failFeed').innerHTML = `Department of Build app<br>Information Exchange Succeed`;
        document.getElementById('exchangingFeed').innerHTML = `Department of Build app<br>Information Exchange Succeed`;

        document.getElementById('kpiInput').textContent = data.kpis.input.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('kpiOutput').textContent = data.kpis.output.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const updateTrend = (el, trend) => { el.textContent = `${trend.toFixed(0)}% ${trend >= 0 ? '↑' : '↓'}`; el.className = `badge ms-2 ${trend >= 0 ? 'bg-success-soft' : 'bg-danger-soft'}`; };
        updateTrend(document.getElementById('kpiInputTrend'), data.kpis.inputTrend);
        updateTrend(document.getElementById('kpiOutputTrend'), data.kpis.outputTrend);

        document.getElementById('exchangeDetails').innerHTML = data.exchangeDetails.map((item, i) => `<div class="col detail-item"><div class="detail-label">No.${i + 1}</div><div class="detail-value">${item.value.toLocaleString(locale,{maximumFractionDigits:0})},00</div><div class="detail-subtext">${item.month}</div></div>`).join('');

        const rankContainer = document.getElementById('interfacesRankContainer');
        const maxRankValue = Math.max(...data.interfacesRank.map(item => item.value), 60);
        rankContainer.innerHTML = data.interfacesRank.map(item => `<div class="rank-item"><div class="rank-label"><span>${item.label}</span><span class="text-white">${item.value}</span></div><div class="rank-bar-bg"><div class="rank-bar" style="width: ${(item.value / maxRankValue) * 100}%;"></div></div></div>`).join('');
        
        charts.department.data.datasets[0].data = data.department;
        charts.dataSampling.data.datasets[0].data = data.dataSampling;
        
        updateDataExchangeView(currentDataExchangePeriod, data);
        
        const updateStatusChart = (chart, value) => { chart.data.datasets[0].data = [value, 100 - value]; };
        updateStatusChart(charts.succeed, data.status.succeed);
        updateStatusChart(charts.fail, data.status.fail);
        updateStatusChart(charts.exchanging, data.status.exchanging);
        charts.catalogStatus.data.datasets[0].data = data.catalogStatus;
        
        Object.values(charts).forEach(chart => chart.update());
    }
    
    // --- EVENT LISTENERS & INTERVALS ---
    document.getElementById('dataExchangeFilter').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentDataExchangePeriod = e.target.dataset.period;
            document.querySelectorAll('#dataExchangeFilter .btn-filter').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            updateDashboard();
        }
    });

    function startInterval() {
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(updateDashboard, currentRefreshRate);
    }
    
    document.getElementById('refreshRateSelect').addEventListener('change', (e) => {
        currentRefreshRate = parseInt(e.target.value, 10);
        updateDashboard(); 
        startInterval();
    });

    // --- INITIALIZE DASHBOARD ---
    initializeCharts();
    updateDashboard();
    startInterval();
});