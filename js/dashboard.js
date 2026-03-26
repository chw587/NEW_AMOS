/* ============================================================
   DASHBOARD
   ============================================================ */
function initDashboard() {

    // 상단 알림 끄기 직접 처리
    document.querySelector('.status_alarm > span')
        ?.addEventListener('click', () => {
            document.querySelector('.status_alarm').style.display = 'none';
        });

    // 전문 전체보기 (테이블 행 확장)
    document.querySelectorAll('.message_wrap table tbody tr td:last-child')
        .forEach(td => {
            td.addEventListener('click', () => {
                const tr = td.closest('tr');
                const table = tr.closest('table');
                const thead = table.querySelector('thead tr');
                const isExpanded = tr.classList.contains('expanded');

                table.querySelectorAll('tbody tr.expanded').forEach(r => r.classList.remove('expanded'));
                thead.classList.remove('expanded');

                if (!isExpanded) {
                    tr.classList.add('expanded');
                    thead.classList.add('expanded');
                }
            });
        });

    // 외부 클릭 시 expanded 초기화
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.message_wrap table')) {
            document.querySelectorAll('.message_wrap table tbody tr.expanded, .message_wrap table thead tr.expanded')
                .forEach(r => r.classList.remove('expanded'));
        }
    });

    // RWY 토글
    const rwyBtns = document.querySelectorAll('.real_time .toggle_btn button');
    const rwyWraps = document.querySelectorAll('.real_time .data_wrap');

    // 초기 상태 - rwy_2 숨김
    document.querySelector('.data_wrap.rwy_2')?.style.setProperty('display', 'none');

    rwyBtns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            // 버튼 active 토글
            rwyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // wrap 표시/숨김
            rwyWraps.forEach(wrap => wrap.style.display = 'none');
            rwyWraps[idx].style.display = 'flex';
        });
    });

    // 차트 초기화
    initDashboardCharts();
}