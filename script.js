document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CORE NAVIGATION ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    window.showSection = function(sectionId) {
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('fadeIn');
        });

        const target = document.getElementById(sectionId);
        if (target) {
            target.style.display = 'block';
            target.classList.add('fadeIn');
        }

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-section');
            // The existing Me tab currently points to the profile/about experience.
            showSection(target === 'profile-section' ? 'about-section' : target);
        });
    });

    // --- 2. FAVICON + PWA SETUP ---
    const addLink = (rel, href, extra = {}) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        Object.entries(extra).forEach(([key, value]) => link.setAttribute(key, value));
        document.head.appendChild(link);
        return link;
    };

    addLink('icon', 'efac.jpg', { type: 'image/jpeg' });
    addLink('shortcut icon', 'efac.jpg', { type: 'image/jpeg' });
    addLink('apple-touch-icon', 'efac.jpg');
    addLink('manifest', 'manifest.webmanifest');

    // Register the offline service worker when served from a secure context.
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js', { scope: './' })
                .then(() => console.log('EFAC PWA service worker registered'))
                .catch((error) => console.warn('EFAC PWA registration failed:', error));
        });
    }

    // Native install prompt. Chrome/Edge/Android expose beforeinstallprompt.
    let deferredInstallPrompt = null;
    const installButton = document.createElement('button');
    installButton.type = 'button';
    installButton.className = 'efac-install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i><span>Install EFAC</span>';
    installButton.setAttribute('aria-label', 'Install EFAC as an app');
    Object.assign(installButton.style, {
        position: 'fixed',
        right: '22px',
        bottom: '22px',
        zIndex: '9999',
        display: 'none',
        alignItems: 'center',
        gap: '9px',
        border: '0',
        borderRadius: '999px',
        padding: '12px 18px',
        background: '#f39c12',
        color: '#fff',
        fontWeight: '800',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 12px 30px rgba(0,0,0,.22)'
    });
    document.body.appendChild(installButton);

    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        installButton.style.display = 'inline-flex';
    });

    installButton.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        installButton.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        installButton.style.display = 'none';
    });

    // --- 3. ACADEMIC HUB: DEMO ANALYSIS ---
    window.simulateAutoFill = function() {
        const btn = document.querySelector('.auto-fill-btn');
        const fileInput = document.getElementById('reportUpload');

        if (!fileInput.files.length) {
            alert('Please select a report card file first!');
            return;
        }

        btn.innerText = 'Processing PDF...';
        btn.disabled = true;

        setTimeout(() => {
            document.querySelector('.ranking-pill span').innerText = 'Top 5%';
            document.querySelector('.percentage').innerText = '88%';
            document.querySelector('.stat-number').innerText = '8';

            const scores = [78, 94, 85];
            document.getElementById('bar1').style.height = scores[0] + '%';
            document.getElementById('bar2').style.height = scores[1] + '%';
            document.getElementById('bar3').style.height = scores[2] + '%';

            btn.innerText = 'Data Synced!';
            btn.style.background = '#27ae60';
        }, 1800);
    };

    // --- 4. PROFILE MANAGEMENT ---
    window.editProfile = function() {
        const nameElement = document.querySelector('.profile-card h2');
        if (!nameElement) return;
        const currentName = nameElement.innerText;
        const newName = prompt('Enter your full name:', currentName);

        if (newName && newName.trim() !== '') {
            nameElement.innerText = newName;
            const sidebarUser = document.querySelector('.user-info h4');
            if (sidebarUser) sidebarUser.innerText = newName;
            alert('Profile updated successfully!');
        }
    };

    // --- 5. NEWS & ANNOUNCEMENTS ---
    window.filterNews = function(category) {
        const newsItems = document.querySelectorAll('.news-card');
        newsItems.forEach(item => {
            if (category === 'all') {
                item.style.display = 'flex';
            } else {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(category) ? 'flex' : 'none';
            }
        });
    };

    // --- 6. MEETING HUB: CHAT & CHANNELS ---
    window.switchChannel = function(element, channelName) {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        const channelTitle = document.getElementById('current-channel-name');
        if (channelTitle) channelTitle.innerText = `# ${channelName}`;

        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML = `<div class="message incoming">
                <div class="msg-avatar">EFAC</div>
                <div class="msg-content">
                    <span class="msg-author">System</span>
                    <p>Welcome to the <strong>${channelName}</strong> channel. Stay professional and helpful!</p>
                </div>
            </div>`;
        }
    };

    window.sendMessage = function() {
        const input = document.getElementById('chatInput');
        const chatBox = document.getElementById('chat-box');
        if (!input || !chatBox || input.value.trim() === '') return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageHTML = `<div class="message outgoing">
            <div class="msg-content">
                <p>${input.value}</p>
                <span class="msg-time">${time}</span>
            </div>
        </div>`;
        chatBox.innerHTML += messageHTML;
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- 7. SIDEBAR REQUESTS ---
    window.handleRequest = function(id, status) {
        const req = document.getElementById(id);
        if (!req) return;
        req.innerHTML = `<span style="color: var(--accent-orange); font-size: 12px;">Request ${status}ed</span>`;
        setTimeout(() => {
            req.style.opacity = '0';
            setTimeout(() => req.remove(), 500);
        }, 1500);
    };

    window.showSection('about-section');
});
