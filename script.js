document.addEventListener('DOMContentLoaded', () => {
    const timetableBody = document.getElementById('timetableBody');
    const searchInput = document.getElementById('nameSearch');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Auth state management
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    function updateAuthState() {
        if (isLoggedIn) {
            loginOverlay.classList.add('hidden');
            logoutBtn.style.display = 'block';
            searchInput.disabled = false;
        } else {
            loginOverlay.classList.remove('hidden');
            logoutBtn.style.display = 'none';
            searchInput.disabled = true;
            searchInput.value = ''; // Clear search on logout
            renderTimetable(''); // Reset timetable
        }
    }

    // Login Handle
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === 'admin' && password === '1234') {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            updateAuthState();
            loginError.textContent = '';
            usernameInput.value = '';
            passwordInput.value = '';
        } else {
            loginError.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.';
        }
    });

    // Logout Handle
    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        updateAuthState();
    });

    // Days to iterate through
    const days = ['월', '화', '수', '목', '금'];

    // Generate a deterministic color based on the instructor's name
    function getColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Use the hash to get a HUE value (0-360)
        const h = Math.abs(hash) % 360;
        return {
            bg: `hsl(${h}, 70%, 90%)`,
            text: `hsl(${h}, 70%, 25%)`
        };
    }

    // Initial render
    function renderTimetable(searchQuery = '') {
        timetableBody.innerHTML = '';
        const trimmedQuery = searchQuery.trim();
        
        // Split query by comma or whitespace, filter out empty strings
        const queries = trimmedQuery.toLowerCase().split(/[,\s]+/).filter(q => q.length > 0);

        timetableData.forEach(row => {
            const tr = document.createElement('tr');
            
            // Period Cell
            const periodTd = document.createElement('td');
            periodTd.className = 'period-cell';
            
            // Extract "X교시" and "(Time)" from "X교시(Time)"
            const periodRaw = row.period || "";
            const match = periodRaw.match(/(.*)(\(.*\))/);
            let pNum = periodRaw;
            let pTime = "";
            if (match) {
                pNum = match[1]; // e.g. "0교시"
                pTime = match[2]; // e.g. "(08:00)"
            }
            
            periodTd.innerHTML = `<div class="p-num">${pNum}</div><div class="p-time">${pTime}</div>`;
            tr.appendChild(periodTd);

            // Add classes for row styling
            const grayPeriods = ['0교시', '2교시', '6교시', '8교시', '10교시', '12교시', '14교시'];
            if (grayPeriods.includes(pNum)) {
                tr.classList.add('gray-row');
            } else if (pNum === '4교시') {
                tr.classList.add('lunch-row');
            }

            // Day Cells
            days.forEach(day => {
                const td = document.createElement('td');
                const names = row.days[day] || [];
                
                // Only process names if there is a search query AND user is logged in
                if (isLoggedIn && queries.length > 0) {
                    // Create a wrapper for grid layout
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'cell-content';

                    names.forEach(name => {
                        const nameLower = name.toLowerCase();
                        // Check if ANY of the search terms match this name
                        const isMatch = queries.some(q => nameLower.includes(q));
                        
                        if (isMatch) {
                            const span = document.createElement('span');
                            span.className = 'name-tag active';
                            span.textContent = name;
                            
                            // Apply custom colors
                            const colors = getColor(name);
                            span.style.backgroundColor = colors.bg;
                            span.style.color = colors.text;
                            span.style.borderColor = colors.text.replace('25%', '60%');
                            
                            contentDiv.appendChild(span);
                        }
                    });
                    
                    td.appendChild(contentDiv);
                }
                
                tr.appendChild(td);
            });

            timetableBody.appendChild(tr);
        });
    }

    // Event Listener for Search
    searchInput.addEventListener('input', (e) => {
        if (!isLoggedIn) return; // Guard clause
        const value = e.target.value;
        renderTimetable(value);
    });

    // Initialize Auth state
    updateAuthState();
    
    // Initial render with empty search
    renderTimetable();
});
