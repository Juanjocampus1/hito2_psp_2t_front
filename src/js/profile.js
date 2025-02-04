function getCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(row => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
}

document.addEventListener('DOMContentLoaded', function() {
    const userId = getCookie('userId');
    console.log('User ID from cookie:', userId);
    if (!userId) {
        alert('User not logged in');
        window.location.href = 'login.html';
        return;
    }

    fetch(`http://localhost:8081/api/customer/find/${userId}`)
    
        .then(response => response.json())
        .then(user => {
            
            document.getElementById('name').textContent = `Name: ${user.name}`;
            document.getElementById('email').textContent = `Email: ${user.email}`;
            document.getElementById('address').textContent = `Address: ${user.address}`;
            document.getElementById('phone').textContent = `Phone: ${user.phone}`;
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            alert('User not logged in');
            window.location.href = 'login.html';
            return;
        });
});
