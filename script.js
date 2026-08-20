document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const landing = document.getElementById('landing');
    const savedTheme = localStorage.getItem('efac-theme');

    // Replace the fixed sidebar with a compact premium dashboard dropdown.
    const uiStyle = document.createElement('style');
    uiStyle.textContent = `
      .sidebar{display:none!important}
      .main-content{margin-left:0!important;width:100%!important}
      .top-bar{padding:0 28px!important}
      .top-dashboard{position:relative;margin-right:auto;display:flex;align-items:center}
      .dashboard-trigger{display:flex;align-items:center;gap:10px;padding:10px 14px;border:1px solid var(--line);border-radius:14px;background:var(--card);color:var(--ink);font-weight:800;cursor:pointer;box-shadow:0 6px 20px rgba(8,28,48,.05);transition:var(--ease)}
      .dashboard-trigger:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(8,28,48,.09)}
      .dashboard-trigger .trigger-logo{width:28px;height:28px;border-radius:8px;object-fit:cover}
      .dashboard-trigger .chevron{font-size:.7rem;color:var(--muted);transition:transform .2s ease}
      .top-dashboard.open .chevron{transform:rotate(180deg)}
      .dashboard-menu{position:absolute;top:54px;left:0;width:250px;padding:8px;background:var(--card);border:1px solid var(--line);border-radius:18px;box-shadow:0 22px 55px rgba(8,28,48,.16);opacity:0;visibility:hidden;transform:translateY(-7px);transition:var(--ease);z-index:1200}
      .top-dashboard.open .dashboard-menu{opacity:1;visibility:visible;transform:none}
      .dashboard-menu-label{padding:9px 11px 6px;color:var(--muted);font-size:.65rem;font-weight:800;text-transform:uppercase;letter-spacing:.12em}
      .dashboard-menu a{display:flex;align-items:center;gap:11px;padding:11px;border-radius:11px;color:var(--ink);text-decoration:none;font-size:.82rem;font-weight:700;cursor:pointer}
      .dashboard-menu a:hover,.dashboard-menu a.active{background:rgba(245,158,11,.1);color:#9a5a00}
      .dashboard-menu a i{width:19px;text-align:center;color:var(--orange)}
      .dashboard-menu .menu-divider{height:1px;background:var(--line);margin:6px 4px}
      .dashboard-menu .exit{color:#9b3c3c}
      .dashboard-menu .exit i{color:#c85a5a}
      .mobile-nav{display:none!important}
      @media(max-width:760px){.top-bar{padding:0 15px!important}.search-container{display:none!important}.top-dashboard{margin-right:0}.dashboard-trigger{padding:8px 10px}.dashboard-menu{width:235px}.user-info strong{display:none}.top-bar{height:70px}}
    `;
    document.head.appendChild(uiStyle);

    const topBar = document.querySelector('.top-bar');
    const dashboard = document.createElement('div');
    dashboard.className = 'top-dashboard';
    dashboard.innerHTML = `
      <button class="dashboard-trigger" aria-expanded="false" aria-haspopup="true">
        <img src="efac.jpg" class="trigger-logo" alt="EFAC">
        <span>Dashboard</span>
        <i class="fas fa-chevron-down chevron"></i>
      </button>
      <div class="dashboard-menu" role="menu">
        <div class="dashboard-menu-label">Workspace</div>
        <a data-section="dashboard" class="active"><i class="fas fa-grid-2"></i> Overview</a>
        <a data-section="profile-section"><i class="fas fa-user-graduate"></i> My Profile</a>
        <a data-section="reports-section"><i class="fas fa-chart-line"></i> Academic Hub</a>
        <a data-section="meeting-hub"><i class="fas fa-comments"></i> Community</a>
        <a data-section="news-section"><i class="fas fa-bullhorn"></i> News</a>
        <a data-section="about-section"><i class="fas fa-circle-info"></i> About EFAC</a>
        <div class="menu-divider"></div>
        <a class="exit" id="dropdown-exit"><i class="fas fa-arrow-right-from-bracket"></i> Exit platform</a>
      </div>`;
    if (topBar) topBar.prepend(dashboard);

    const trigger = dashboard.querySelector('.dashboard-trigger');
    const menuLinks = dashboard.querySelectorAll('.dashboard-menu a[data-section]');
    trigger?.addEventListener('click', e => {
        e.stopPropagation();
        const open = dashboard.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
        if (!dashboard.contains(e.target)) {
            dashboard.classList.remove('open');
            trigger?.setAttribute('aria-expanded', 'false');
        }
    });

    if (savedTheme === 'dark') document.body.classList.add('dark');

    window.enterPlatform = function () {
        if (landing) landing.style.display = 'none';
        showSection('dashboard');
    };

    window.showLanding = function () {
        sections.forEach(section => section.style.display = 'none');
        if (landing) {
            landing.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    window.toggleTheme = function () {
        document.body.classList.toggle('dark');
        const dark = document.body.classList.contains('dark');
        localStorage.setItem('efac-theme', dark ? 'dark' : 'light');
        const icon = document.querySelector('.theme-toggle i');
        if (icon) icon.className = dark ? 'fas fa-sun' : 'fas fa-moon';
    };

    window.showSection = function (sectionId) {
        if (landing) landing.style.display = 'none';
        sections.forEach(section => section.style.display = 'none');
        const target = document.getElementById(sectionId);
        if (target) {
            target.style.display = 'block';
            target.classList.remove('content-section');
            void target.offsetWidth;
            target.classList.add('content-section');
        }
        navItems.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
        menuLinks.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
        const label = dashboard.querySelector('.dashboard-trigger span');
        const active = [...menuLinks].find(item => item.dataset.section === sectionId);
        if (label && active) label.textContent = active.textContent.trim();
        dashboard.classList.remove('open');
        trigger?.setAttribute('aria-expanded', 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navItems.forEach(item => item.addEventListener('click', e => {
        e.preventDefault();
        showSection(item.dataset.section);
    }));
    menuLinks.forEach(item => item.addEventListener('click', e => {
        e.preventDefault();
        showSection(item.dataset.section);
    }));
    dashboard.querySelector('#dropdown-exit')?.addEventListener('click', showLanding);

    const fileInput = document.getElementById('reportUpload');
    const uploadLabel = document.getElementById('uploadLabel');
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file && uploadLabel) uploadLabel.textContent = `${file.name} selected`;
    });

    window.simulateAutoFill = function () {
        const btn = document.querySelector('.auto-fill-btn');
        if (!fileInput?.files?.length) return alert('Please select a report card first.');
        btn.disabled = true;
        btn.textContent = 'Analyzing report…';
        setTimeout(() => {
            document.querySelector('.ranking-pill span').textContent = 'Demo: Top 5%';
            document.querySelector('.percentage').textContent = '88%';
            document.querySelector('.stat-number').textContent = '8';
            document.querySelector('.progress-circle').style.background = 'conic-gradient(var(--orange) 317deg,#edf1f5 0deg)';
            [78, 94, 85].forEach((score, i) => document.getElementById(`bar${i + 1}`).style.height = `${score}%`);
            btn.disabled = false;
            btn.innerHTML = 'Analysis complete <i class="fas fa-check"></i>';
        }, 1500);
    };

    window.editProfile = function () {
        const input = document.getElementById('profile-display-name');
        if (!input) return;
        const name = input.value.trim();
        if (!name) return alert('Please enter your name.');
        document.querySelector('.user-info strong').textContent = name;
        document.querySelector('.avatar').textContent = name.charAt(0).toUpperCase();
        const profileHeading = document.querySelector('.profile-card h2');
        if (profileHeading) profileHeading.textContent = name;
        alert('Profile updated successfully.');
    };

    window.switchChannel = function (element, channelName) {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        document.getElementById('current-channel-name').innerHTML = `# ${channelName} <span>3 members</span>`;
        const box = document.getElementById('chat-box');
        if (box) box.innerHTML = `<div class="message incoming"><div class="msg-avatar">EF</div><div class="msg-content"><span class="msg-author">EFAC</span><p>Welcome to <strong>${channelName}</strong>.</p></div></div>`;
        const input = document.getElementById('chatInput');
        if (input) input.placeholder = `Message #${channelName}…`;
    };

    window.sendMessage = function () {
        const input = document.getElementById('chatInput');
        const box = document.getElementById('chat-box');
        const message = input?.value.trim();
        if (!message || !box) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'message outgoing';
        wrapper.innerHTML = '<div class="msg-content"><p></p><span class="msg-time"></span></div>';
        wrapper.querySelector('p').textContent = message;
        wrapper.querySelector('.msg-time').textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        box.appendChild(wrapper);
        input.value = '';
        box.scrollTop = box.scrollHeight;
    };

    document.getElementById('chatInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    let deferredInstallPrompt;
    const installButton = document.createElement('button');
    installButton.className = 'efac-install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i><span>Install EFAC</span>';
    installButton.setAttribute('aria-label', 'Install EFAC');
    document.body.appendChild(installButton);
    installButton.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        installButton.style.display = 'none';
    });
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.style.display = 'flex';
    });
    window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; installButton.style.display = 'none'; });

    if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));

    showLanding();
});
