/* ============================================================
   MOBILE SIDEBAR TOGGLE
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    function isMobile() { return window.innerWidth <= 768; }

    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile_menu_btn');

    if (!sidebar) return;

    function openSidebar() {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }

    /* mobile_menu_btn 클릭 → 사이드바 열기/닫기 */
    if (menuBtn) {
        menuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
        });
    }

    /* 사이드바 내 nav_item / sub_item 클릭 → 페이지 이동 후 닫기 */
    sidebar.addEventListener('click', function (e) {
        if (!isMobile()) return;

        const navItem = e.target.closest('.nav_item');
        const subItem = e.target.closest('.sub_item');

        if (subItem) {
            // sub_item: 링크 이동 후 닫기
            closeSidebar();
        } else if (navItem) {
            // sub_menu 없는 nav_item(단독 페이지)만 닫기
            const container = navItem.closest('.item_container');
            const hasSub = container && container.querySelector('.sub_menu');
            if (!hasSub) {
                closeSidebar();
            }
        }
    });

    /* 오버레이 클릭 → 닫기 */
    document.addEventListener('click', function (e) {
        if (!isMobile()) return;
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
            closeSidebar();
        }
    });

    /* 데스크톱 리사이즈 시 닫기 */
    window.addEventListener('resize', function () {
        if (!isMobile()) closeSidebar();
    });

});