// Github Login page validation chacker
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

// Dashboard page disgn and data loading
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

if (window.location.pathname.includes('dashboard.html')) {
    loadIssues();
}

