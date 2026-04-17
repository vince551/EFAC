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
            showSection(item.getAttribute('data-section'));
        });
    });

    // --- 2. ACADEMIC HUB: AI ANALYSIS ---
    window.simulateAutoFill = function() {
        const btn = document.querySelector('.auto-fill-btn');
        const fileInput = document.getElementById('reportUpload');
        
        if (!fileInput.files.length) {
            alert("Please select a report card file first!");
            return;
        }

        btn.innerText = "Processing PDF...";
        btn.disabled = true;

        setTimeout(() => {
            // Update Stats
            document.querySelector('.ranking-pill span').innerText = "Top 5%";
            document.querySelector('.percentage').innerText = "88%";
            document.querySelector('.stat-number').innerText = "8"; 
            
            // Animate Performance Graph
            const scores = [78, 94, 85]; 
            document.getElementById('bar1').style.height = scores[0] + "%";
            document.getElementById('bar2').style.height = scores[1] + "%";
            document.getElementById('bar3').style.height = scores[2] + "%";

            btn.innerText = "Data Synced!";
            btn.style.background = "#27ae60";
        }, 1800);
    };

    // --- 3. PROFILE MANAGEMENT (NEW) ---
    window.editProfile = function() {
        const nameElement = document.querySelector('.profile-card h2');
        const currentName = nameElement.innerText;
        const newName = prompt("Enter your full name:", currentName);
        
        if (newName && newName.trim() !== "") {
            nameElement.innerText = newName;
            // Update sidebar name if applicable
            const sidebarUser = document.querySelector('.user-info h4');
            if (sidebarUser) sidebarUser.innerText = newName;
            alert("Profile updated successfully!");
        }
    };

    // --- 4. NEWS & ANNOUNCEMENTS (NEW) ---
    window.filterNews = function(category) {
        const newsItems = document.querySelectorAll('.news-card');
        newsItems.forEach(item => {
            if (category === 'all') {
                item.style.display = 'flex';
            } else {
                // Check if the card contains the category text
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(category) ? 'flex' : 'none';
            }
        });
    };

    // --- 5. MEETING HUB: CHAT & CHANNELS ---
    window.switchChannel = function(element, channelName) {
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');
        document.getElementById('current-channel-name').innerText = `# ${channelName}`;
        
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = `<div class="message incoming">
            <div class="msg-avatar">EFAC</div>
            <div class="msg-content">
                <span class="msg-author">System</span>
                <p>Welcome to the <strong>${channelName}</strong> channel. Stay professional and helpful!</p>
            </div>
        </div>`;
    };

    window.sendMessage = function() {
        const input = document.getElementById('chatInput');
        const chatBox = document.getElementById('chat-box');
        
        if (input.value.trim() !== "") {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageHTML = `
                <div class="message outgoing">
                    <div class="msg-content">
                        <p>${input.value}</p>
                        <span class="msg-time">${time}</span>
                    </div>
                </div>`;
            chatBox.innerHTML += messageHTML;
            input.value = "";
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    };

    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- 6. SIDEBAR REQUESTS ---
    window.handleRequest = function(id, status) {
        const req = document.getElementById(id);
        req.innerHTML = `<span style="color: var(--accent-orange); font-size: 12px;">Request ${status}ed</span>`;
        setTimeout(() => {
            req.style.opacity = '0';
            setTimeout(() => req.remove(), 500);
        }, 1500);
    };
});
