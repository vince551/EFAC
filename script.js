document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CORE NAVIGATION SYSTEM ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    /**
     * Handles switching between different dashboard sections (Home, Reports, Chat, etc.)
     *
     */
    window.showSection = function(sectionId) {
        // Hide all sections and remove animation classes
        sections.forEach(section => {
            section.style.display = 'none';
            section.classList.remove('fadeIn');
        });

        // Show the targeted section
        const target = document.getElementById(sectionId);
        if (target) {
            target.style.display = 'block';
            target.classList.add('fadeIn');
        }

        // Update the Sidebar UI to show which link is active
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    };

    // Attach click events to all sidebar navigation links
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });


    // --- 2. ACADEMIC HUB (REPORT ANALYSIS SIMULATION) ---
    /**
     * Simulates the AI analysis of an uploaded report card.
     * Updates the Global Rank, Mean Score, and Performance Graph.
     *
     */
    window.simulateAutoFill = function() {
        const btn = document.querySelector('.auto-fill-btn');
        const fileInput = document.getElementById('reportUpload');
        
        // Basic check if a file is selected before running analysis
        if (!fileInput.files.length) {
            alert("Please select a report card file first!");
            return;
        }

        btn.innerText = "Analyzing Data...";
        btn.disabled = true;

        // Simulate processing time
        setTimeout(() => {
            // Update the Global Rank pill
            document.querySelector('.ranking-pill span').innerText = "Top 5%";
            
            // Update the Mean Score progress circle and subject count
            document.querySelector('.percentage').innerText = "88%";
            document.querySelector('.stat-number').innerText = "8"; 
            
            // Animate the Visual Performance Tracking bars
            const scores = [75, 92, 88]; 
            document.getElementById('bar1').style.height = scores[0] + "%";
            document.getElementById('bar2').style.height = scores[1] + "%";
            document.getElementById('bar3').style.height = scores[2] + "%";

            btn.innerText = "Analysis Complete!";
            btn.style.background = "#27ae60"; // Change button to green on success
        }, 2000);
    };


    // --- 3. MEETING HUB (CHAT & CHANNELS) ---
    /**
     * Switches the active chat channel and updates the header.
     *
     */
    window.switchChannel = function(element, channelName) {
        // Update Sidebar channel selection UI
        document.querySelectorAll('.channel').forEach(c => c.classList.remove('active'));
        element.classList.add('active');

        // Update the chat header to reflect the current channel
        document.getElementById('current-channel-name').innerText = `# ${channelName}`;
        
        // Clear chat area and show a "Joined" notification
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = `<div class="message incoming">
            <div class="msg-avatar">EFAC</div>
            <div class="msg-content">
                <span class="msg-author">System</span>
                <p>You have joined the <strong>${channelName}</strong> channel.</p>
            </div>
        </div>`;
    };

    /**
     * Processes and displays messages sent by the user.
     *
     */
    window.sendMessage = function() {
        const input = document.getElementById('chatInput');
        const chatBox = document.getElementById('chat-box');
        
        if (input.value.trim() !== "") {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Create the message bubble HTML
            const messageHTML = `
                <div class="message outgoing">
                    <div class="msg-content">
                        <p>${input.value}</p>
                        <span class="msg-time" style="font-size:0.6rem; opacity:0.7;">${time}</span>
                    </div>
                </div>
            `;
            
            chatBox.innerHTML += messageHTML;
            input.value = ""; // Clear the input field
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message
        }
    };

    // Enable "Enter" key to send messages
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });


    // --- 4. CONNECT REQUESTS ---
    /**
     * Handles Accept/Deny actions for mentorship or scholar requests.
     *
     */
    window.handleRequest = function(id, status) {
        const req = document.getElementById(id);
        req.innerHTML = `<span style="color: var(--accent-orange); font-weight:bold;">${status}</span>`;
        // Briefly show the status before removing the notification
        setTimeout(() => req.style.display = 'none', 1500);
    };
});
