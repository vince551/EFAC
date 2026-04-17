document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    // Navigation switching logic
    function showSection(id) {
        sections.forEach(s => s.style.display = 'none');
        const target = document.getElementById(id);
        if (target) target.style.display = 'block';
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Make showSection global so dashboard cards can use it
    window.showSection = showSection;

    // --- REPORT AUTOMATION LOGIC ---
    const scholarGrades = [90, 85, 82, 78, 75, 70, 65, 60]; // Simulated db

    window.simulateAutoFill = function() {
        const file = document.getElementById('reportUpload').files[0];
        const btn = document.querySelector('.auto-fill-btn');
        
        if (!file) {
            alert("Please select a report card image first!");
            return;
        }

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
        
        setTimeout(() => {
            const extractedGrade = 84; // Simulated AI result
            
            // Calculate Ranking
            const allGrades = [...scholarGrades, extractedGrade].sort((a,b) => b-a);
            const rank = allGrades.indexOf(extractedGrade) + 1;

            // Update UI
            document.querySelector('.ranking-pill span').innerText = `#${rank}`;
            document.querySelector('.percentage').innerText = extractedGrade + '%';
            document.querySelector('.stat-number').innerText = '12';
            
            // Animate Graph
            document.getElementById('bar1').style.height = '60%';
            document.getElementById('bar2').style.height = '75%';
            document.getElementById('bar3').style.height = extractedGrade + '%';

            alert(`AI Extraction Success!\nMean Grade: ${extractedGrade}%\nGlobal Rank: #${rank}`);
            btn.innerHTML = 'Data Synchronized';
            btn.style.background = '#27ae60';
        }, 2000);
    };
});