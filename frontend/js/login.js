document.addEventListener('DOMContentLoaded', function() {
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

        const response = await fetch('http://localhost:8080/generate-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if(!response.ok){
            // handle HTTP errors
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login Failed');
        }
        
        const data = await response.json();

        // store token into localStorage
        if(data.token){
            localStorage.setItem('token', data.token);
        }

        await fetchCurrentUser(data.token);
            
        await fetchEvents(data.token);

        // handle successful login
        console.log('Login successful:', data);
        window.location.href = '/html/homepage.html';
    }
    catch(error){
        // handle errors
        console.error('Login error:', error);
        alert(`Login Failed: ${error.message}`);
    }
    finally {
        // Re-enable button if it was disabled
        const loginButton = form.querySelector('button[type="submit"]');
        if (loginButton) loginButton.disabled = false;
    }
});

const fetchCurrentUser = async(token) => {
    try {
        const response = await fetch('http://localhost:8080/current-user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get current User');
        }
        
        const data = await response.json();
        console.log("User data:", data);
        localStorage.setItem('user', JSON.stringify(data));
    } catch(error){
        console.error('Error while saving user details:', error);
    }
}

const fetchEvents = async(token) => {
    try {
        // Get and parse user data from localStorage
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
            console.error('User data not found in localStorage');
            return;
        }
        
        const user = JSON.parse(userStr);
        console.log("User:", user);
        
        // Only fetch events if user is an ATTENDEE
        if(user && user.role == 'ATTENDEE') {
            const response = await fetch('http://localhost:8080/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Event could not fetch');
            }
            
            const data = await response.json();
            
            // Store events as JSON string
            if(data){
                localStorage.setItem('events', JSON.stringify(data));
            }
        } else if(user && user.role == 'ORGANIZER') {
            const response = await fetch(`http://localhost:8080/events/organizer/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Event could not fetch');
            }
            
            const data = await response.json();
            
            // Store events as JSON string
            if(data){
                localStorage.setItem('events', JSON.stringify(data));
            }
        }
    } catch(error) {
        console.error('Could not fetch events:', error);
    }
}

// Commented function left for future implementation
const fetchEventsByCategory = async(token, category) => {
    try {
        const response = await fetch(`http://localhost:8080/events/category/${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch events by category');
        }
        
        const data = await response.json();
        console.log("Events by category:", data);
        return data;
    } catch(error) {
        console.error('Error fetching events by category:', error);
        throw error;
    }
}