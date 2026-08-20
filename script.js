document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    window.showSection = function(sectionId) {
        sections.forEach(section => section.style.display = 'none');
        const target = document.getElementById(sectionId);
        if (target) target.style.display = 'block';
        navItems.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
        document.querySelectorAll('.mobile-nav a').forEach(link => link.classList.remove('active'));
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

    window.simulateAutoFill = function() {
        const btn = document.querySelector('.auto-fill-btn');
        if (!fileInput?.files?.length) return alert('Please select a report card first.');
        btn.disabled = true;
        btn.textContent = 'Analyzing report…';
        setTimeout(() => {
            document.querySelector('.ranking-pill span').textContent = 'Top 5%';
            document.querySelector('.percentage').textContent = '88%';
            document.querySelector('.stat-number').textContent = '8';
            [78, 94, 85].forEach((score, i) => document.getElementById(`bar${i + 1}`).style.height = `${score}%`);
            btn.disabled = false;
            btn.textContent = 'Analysis complete';
            btn.style.background = 'linear-gradient(135deg,#16a34a,#22c55e)';
        }, 1500);
    };

    window.editProfile = function() {
        const input = document.getElementById('profile-display-name');
        if (!input) return;
        const name = input.value.trim();
        if (!name) return alert('Please enter your name.');
        document.querySelector('.user-info strong').textContent = name;
        document.querySelector('.avatar').textContent = name.charAt(0).toUpperCase();
        alert('Profile updated successfully.');
    };

    window.switchChannel = function(element, channelName) {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        document.getElementById('current-channel-name').textContent = `# ${channelName}`;
        document.getElementById('chat-box').innerHTML = `<div class="message incoming"><div class="msg-content"><span class="msg-author">EFAC</span><p>Welcome to <strong>${channelName}</strong>.</p></div></div>`;
    };

    window.sendMessage = function() {
        const input = document.getElementById('chatInput');
        const box = document.getElementById('chat-box');
        const message = input?.value.trim();
        if (!message) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'message outgoing';
        wrapper.innerHTML = `<div class="msg-content"><p></p><span class="msg-time"></span></div>`;
        wrapper.querySelector('p').textContent = message;
        wrapper.querySelector('.msg-time').textContent = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
        box.appendChild(wrapper);
        input.value = '';
        box.scrollTop = box.scrollHeight;
    };

    document.getElementById('chatInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    let deferredInstallPrompt;
    const installButton = document.createElement('button');
    installButton.className = 'efac-install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i><span>Install EFAC</span>';
    installButton.setAttribute('aria-label','Install EFAC');
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

    showSection('dashboard');
});
