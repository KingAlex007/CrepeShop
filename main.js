console.log("JS wurde geladen!");

// Mobile menu toggle
document.getElementById('mobile-menu-button')?.addEventListener('click', function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Owner login
document.getElementById('owner-login-btn')?.addEventListener('click', function () {
    const username = document.getElementById('owner-username').value;
    const password = document.getElementById('owner-password').value;

    if (username === 'owner' && password === 'crepes2023') {
        document.getElementById('owner-login').classList.add('hidden');
        document.getElementById('owner-dashboard').classList.remove('hidden');
        initializeCharts();
    } else {
        alert('Invalid owner credentials');
    }
});

// Owner logout
document.getElementById('owner-logout')?.addEventListener('click', function () {
    document.getElementById('owner-login').classList.remove('hidden');
    document.getElementById('owner-dashboard').classList.add('hidden');
    document.getElementById('owner-username').value = '';
    document.getElementById('owner-password').value = '';
});

// Charts
function initializeCharts() {
    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [320, 450, 380, 490, 520, 680, 550],
                    borderColor: 'rgba(245, 158, 11, 1)',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const popularCtx = document.getElementById('popularCrepesChart')?.getContext('2d');
    if (popularCtx) {
        new Chart(popularCtx, {
            type: 'bar',
            data: {
                labels: ['Classic Sugar', 'Nutella Dream', 'Berry Blast', 'Banana Split', 'Custom'],
                datasets: [{
                    label: 'Orders this week',
                    data: [42, 38, 24, 31, 18],
                    backgroundColor: [
                        'rgba(245, 158, 11, 0.7)',
                        'rgba(210, 118, 31, 0.7)',
                        'rgba(180, 83, 9, 0.7)',
                        'rgba(146, 64, 14, 0.7)',
                        'rgba(120, 53, 15, 0.7)'
                    ],
                    borderColor: [
                        'rgba(245, 158, 11, 1)',
                        'rgba(210, 118, 31, 1)',
                        'rgba(180, 83, 9, 1)',
                        'rgba(146, 64, 14, 1)',
                        'rgba(120, 53, 15, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
