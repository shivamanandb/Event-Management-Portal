// Function to check whether user is logged in and set up appropriate UI elements
function setupNavigation() {
    const navLinks = document.getElementById('nav-links');
    const authButtons = document.getElementById('auth-buttons');
    const dropDown = document.querySelector('.drop-down');

    // Check if elements exist
    if (!navLinks || !authButtons) {
        console.error("Required DOM elements not found");
        return;
    }

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem('user');

    // Clear existing content
    navLinks.innerHTML = '';
    authButtons.innerHTML = '';

    // Add default navigation links
    navLinks.innerHTML = `
        <a href="homepage.html">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
    `;

    if (token && userStr) {
        try {
            const user = JSON.parse(userStr);

            // Add role-specific navigation links
            if (user.role === 'ORGANIZER') {
                navLinks.innerHTML += `
                    <a href="allEvents.html">Your Events</a>
                    <a href="eventCreationForm.html">Create Event</a>
                `;
            } else if (user.role === 'ATTENDEE') {
                navLinks.innerHTML += `
                    <a href="/html/myBookings.html">Your Bookings</a>
                    <a href="allEvents.html">Events</a>
                `;
            }

            // Add user profile dropdown
            const userProfileDiv = document.createElement('div');
            userProfileDiv.className = 'user-profile';
            userProfileDiv.innerHTML = `
                <div class="user-icon" onclick="toggleDropdown()">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="dropdown-content" id="userDropdown">
                    <a href="/html/viewAndEditProfile.html">View Profile</a>
                    <a href="#" onclick="logout()">Logout</a>
                </div>
            `;

            authButtons.appendChild(userProfileDiv);

        } catch (e) {
            console.error('Error parsing user data:', e);
            showLoginSignupButtons();
        }
    } else {
        showLoginSignupButtons();
    }
}


function showLoginSignupButtons() {
    const authButtons = document.getElementById('auth-buttons');

    if (!authButtons) {
        console.error("Auth buttons container not found");
        return;
    }

    // Create login button
    const loginBtn = document.createElement('div');
    loginBtn.className = 'log-in-btn';
    loginBtn.innerHTML = `
        <a class="log-in-btn" href="login.html">Log In</a>
    `;

    // Create signup button
    const signupBtn = document.createElement('a');
    signupBtn.href = 'registration.html';
    signupBtn.className = 'cta-button';
    signupBtn.textContent = 'Sign Up';

    // Add to auth buttons container
    authButtons.appendChild(loginBtn);
    authButtons.appendChild(signupBtn);
}


// Function to toggle the mobile menu
function toggleMobileMenu() {
    const dropDown = document.querySelector('.drop-down');
    
    if (dropDown) {
        dropDown.classList.toggle('active');
    }
}

// Function to toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.user-icon') &&
        !event.target.matches('.user-icon svg') &&
        !event.target.matches('.user-icon path') &&
        !event.target.matches('.user-icon circle')) {

        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

// Function to handle logout
function logout() {
    console.log("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
    // Force reload to ensure the page updates
    window.location.href = 'homepage.html?refresh=' + new Date().getTime();
}

// Set up menu bar click listener
const menuBar = document.getElementById('menu-bar');
if (menuBar) {
    menuBar.addEventListener('click', toggleMobileMenu);
}
   
// Make functions available globally
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.toggleMobileMenu = toggleMobileMenu;

// Check if page was redirected after login
function checkForLoginRedirect() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogin = urlParams.get('fromLogin');
    
    if (fromLogin === 'true') {
        // console.log("Page loaded after login, ensuring UI refreshes");
        // Force a full reload to clear any cached state
        window.location.href = 'homepage.html?refresh=' + new Date().getTime();
    }
}