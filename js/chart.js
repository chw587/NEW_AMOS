/* ============================================================
   COMMON - CHART UTILS
   ============================================================ */
function getTimeLabels(intervalMinutes = 30, count = 10) {
    const now = new Date();
    const labels = [];
    for (let i = count - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        labels.push(`${hours}:${minutes}`);
    }
    return labels;
}

function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function initChart(id, data, type = 'line', color = getCSSVar('--main')) {
    const dom = document.getElementById(id);
    if (!dom) return;

    const isLine = type === 'line';
    const chart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });

    chart.setOption({
        tooltip: {
            trigger: 'item',
            formatter: ({ value }) => `${value}`,
            position: (point, params, dom, rect, size) => [
                point[0] - size.contentSize[0] / 2,
                point[1] - 50
            ]
        },
        grid: { top: 40, left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', data: getTimeLabels(), axisLabel: { fontSize: 10 } },
        yAxis: { type: 'value', scale: true, axisLabel: { fontSize: 10 } },
        series: [{
            data, type,
            smooth: isLine,
            lineStyle: isLine ? { color } : {},
            itemStyle: { color: isLine ? color : getCSSVar('--line') },
            areaStyle: isLine ? {
                color: {
                    type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: `${color}4D` },
                        { offset: 1, color: `${color}00` }
                    ]
                }
            } : {},
            emphasis: !isLine ? { focus: 'none', itemStyle: { color: getCSSVar('--main') } } : {}
        }]
    });

    requestAnimationFrame(() => chart.resize());
    return chart;
}


/* ============================================================
   DASHBOARD - CHARTS
   ============================================================ */
let dashboardCharts = [];

function initDashboardCharts() {
    dashboardCharts.forEach(c => c?.dispose());
    dashboardCharts = [
        initChart('chart_1', [120, 200, 150, 80, 70, 110, 130, 90, 160, 140], 'line'),
        initChart('chart_2', [30, 45, 20, 55, 40, 35, 50, 25, 60, 45], 'line', getCSSVar('--red')),
        initChart('chart_3', [22, 23, 24, 23, 22, 21, 20, 21, 22, 23], 'line', getCSSVar('--green')),
        initChart('chart_4', [65, 70, 68, 72, 75, 73, 70, 68, 66, 64], 'bar', getCSSVar('--main')),
        initChart('chart_5', [1013, 1012, 1011, 1012, 1013, 1014, 1013, 1012, 1011, 1010], 'line', getCSSVar('--yellow')),
        initChart('chart_6', [0, 0, 2, 5, 3, 0, 0, 1, 4, 2], 'line', getCSSVar('--main')),
    ];

    window.addEventListener('resize', () => dashboardCharts.forEach(c => c?.resize()));
}


/* ============================================================
   06. DATA INQUIRY - SINGLE VIEW CHART
   ============================================================ */
let inquiryChart = null;

function initInquiryChart() {
    const dom = document.getElementById('chart-container');
    if (!dom) return;

    if (inquiryChart) inquiryChart.dispose();

    inquiryChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });

    inquiryChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'] },
        grid: { top: 40, left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: getTimeLabels(30, 7) },
        yAxis: { type: 'value' },
        series: [
            { name: 'Email', type: 'line', stack: 'Total', data: [120, 132, 101, 134, 90, 230, 210] },
            { name: 'Union Ads', type: 'line', stack: 'Total', data: [220, 182, 191, 234, 290, 330, 310] },
            { name: 'Video Ads', type: 'line', stack: 'Total', data: [150, 232, 201, 154, 190, 330, 410] },
            { name: 'Direct', type: 'line', stack: 'Total', data: [320, 332, 301, 334, 390, 330, 320] },
            { name: 'Search Engine', type: 'line', stack: 'Total', data: [820, 932, 901, 934, 1290, 1330, 1320] }
        ]
    });

    window.addEventListener('resize', () => inquiryChart?.resize());
}


/* ============================================================
   희원 - 06. DATA INQUIRY - COMPARISON VIEW CHART
   id: chart-container-comparison (single_view chart-container와 분리)
   Base Data: --red, Compare Data: --g_text 컬러 사용
   ============================================================ */
let inquiryComparisonChart = null;

function initComparisonChart() {
    const dom = document.getElementById('chart-container-comparison');
    if (!dom) return;

    if (inquiryComparisonChart) inquiryComparisonChart.dispose();

    // 희원 - display:none 상태에서 초기화하면 크기를 못 잡으므로 높이 강제 지정
    dom.style.height = '300px';


    inquiryComparisonChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });

    inquiryComparisonChart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['Base Data', 'Compare Data'] },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: getTimeLabels(30, 7) },
        yAxis: { type: 'value' },
        series: [
            {
                name: 'Base Data',
                type: 'line',
                smooth: true,
                data: [120, 132, 101, 134, 90, 230, 210],
                lineStyle: { color: getCSSVar('--red') },
                itemStyle: { color: getCSSVar('--red') },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: `${getCSSVar('--red')}4D` },
                            { offset: 1, color: `${getCSSVar('--red')}00` }
                        ]
                    }
                }
            },
            {
                name: 'Compare Data',
                type: 'line',
                smooth: true,
                data: [220, 182, 191, 234, 290, 330, 310],
                lineStyle: { color: getCSSVar('--g_text') },
                itemStyle: { color: getCSSVar('--g_text') },
                areaStyle: {
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: `${getCSSVar('--green')}4D` },
                            { offset: 1, color: `${getCSSVar('--green')}00` }
                        ]
                    }
                }
            },
        ]
    });

    window.addEventListener('resize', () => inquiryComparisonChart?.resize());
}