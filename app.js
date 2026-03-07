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