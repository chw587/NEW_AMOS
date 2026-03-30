/* ============================================================
   HEADER
   ============================================================ */
const dropdowns = {
  '.quick_menu': '.quick_menu_list',
  '.bell': '.noti_list',
  '.settings': '.setting_menu_list'
};

const closeAllDropdowns = () => {
  Object.values(dropdowns).forEach(t =>
    document.querySelector(t).classList.remove('active')
  );
};

// 로고 클릭 시 대시보드로 이동
document.querySelector('.logo').addEventListener('click', () => {
  loadPage('./page/dashboard.html');
  document.querySelectorAll('.nav_item.active').forEach(el => el.classList.remove('active'));
  document.querySelector('.nav_item')?.classList.add('active');
});

Object.entries(dropdowns).forEach(([trigger, target]) => {
  document.querySelector(trigger).addEventListener('click', (e) => {
    e.stopPropagation();
    const targetEl = document.querySelector(target);
    const isActive = targetEl.classList.contains('active');
    closeAllDropdowns();
    if (!isActive) targetEl.classList.add('active');
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.quick_menu') &&
    !e.target.closest('.bell') &&
    !e.target.closest('.settings')) {
    closeAllDropdowns();
  }
});


/* ============================================================
   페이지 전환
   ============================================================ */
const pageMap = {
  'DASHBOARD': './page/dashboard.html',

  // 01. Airport Management
  'Runway Specifications': './page/01. Airport Management/Runway_Specifications.html',

  // 02. Sensor Management
  'Sensor Infomation': './page/02. Sensor Management/Sensor_Infomation.html',
  'Installation Status': './page/02. Sensor Management/Installation_Status.html',

  // 03. Sensor Switching
  'Sensor Switch Configuration': './page/03. Sensor Switching/Sensor_Switch_Configuration.html',
  'Switching History': './page/03. Sensor Switching/Switching_History.html',
  'Data Reset': './page/03. Sensor Switching/Data_Reset.html',

  // 04. User Management
  'User Management': './page/04. User Management/User_Management.html',

  // 05. System Support
  'G/W Monitoring': './page/05. System Support/GW.html',
  'T/D Monitoring': './page/05. System Support/TD.html',

  // 06. Data Inquiry
  'Data Comparison & Inquiry': './page/06. Data Inquiry/Data_Comparison_&_Inquiry.html',

  // 07. Quality Management
  'Data Collection Rate': './page/07. Quality Management/Data_Collection_Rate.html',
  'QC Performance Monitoring': './page/07. Quality Management/QC_Performance_M.html',
  'QC Statistical Report': './page/07. Quality Management/QC_Statistical_Report.html',
  'Reference Values': './page/07. Quality Management/Reference_Values.html',

  // 08. System Monitoring
  'AMOS & Sensor Monitoring': './page/08. System Monitoring/A_S_M.html',
  'Log Monitoring': './page/08. System Monitoring/Log_m.html',
  'Process Monitoring': './page/08. System Monitoring/PM.html',
  'Server Status': './page/08. System Monitoring/Server_Status.html',
};

const pageInitMap = {
  './page/dashboard.html': () => typeof initDashboard === 'function' && initDashboard(),
  './page/06. Data Inquiry/Data_Comparison_&_Inquiry.html': () => typeof initDataInquiry === 'function' && initDataInquiry(),
  './page/01. Airport Management/Runway_Specifications.html': () => typeof initRunway === 'function' && initRunway(),
  './page/02. Sensor Management/Sensor_Infomation.html': () => typeof initSensorInfo === 'function' && initSensorInfo(),
  './page/02. Sensor Management/Installation_Status.html': () => typeof initInstallation === 'function' && initInstallation(),
  './page/03. Sensor Switching/Sensor_Switch_Configuration.html': () => typeof initSensorSwitch === 'function' && initSensorSwitch(),
  './page/04. User Management/User_Management.html': () => typeof initUserManagement === 'function' && initUserManagement(),
  './page/05. System Support/GW.html': () => typeof initGW === 'function' && initGW(),
  './page/05. System Support/TD.html': () => typeof initTD === 'function' && initTD(),
  './page/07. Quality Management/Data_Collection_Rate.html': () => typeof initDataCollectionRate === 'function' && initDataCollectionRate(),
  './page/07. Quality Management/QC_Performance_M.html': () => typeof initQCPerformanceMonitoring === 'function' && initQCPerformanceMonitoring(),
  './page/07. Quality Management/QC_Statistical_Report.html': () => typeof initQCStatisticalReport === 'function' && initQCStatisticalReport(),
  './page/08. System Monitoring/A_S_M.html': () => typeof initAMOS === 'function' && initAMOS(),
};

async function loadPage(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    document.getElementById('content_area').innerHTML = doc.body.innerHTML;

    // 모든 페이지 공통 - 알람 끄기
    document.querySelector('.status_alarm > span')
      ?.addEventListener('click', () => {
        document.querySelector('.status_alarm').style.display = 'none';
      });

    // 해당 페이지 init 함수 실행
    pageInitMap[url]?.();

  } catch (err) {
    console.error('페이지 로드 실패:', err);
  }
}

function setActiveNavItem(clickedItem) {
  document.querySelectorAll('.nav_item.active').forEach(el => el.classList.remove('active'));
  clickedItem.closest('.item_container')?.querySelector('.nav_item')?.classList.add('active');
}


/* ============================================================
   SIDEBAR
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const navMenus = document.querySelectorAll('.nav_menu');
  if (!navMenus.length) return;

  navMenus.forEach(initNavMenu);

  navMenus.forEach(menu => {
    menu.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        if (!document.querySelector('.nav_menu:hover')) closeAllSubMenus();
      });
    });
  });

  function initNavMenu(menu) {
    menu.querySelectorAll('.item_container').forEach(container => {
      const arrow = container.querySelector('.arrow_btn');
      const sub = container.querySelector('.sub_menu');
      const hasSub = !!(arrow && sub?.querySelector('.sub_item'));

      if (!arrow) return;
      if (!hasSub) { arrow.style.visibility = 'hidden'; return; }

      arrow.setAttribute('role', 'button');
      arrow.setAttribute('tabindex', '0');
      arrow.setAttribute('aria-expanded', container.classList.contains('open').toString());
    });

    menu.addEventListener('click', (e) => handleMenuClick(e, menu));
    menu.addEventListener('keydown', (e) => handleMenuKeydown(e, menu));
  }

  function handleMenuClick(e, menu) {
    const arrow = e.target.closest('.nav_item');
    const subItem = e.target.closest('.sub_item');

    if (arrow && menu.contains(arrow)) {
      const container = arrow.closest('.item_container');
      if (!hasSub(container)) return;
      e.preventDefault();
      e.stopPropagation();
      toggleSubMenu(container);
      return;
    }

    if (subItem && menu.contains(subItem)) {
      e.preventDefault();
      const url = pageMap[subItem.textContent.trim()];
      if (url) {
        loadPage(url);
        setActiveNavItem(subItem);
      }
      closeAllSubMenus();
    }
  }

  function handleMenuKeydown(e, menu) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const arrow = e.target.closest('.nav_item');
    const container = arrow?.closest('.item_container');
    if (!arrow || !menu.contains(arrow) || !container || !hasSub(container)) return;
    e.preventDefault();
    toggleSubMenu(container);
  }

  function hasSub(container) {
    return !!(container?.querySelector('.sub_menu')?.querySelector('.sub_item'));
  }

  function closeAllSubMenus() {
    document.querySelectorAll('.nav_menu .item_container.open').forEach(c => {
      c.classList.remove('open');
      c.querySelector('.nav_item')?.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleSubMenu(container) {
    const isOpen = container.classList.contains('open');
    closeAllSubMenus();
    container.classList.toggle('open', !isOpen);
    container.querySelector('.nav_item')?.setAttribute('aria-expanded', (!isOpen).toString());
  }

  // nav_item 직접 클릭 (DASHBOARD 등)
  document.querySelectorAll('.nav_item').forEach(navItem => {
    navItem.addEventListener('click', () => {
      const name = navItem.querySelector('.item_title span:last-child')?.textContent.trim();
      const url = pageMap[name];
      if (url) {
        loadPage(url);
        document.querySelectorAll('.nav_item.active').forEach(el => el.classList.remove('active'));
        navItem.classList.add('active');
      }
    });
  });

  loadPage('./page/dashboard.html');
});


