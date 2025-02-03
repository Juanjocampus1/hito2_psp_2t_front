function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const address = document.getElementById('register-address').value;
            
            const data = {
                name: name,
                email: email,
                phone: phone,
                address: address
            };

            fetch('http://localhost:8081/api/customer/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = 'login.html';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const phone = document.getElementById('login-phone').value;

            fetch('http://localhost:8081/api/customer/findAll')
            .then(response => response.json())
            .then(data => {
                const user = data.find(user => user.email === email && user.phone === phone);
                console.log('User:', user);
                if (user) {
                    setCookie('userId', user.id, 7); // Set cookie for 7 days
                    console.log('Cookie set:', document.cookie);
                    window.location.href = 'index.html';
                } else {
                    alert('Invalid email or phone');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});