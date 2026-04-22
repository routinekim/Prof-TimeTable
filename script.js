document.addEventListener('DOMContentLoaded', () => {
    const timetableBody = document.getElementById('timetableBody');
    const searchInput = document.getElementById('nameSearch');

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
            // Vertical layout: X교시 <br> (Time)
            periodTd.innerHTML = `<div class="p-num">${row.period}교시</div><div class="p-time">(${row.time})</div>`;
            tr.appendChild(periodTd);

            // Day Cells
            days.forEach(day => {
                const td = document.createElement('td');
                const names = row.days[day] || [];
                
                // Only process names if there is a search query
                if (queries.length > 0) {
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
        const value = e.target.value;
        renderTimetable(value);
    });

    // Initial render with empty search
    renderTimetable();
});
