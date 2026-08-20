document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const landing = document.getElementById('landing');
    const savedTheme = localStorage.getItem('efac-theme');

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
        document.querySelectorAll('.mobile-nav a').forEach(link => link.classList.remove('active'));
        const mobileMap = { dashboard: 0, 'reports-section': 1, 'meeting-hub': 2, 'profile-section': 3 };
        const mobileIndex = mobileMap[sectionId];
        if (mobileIndex !== undefined) document.querySelectorAll('.mobile-nav a')[mobileIndex]?.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navItems.forEach(item => item.addEventListener('click', e => {
        e.preventDefault();
        showSection(item.dataset.section);
    }));

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
