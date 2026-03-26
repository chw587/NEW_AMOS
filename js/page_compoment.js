/* ============================================================
   02. Sensor Management
   ============================================================ */
// 공통 모달 초기화 함수
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

function initSensorInfo() { initModal(); }
function initInstallation() { initModal(); }



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
            }
        });
    });

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

            // 검색 후 요소 리스트 닫기
            document.querySelector('.elemenet_wrap').classList.remove('open');

            const dummyData = [
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '-999', result: 'Error' },
                { time: '09:51', element: 'Temp', value: '0.5', result: 'Normal' },
            ];

            const tbody = document.getElementById('table_body');
            const table = document.querySelector('.content_table');

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

            initInquiryChart();
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

            // 검색 후 요소 리스트 닫기
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

            // 검색 후 요소 리스트 닫기
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
function handleUpdate(iconBox) {
    if (iconBox.classList.contains('loading')) return;

    iconBox.classList.add('loading');

    setTimeout(() => {
        iconBox.classList.remove('loading');
        const timeEl = iconBox.closest('.status_item').querySelector('.info_value');
        timeEl.textContent = new Date().toLocaleString();
    }, 1000);
}