document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    const landing = document.getElementById('landing');
    const savedTheme = localStorage.getItem('efac-theme');
    const profileKey = 'efac-profile';
    const chatKey = 'efac-chat';

    // ---------- Small UI helpers ----------
    const toast = (message, type = 'success') => {
        let el = document.getElementById('efac-toast');
        if (!el) {
            el = document.createElement('div');
            el.id = 'efac-toast';
            Object.assign(el.style, {
                position: 'fixed', left: '50%', bottom: '92px', transform: 'translate(-50%, 12px)',
                zIndex: '2000', padding: '12px 16px', borderRadius: '12px', color: '#fff',
                fontSize: '.78rem', fontWeight: '700', opacity: '0', pointerEvents: 'none',
                transition: 'all .25s ease', maxWidth: 'min(90vw, 420px)', textAlign: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,.2)'
            });
            document.body.appendChild(el);
        }
        el.style.background = type === 'error' ? '#dc2626' : '#123b63';
        el.textContent = message;
        requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translate(-50%, 0)'; });
        clearTimeout(window.__efacToastTimer);
        window.__efacToastTimer = setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, 12px)';
        }, 2600);
    };

    const initials = name => name.trim().split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'S';

    const updateThemeIcon = () => {
        const icon = document.querySelector('.theme-toggle i');
        if (icon) icon.className = document.body.classList.contains('dark') ? 'fas fa-sun' : 'fas fa-moon';
    };

    if (savedTheme === 'dark') document.body.classList.add('dark');
    updateThemeIcon();

    // ---------- Navigation ----------
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
        updateThemeIcon();
        toast(`${dark ? 'Dark' : 'Light'} theme enabled.`);
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

    // Create a mobile navigation bar without changing the page markup.
    if (!document.querySelector('.mobile-nav')) {
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.setAttribute('aria-label', 'Mobile navigation');
        mobileNav.innerHTML = `
            <a href="#" data-section="dashboard"><i class="fas fa-grid-2"></i><span>Home</span></a>
            <a href="#" data-section="reports-section"><i class="fas fa-chart-line"></i><span>Academic</span></a>
            <a href="#" data-section="meeting-hub"><i class="fas fa-comments"></i><span>Community</span></a>
            <a href="#" data-section="profile-section"><i class="fas fa-user"></i><span>Profile</span></a>`;
        document.body.appendChild(mobileNav);
        mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', e => {
            e.preventDefault();
            showSection(link.dataset.section);
        }));
    }

    // ---------- Search ----------
    const searchInput = document.querySelector('.search-container input');
    const searchable = () => [...document.querySelectorAll('.dashboard-card,.news-card,.mv-box,.approach-item,.kpi-card,.timeline>div')];
    searchInput?.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        searchable().forEach(card => {
            const match = !query || card.textContent.toLowerCase().includes(query);
            card.style.display = match ? '' : 'none';
        });
    });
    searchInput?.addEventListener('keydown', e => {
        if (e.key === 'Escape') { searchInput.value = ''; searchInput.dispatchEvent(new Event('input')); searchInput.blur(); }
    });

    // ---------- Academic report upload ----------
    const fileInput = document.getElementById('reportUpload');
    const uploadLabel = document.getElementById('uploadLabel');
    fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        const validType = file.type === 'application/pdf' || file.type.startsWith('image/');
        const maxSize = 10 * 1024 * 1024;
        if (!validType || file.size > maxSize) {
            fileInput.value = '';
            if (uploadLabel) uploadLabel.textContent = 'Choose report card';
            toast('Use a PDF/JPG/PNG report under 10 MB.', 'error');
            return;
        }
        if (uploadLabel) uploadLabel.textContent = `${file.name} selected`;
        toast('Report selected. Ready for analysis.');
    });

    window.simulateAutoFill = function () {
        const btn = document.querySelector('.auto-fill-btn');
        if (!fileInput?.files?.length) return toast('Please select a report card first.', 'error');
        if (!btn) return;
        btn.disabled = true;
        btn.innerHTML = 'Analyzing report… <i class="fas fa-spinner fa-spin"></i>';
        setTimeout(() => {
            const ranking = document.querySelector('.ranking-pill span');
            const percentage = document.querySelector('.percentage');
            const subjects = document.querySelector('.stat-number');
            const circle = document.querySelector('.progress-circle');
            if (ranking) ranking.textContent = 'Demo: Top 5%';
            if (percentage) percentage.textContent = '88%';
            if (subjects) subjects.textContent = '8';
            if (circle) circle.style.background = 'conic-gradient(var(--orange) 317deg,#edf1f5 0deg)';
            [78, 94, 85].forEach((score, i) => {
                const bar = document.getElementById(`bar${i + 1}`);
                if (bar) bar.style.height = `${score}%`;
            });
            localStorage.setItem('efac-last-analysis', JSON.stringify({ score: 88, subjects: 8, date: Date.now() }));
            btn.disabled = false;
            btn.innerHTML = 'Analysis complete <i class="fas fa-check"></i>';
            toast('Analysis complete. Demo academic data updated.');
        }, 1100);
    };

    // ---------- Profile persistence ----------
    const profileInputs = document.querySelectorAll('#profile-section .input-group input');
    const loadProfile = () => {
        try { return JSON.parse(localStorage.getItem(profileKey) || '{}'); } catch { return {}; }
    };
    const profile = loadProfile();
    if (profile.name) document.getElementById('profile-display-name').value = profile.name;
    if (profile.school && profileInputs[1]) profileInputs[1].value = profile.school;
    if (profile.career && profileInputs[2]) profileInputs[2].value = profile.career;

    const renderProfile = data => {
        const name = data.name || 'Scholar';
        const userName = document.querySelector('.user-info strong');
        const avatar = document.querySelector('.avatar');
        const profileHeading = document.querySelector('.profile-card h2');
        const profileAvatar = document.querySelector('.profile-avatar');
        if (userName) userName.textContent = name;
        if (avatar) avatar.textContent = initials(name);
        if (profileHeading) profileHeading.textContent = name;
        if (profileAvatar) profileAvatar.textContent = initials(name);
        const meta = document.querySelectorAll('.profile-meta span');
        if (meta[0]) meta[0].innerHTML = `<i class="fas fa-school"></i> ${data.school || 'School not added'}`;
        if (meta[1]) meta[1].innerHTML = `<i class="fas fa-graduation-cap"></i> Class not added`;
        if (meta[2]) meta[2].innerHTML = `<i class="fas fa-bullseye"></i> ${data.career || 'Career goal not added'}`;
    };
    renderProfile(profile);

    window.editProfile = function () {
        const nameInput = document.getElementById('profile-display-name');
        const schoolInput = profileInputs[1];
        const careerInput = profileInputs[2];
        const name = nameInput?.value.trim() || '';
        if (!name) return toast('Please enter your name.', 'error');
        const data = { name, school: schoolInput?.value.trim() || '', career: careerInput?.value.trim() || '' };
        localStorage.setItem(profileKey, JSON.stringify(data));
        renderProfile(data);
        toast('Profile saved on this device.');
    };

    // ---------- Community chat ----------
    const readChats = () => { try { return JSON.parse(localStorage.getItem(chatKey) || '{}'); } catch { return {}; } };
    const saveChats = chats => localStorage.setItem(chatKey, JSON.stringify(chats));
    const currentChannel = () => document.querySelector('.channel.active')?.textContent.replace(/\s+/g, ' ').trim().replace(/^#\s*/, '') || 'general-scholars';

    const renderChat = channel => {
        const box = document.getElementById('chat-box');
        if (!box) return;
        const chats = readChats();
        const messages = chats[channel] || [];
        box.innerHTML = `<div class="message incoming"><div class="msg-avatar">EF</div><div class="msg-content"><span class="msg-author">EFAC</span><p>Welcome to <strong>${channel}</strong>. Be kind, curious and helpful.</p></div></div>`;
        messages.forEach(item => appendMessage(item.text, item.time, box));
        box.scrollTop = box.scrollHeight;
    };

    const appendMessage = (text, time, box) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'message outgoing';
        wrapper.innerHTML = '<div class="msg-content"><p></p><span class="msg-time"></span></div>';
        wrapper.querySelector('p').textContent = text;
        wrapper.querySelector('.msg-time').textContent = time;
        box.appendChild(wrapper);
    };

    window.switchChannel = function (element, channelName) {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        const title = document.getElementById('current-channel-name');
        if (title) title.innerHTML = `# ${channelName} <span>Community</span>`;
        const input = document.getElementById('chatInput');
        if (input) input.placeholder = `Message #${channelName}…`;
        renderChat(channelName);
    };

    window.sendMessage = function () {
        const input = document.getElementById('chatInput');
        const box = document.getElementById('chat-box');
        const message = input?.value.trim();
        if (!message || !box) return;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const channel = currentChannel();
        const chats = readChats();
        chats[channel] = [...(chats[channel] || []), { text: message, time }].slice(-50);
        saveChats(chats);
        appendMessage(message, time, box);
        input.value = '';
        box.scrollTop = box.scrollHeight;
    };
    document.getElementById('chatInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // ---------- Notifications ----------
    document.querySelector('.notifications')?.addEventListener('click', () => {
        const badge = document.querySelector('.badge');
        if (badge) badge.style.display = 'none';
        toast('You’re all caught up.');
    });

    // ---------- PWA ----------
    let deferredInstallPrompt;
    const installButton = document.createElement('button');
    installButton.className = 'efac-install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i><span>Install EFAC</span>';
    installButton.setAttribute('aria-label', 'Install EFAC');
    document.body.appendChild(installButton);
    installButton.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return toast('Installation is not available in this browser.');
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
    window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; installButton.style.display = 'none'; toast('EFAC installed successfully.'); });

    if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.warn));

    showLanding();
});
