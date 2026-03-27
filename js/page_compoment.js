/* ============================================================
   02. Sensor Management
   ============================================================ */
function initModal() {
    const modal = document.querySelector('.add_modal');
    const modalWrap = document.querySelector('.modal_wrap');

    document.querySelector('.add_btn')
        ?.addEventListener('click', () => modal.classList.add('active'));

    document.querySelectorAll('.close')
        .forEach(el => el.addEventListener('click', () => modal.classList.remove('active')));

    modal?.addEventListener('click', (e) => {
        if (!modalWrap.contains(e.target)) modal.classList.remove('active');
    });

    document.querySelector('.modal_footer button:first-child')
        ?.addEventListener('click', () => {
            alert('등록되었습니다');
            modal.classList.remove('active');
        });
}

function initHelpModal() {
    const helpModal = document.querySelector('.help_modal');
    const helpModalWrap = helpModal?.querySelector('.modal_wrap');

    document.querySelector('.help_btn')
        ?.addEventListener('click', () => helpModal.classList.add('active'));

    helpModal?.querySelectorAll('.close')
        .forEach(el => el.addEventListener('click', () => helpModal.classList.remove('active')));

    helpModal?.addEventListener('click', (e) => {
        if (!helpModalWrap.contains(e.target)) helpModal.classList.remove('active');
    });
}

function initSensorInfo() { initModal(); }
function initInstallation() { initModal(); }
function initUserManagement() { initModal(); }
function initGW() { initModal(); }
function initTD() { initModal(); }



/* ============================================================
   06. DATA INQUIRY
   ============================================================ */
function initDataInquiry() {

    // Single / Comparison 뷰 토글
    const viewBtns = document.querySelectorAll('.Data_Comparison_Inquiry .toggle_btn button');
    const singleView = document.querySelector('.Data_Comparison_Inquiry_content.single_view');
    const comparisonView = document.querySelector('.Data_Comparison_Inquiry_content.comparison_view');

    if (comparisonView) comparisonView.style.display = 'none';

    viewBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (idx === 0) {
                singleView.style.display = 'flex';
                comparisonView.style.display = 'none';
            } else {
                singleView.style.display = 'none';
                comparisonView.style.display = 'flex';

                // 희원 - comparison_view가 보이는 시점에 차트 resize
                setTimeout(() => {
                    if (typeof inquiryComparisonChart !== 'undefined' && inquiryComparisonChart) {
                        inquiryComparisonChart.resize();
                    }
                }, 50);
            }
        });
    });

    // ============================================================
    // comparison_view - 조회 간격에 따른 요소 리스트 변경
    // ============================================================
    const intervalElementMap = {
        '10초': [
            'WIND DIR (AVG)',
            'WIND DIR (MIN)',
            'WIND DIR (MAX)',
            'WIND SPEED (AVG)',
            'WIND SPEED (MIN)',
            'WIND SPEED (MAX)',
            'WIND SPEED (GUST)',
            'TEMPERATURE',
            'DEW POINT',
            'QNH (hPa)',
            'QNH (inHg)',
            'CLOUD BASE',
            'VISIBILITY',
            'VISIBILITY (MID)',
        ],
        '1분': [
            // Wind Speed
            'WIND SPEED (3S AVG)', 'WIND SPEED (3S MAX)', 'WIND SPEED (INSTANT)',
            'WIND SPEED (1M AVG)', 'WIND SPEED (1M MIN)', 'WIND SPEED (1M MAX)',
            'WIND SPEED (2M AVG)', 'WIND SPEED (2M MIN)', 'WIND SPEED (2M MAX)',
            'WIND SPEED (10M AVG)', 'WIND SPEED (10M MIN)', 'WIND SPEED (10M MAX)',
            'GUST (2M AVG)', 'GUST (10M AVG)',

            // Wind Direction
            'WIND DIR (3S AVG)', 'WIND DIR (INSTANT)',
            'WIND DIR (1M AVG)', 'WIND DIR (1M MIN)', 'WIND DIR (1M MAX)',
            'WIND DIR (2M AVG)', 'WIND DIR (2M MIN)', 'WIND DIR (2M MAX)',
            'WIND DIR (10M AVG)', 'WIND DIR (10M MIN)', 'WIND DIR (10M MAX)',
            'WIND DIR (2M VAR)', 'WIND DIR (10M VAR)',

            // MOR / RVR
            'MOR (LEFT 1M AVG)', 'MOR (LEFT 10M AVG)',
            'RVR (LEFT 1M AVG)', 'RVR (LEFT 10M AVG)',
            'VERTICAL VISIBILITY',
            'VISIBILITY (1M AVG)', 'VISIBILITY (10M AVG)',

            // MOR / RVR MID
            'MOR (MID 1M AVG)', 'MOR (MID 10M AVG)',
            'RVR (MID 1M AVG)', 'RVR (MID 10M AVG)',
            'VISIBILITY MID (1M AVG)', 'VISIBILITY MID (10M AVG)',

            // Cloud
            'CLOUD BASE (L1)', 'CLOUD BASE (L2)', 'CLOUD BASE (L3)',
            'CLOUD TYPE (L1)', 'CLOUD TYPE (L2)', 'CLOUD TYPE (L3)',

            // Weather
            'TEMPERATURE', 'DEW POINT', 'HUMIDITY',
            'QFE (hPa)', 'QNH (hPa)', 'QNH (inHg)', 'QFF (hPa)',
            'RAINFALL (1M)', 'RAINFALL (10M)', 'RAINFALL (30M)',
            'RAINFALL (1H)', 'RAINFALL (1D)',
            'SNOWFALL (1M)', 'SNOWFALL (1H)', 'SNOWFALL (NEW)', 'SNOWFALL (TOTAL)',
            'BL (BLOWING SNOW)', 'STATION PRESSURE',

            // PWC
            'PWC-NUM (15M AVG)', 'PWC-TEXT (15M AVG)',
            'PWC-NUM (LEFT 1M AVG)', 'PWC-TEXT (LEFT 1M AVG)',

            // MOR / RVR Min & Max
            'MOR (10M MIN)', 'MOR (10M MAX)',
            'RVR (10M MIN)', 'RVR (10M MAX)',
        ],
    };

    function updateElementListByInterval(listEl, interval) {
        const items = intervalElementMap[interval] || intervalElementMap['10초'];
        listEl.innerHTML = items.map(item => `
            <label><input type="checkbox">${item}</label>
        `).join('');
    }

    const intervalSelect = comparisonView?.querySelector('.comparison_time_wrap select');
    const compElementList = comparisonView?.querySelector('.elemenet_list');

    if (compElementList && intervalSelect) {
        updateElementListByInterval(compElementList, intervalSelect.value);
        intervalSelect.addEventListener('change', () => {
            updateElementListByInterval(compElementList, intervalSelect.value);
        });
    }

    // 요소 선택 토글
    document.querySelectorAll('.elemenet_header').forEach(header => {
        header.addEventListener('click', () => {
            header.closest('.elemenet_wrap').classList.toggle('open');
        });
    });

    // 검색
    document.querySelectorAll('.search_btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const checked = btn.closest('.elemenet_body')
                ?.querySelectorAll('input[type="checkbox"]:checked');

            if (!checked || checked.length === 0) {
                alert('요소를 선택해주세요.');
                return;
            }

            btn.closest('.elemenet_wrap').classList.remove('open');

            const dummyData = [
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
            ];

            const page = btn.closest('.page');
            const isComparison = page.classList.contains('comparison_view');

            const tbody = page?.querySelector(isComparison ? '#table_body_comparison' : '#table_body');
            const table = page?.querySelector('.content_table');

            if (!tbody || !table) return;

            if (dummyData.length === 0) {
                table.classList.add('no_data');
                table.classList.remove('has_data');
                tbody.innerHTML = '';
            } else {
                table.classList.add('has_data');
                table.classList.remove('no_data');
                tbody.innerHTML = dummyData.map(row => `
                    <tr>
                        <td>${row.time}</td>
                        <td>${row.element}</td>
                        <td>${row.value}</td>
                        <td class="${row.result.toLowerCase()}">${row.result}</td>
                    </tr>
                `).join('');
            }

            // 희원 - comparison_view면 initComparisonChart, single_view면 initInquiryChart 호출
            if (isComparison) {
                initComparisonChart();
            } else {
                initInquiryChart();
            }
        });
    });
}


/* ============================================================
   07. QUALITY MANAGEMENT
   ============================================================ */

const tableColors = {
    total_data: 'var(--main)',
    success_data: 'var(--green)',
    error_data: 'var(--red)',
    warning_data: 'var(--yellow)',
    missing_data: 'var(--text_2)',
};

function applyTableColors(tbody) {
    tbody.querySelectorAll('td[class]').forEach(td => {
        const colorKey = Object.keys(tableColors).find(key => td.classList.contains(key));
        if (colorKey) {
            td.querySelector('div')?.style.setProperty('background', tableColors[colorKey]);
            td.querySelector('div')?.style.setProperty('color', 'var(--wh)');
        }
    });
}

// Data Collection Rate
function initDataCollectionRate() {

    initHelpModal();

    // active 클릭
    document.querySelectorAll('.dataTables_info_divison > div').forEach(div => {
        div.addEventListener('click', () => {
            document.querySelectorAll('.dataTables_info_divison > div').forEach(d => d.classList.remove('active'));
            div.classList.add('active');
        });
    });

    // 툴팁 컬러 설정
    const tooltipColors = {
        total_data: 'var(--main)',
        success_data: 'var(--green)',
        error_data: 'var(--red)',
        warning_data: 'var(--yellow)',
        missing_data: 'var(--text_2)',
    };

    document.querySelectorAll('.dataTables_data').forEach(div => {
        const colorKey = Object.keys(tooltipColors).find(key => div.classList.contains(key));
        if (colorKey) {
            const color = tooltipColors[colorKey];
            div.querySelector('.tooltip_title').style.background = color;
            div.querySelectorAll('.tooltip_desc > span').forEach(span => {
                span.style.background = color;
            });
        }
    });
}

// QC Performance Monitoring
function initQCPerformanceMonitoring() {

    initHelpModal();

    // 요소 선택 토글
    document.querySelector('.elemenet_header')
        ?.addEventListener('click', () => {
            document.querySelector('.elemenet_wrap').classList.toggle('open');
        });

    // 검색
    document.querySelector('.search_btn')
        ?.addEventListener('click', () => {
            const checked = document.querySelectorAll('.elemenet_list input[type="checkbox"]:checked');

            if (checked.length === 0) {
                alert('요소를 선택해주세요.');
                return;
            }

            document.querySelector('.elemenet_wrap').classList.remove('open');

            const selected = Array.from(checked).map(cb => cb.closest('label').textContent.trim());
            const tbody = document.getElementById('table_body');
            const table = document.querySelector('.content_table');

            const dummyData = selected.map(el => ({
                element: el,
                checkType: '물리한계 검사',
                collectionRate: '98.00%',
                normalRate: '95.00%',
                errorRate: '2.00%',
                doubtRate: '1.00%',
                missingRate: '2.00%',
                period: '2026-03-01 ~ 2026-03-23',
            }));

            if (dummyData.length === 0) {
                table.classList.add('no_data');
                table.classList.remove('has_data');
                tbody.innerHTML = '';
            } else {
                table.classList.add('has_data');
                table.classList.remove('no_data');
                tbody.innerHTML = dummyData.map(row => `
                    <tr>
                        <td>${row.element}</td>
                        <td>${row.checkType}</td>
                        <td class="total_data">${row.collectionRate}</td>
                        <td class="success_data">${row.normalRate}</td>
                        <td class="error_data">${row.errorRate}</td>
                        <td class="warning_data">${row.doubtRate}</td>
                        <td class="missing_data">${row.missingRate}</td>
                        <td>${row.period}</td>
                    </tr>
                `).join('');
                applyTableColors(tbody);
            }
        });
}

// QC Statistical Report
function initQCStatisticalReport() {

    initHelpModal();

    // 요소 선택 토글
    document.querySelector('.elemenet_header')
        ?.addEventListener('click', () => {
            document.querySelector('.elemenet_wrap').classList.toggle('open');
        });

    // 검색
    document.querySelector('.search_btn')
        ?.addEventListener('click', () => {
            const checked = document.querySelectorAll('.elemenet_list input[type="checkbox"]:checked');

            if (checked.length === 0) {
                alert('요소를 선택해주세요.');
                return;
            }

            document.querySelector('.elemenet_wrap').classList.remove('open');

            const selected = Array.from(checked).map(cb => cb.closest('label').textContent.trim());
            const tbody = document.querySelector('.content_table tbody');

            tbody.innerHTML = selected.map(el => `
                <tr>
                    <td>${el}</td>
                    <td>물리한계 검사</td>
                    <td class="total_data"><div><h3>0.00%</h3><span>(0 / 0)</span></div></td>
                    <td class="success_data"><div><h3>0.00%</h3><span>(0 / 0)</span></div></td>
                    <td class="error_data"><div><h3>0.00%</h3><span>(0 / 0)</span></div></td>
                    <td class="warning_data"><div><h3>0.00%</h3><span>(0 / 0)</span></div></td>
                    <td class="missing_data"><div><h3>0.00%</h3><span>(0 / 0)</span></div></td>
                    <td><div><p>2026-03-23 <span>00:00</span></p>~<p>2026-03-23 <span>00:00</span></p></div></td>
                </tr>
            `).join('');
            applyTableColors(tbody);
        });
}


/* ============================================================
   08. SYSTEM MONITORING
   ============================================================ */

function initAMOS() {
    const rwyViewBtns = document.querySelectorAll('.rwy_server_wrap .toggle_btn button');
    const singleViewContent = document.querySelector('.rwy_server_wrap .server_wrap_content.single_view');
    const comparisonViewContent = document.querySelector('.rwy_server_wrap .server_wrap_content.comparison_view');

    if (comparisonViewContent) comparisonViewContent.style.display = 'none';

    rwyViewBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            rwyViewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (idx === 0) {
                singleViewContent.style.display = 'flex';
                comparisonViewContent.style.display = 'none';
            } else {
                singleViewContent.style.display = 'none';
                comparisonViewContent.style.display = 'flex';
            }
        });
    });
}

function handleUpdate(iconBox) {
    if (iconBox.classList.contains('loading')) return;

    iconBox.classList.add('loading');

    setTimeout(() => {
        iconBox.classList.remove('loading');
        const timeEl = iconBox.closest('.status_item').querySelector('.info_value');
        timeEl.textContent = new Date().toLocaleString();
    }, 1000);
}