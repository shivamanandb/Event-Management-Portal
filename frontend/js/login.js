document.addEventListener('DOMContentLoaded', function() {
    if(localStorage.getItem('token')){
        window.location.href = '/html/homepage.html';
        return;
    }
    document.body.style.display = 'flex';
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.innerHTML = `
            <img src="/assets/close eye.png" style="opacity: 0.6;"  height="16px" width="17px"   alt="logo" />`;
        } else {
            passwordInput.type = 'password';
            passwordToggle.innerHTML = `
                <img src="/assets/open eye.png" style="opacity: 0.8;"  height="18px" width="20px"   alt="logo" />
            `;
        }
    });
});

// Form submission
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // show loading state if desired
        const loadingBtn = form.querySelector('button[type="submit"]');
        if(loadingBtn){
            loadingBtn.disabled = true;
        }
        
        const data = await generateToken(email, password);

        // store token into localStorage
        if(data.token){
            localStorage.setItem('token', data.token);
        }

        await fetchCurrentUser(data.token);

        // handle successful login
        console.log('Login successful:', data);
        window.location.href = '/html/homepage.html';
    }
    catch(error){
        // handle errors
        console.error('Login error:', error);
        alert(`Login Failed: Invalid email or password`);
    }
    finally {
        // Re-enable button if it was disabled
        const loginButton = form.querySelector('button[type="submit"]');
        if (loginButton) loginButton.disabled = false;
    }
});

