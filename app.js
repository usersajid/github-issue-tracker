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
        filterIssues('all');
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
const filterIssues = (status) => {
    const buttons = ['all', 'open', 'closed'];
    buttons.forEach(btnId => {
        const btnElement = document.getElementById(`btn-${btnId}`);
        
        if (btnElement) {
            if (btnId === status) {
                btnElement.className = "px-5 py-1.5 rounded-md bg-[#5C33FF] text-white text-sm font-medium shadow-sm transition";
            } else {
                btnElement.className = "px-5 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition";
            }
        }
    });

    if (status === 'all') {
        displayIssues(allIssues);
    } else {
        const filtered = allIssues.filter(issue => issue.status === status);
        displayIssues(filtered);
    }
}

const handleSearch = async () => {
    const searchInput = document.getElementById('search-input');
    const searchText = searchInput ? searchInput.value.trim() : '';
    if (!searchText) {
        displayIssues(allIssues);
        return;
    }
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const data = await res.json();
        displayIssues(data.data);
        
    } catch (error) {
        console.error("Search error:", error);
    }
}

const openModal = async (id) => {
    try {
        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await res.json();
        const issue = data.data;

        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modal-content');

        if (modal && modalContent) {
            modalContent.innerHTML = `
                <h2 class="text-2xl font-bold text-gray-900 mb-4">${issue.title}</h2>
                
                <div class="flex flex-wrap items-center gap-3 mb-6">
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${issue.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}">
                        ${issue.status}
                    </span>
                    <span class="text-sm text-gray-500 italic">
                        Opened by <b>${issue.author}</b> on ${new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div class="flex gap-2 mb-6">
                    ${issue.labels.map(label => `<span class="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded font-bold uppercase">${label}</span>`).join('')}
                </div>

                <p class="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">${issue.description}</p>

                <div class="bg-gray-50 p-6 rounded-xl grid grid-cols-2 gap-6 border border-gray-100">
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Assignee</p>
                        <p class="font-bold text-gray-800">${issue.assignee || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-widest">Priority</p>
                        <p class="font-bold uppercase ${issue.priority === 'high' ? 'text-red-600' : 'text-orange-600'}">${issue.priority}</p>
                    </div>
                </div>
            `;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    } catch (err) {
        console.error("Modal data load failed:", err);
    }
}

const closeModal = () => {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

if (window.location.pathname.includes('dashboard.html')) {
    loadIssues();
}