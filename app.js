// Github Login page validation checker
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const userField = document.getElementById('username').value;
    const passField = document.getElementById('password').value;

    if (userField === 'admin' && passField === 'admin123') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Please enter valid credentials');
    }
});

// Dashboard page logic
let allIssues = []; 
const loadIssues = async () => {
    try {
        const res = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await res.json();
        allIssues = data.data; 
        displayIssues(allIssues); 
    } catch (err) {
        console.error("Data load failed:", err);
    }
}

const displayIssues = (issues) => {
    const issueContainer = document.getElementById('issue-container');
    const issueCount = document.getElementById('issue-count');
    
    if (issueCount) issueCount.innerText = issues.length;
    if (!issueContainer) return;

    issueContainer.innerHTML = ""; 

    issues.forEach(issue => {
        const card = document.createElement('div');
        
        const statusIcon = issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed-Status.png';
        const borderColor = issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500';
        
        card.className = `bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 ${borderColor} transition-all hover:shadow-md relative`;
        
        card.innerHTML = `
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                    <img src="${statusIcon}" alt="${issue.status}" class="w-4 h-4">
                    <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#${issue.id} • ${issue.author}</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${issue.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}">${issue.priority}</span>
            </div>

            <h3 onclick="openModal(${issue.id})" class="text-base font-bold text-gray-900 mb-2 cursor-pointer hover:text-[#5C33FF] transition">${issue.title}</h3>
            
            <p class="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">${issue.description}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
                ${issue.labels.map(label => `
                    <span class="bg-yellow-100 text-yellow-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border border-yellow-200">
                        ${label}
                    </span>
                `).join('')}
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-50 text-[10px] text-gray-400">
                <p>Assignee: <span class="font-bold text-gray-700">${issue.assignee || 'Unassigned'}</span></p>
                <p>Updated: ${new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>
        `;
        issueContainer.appendChild(card);
    });
}

if (window.location.pathname.includes('dashboard.html')) {
    loadIssues();
}