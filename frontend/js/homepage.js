// Function to check whether user is logged in and set up appropriate UI elements
function setupNavigation() {
    const navLinks = document.getElementById('nav-links');
    const authButtons = document.getElementById('auth-buttons');

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
                    <a href="profile.html">View Profile</a>
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

// Function to show login and signup buttons for logged out users
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

// Function to format date
function formatDate(dateString) {
    if (!dateString) return "Date not available";
    
    try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid date";
    }
}

// Function to format a date and time value safely
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return { date: "Date not available", time: "Time not available" };
    
    try {
        // Create a Date object
        const date = new Date(dateTimeString);
        
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        // Extract date components
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const day = date.getDate();

        // Extract time components
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Format date as YYYY-MM-DD
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Format time as HH:MM
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return { date: formattedDate, time: formattedTime };
    } catch (e) {
        console.error("Error formatting date/time:", e);
        return { date: "Invalid date", time: "Invalid time" };
    }
}

// Function to create event cards - with limit option for homepage
function createEventCards(limit = 3) {
    // console.log("Creating event cards...");
    const container = document.getElementById('eventCards');
    
    if (!container) {
        console.error("Event cards container not found");
        return;
    }
    
    // Safely get events from localStorage
    const eventsStr = localStorage.getItem('events');
    if (!eventsStr) {
        container.innerHTML = '<p>No events available</p>';
        return;
    }
    
    let events;
    try {
        events = JSON.parse(eventsStr);
        if (!Array.isArray(events) || events.length === 0) {
            container.innerHTML = '<p>No events available</p>';
            return;
        }
    } catch (e) {
        console.error('Error parsing events data:', e);
        container.innerHTML = '<p>Error loading events</p>';
        return;
    }
    
    // Safely get user data
    const userStr = localStorage.getItem('user');
    let user = { role: 'GUEST' }; // Default role if no user is logged in
    
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    container.innerHTML = ''; // Clear existing cards to prevent duplicates
    
    // Apply limit if specified (for homepage)
    const displayEvents = limit ? events.slice(0, limit) : events;
    
    displayEvents.forEach(event => {
        // Safely format date and time
        const { date: formattedDate, time: formattedTime } = formatDateTime(event.eventDateTime);
        
        const card = document.createElement('div');
        card.className = 'event-card';
        
        // Safely handle description
        const description = event.description ? event.description : "No description available";
        
        // Truncate description if too long
        const maxLength = 150;
        const truncatedDescription = description.length > maxLength ? 
            description.substring(0, maxLength) + '...' : 
            description;
        
        // Safely handle organizer details
        const organizerName = event.organizerDetails && event.organizerDetails.organizationName ? 
            event.organizerDetails.organizationName : "Unknown organizer";
        
        // Safely handle seat information
        const totalSeats = event.totalSeats ? event.totalSeats : 0;
        const remainingSeats = event.remainingSeat !== undefined ? event.remainingSeat : 0;
        const bookedSeats = totalSeats - remainingSeats;
        
        // Build action buttons based on user role
        let actionButtons = '';

        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user :", user)
        
        if (user.role === 'ORGANIZER') {
            actionButtons = `
                <a href="updateEventForm.html?id=${event.id}" class="event-btn">Update Event</a>
                <a href="#" class="event-btn delete-btn" data-id="${event.id}">Delete Event</a>
            `;
        } else {
            actionButtons = `
                <a href="eventBooking.html?id=${event.id}" class="event-btn">Book Now</a>
            `;
        }

        card.innerHTML = `
            <div class="event-content">
                <h3 class="event-title" style="text-align: center">${event.title || "Untitled Event"}</h3>
                <p class="event-description" style="text-align: center">${truncatedDescription}</p>
                <span style="display: flex; justify-content: space-between ">
                    <div class="event-date-time">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        ${formattedDate} | ${formattedTime}
                    </div>
                    <div>
                        <p> Price: ${event.price} Rs.</p>
                    </div>
                </span>
                <div class="event-info">
                    <div class="event-organizer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        </svg>
                        <span class="organizer-name">${user.organizationName != null ? user.organizationName : event.organizerDetails.organizationName}</span>
                    </div>
                    <div class="event-seats">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2h2a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1H4z"/>
                            <path fill-rule="evenodd" d="M9.5 1.5a.5.5 0 0 1 .5.5V5h-1V2a.5.5 0 0 1 .5-.5zm-3 0A1.5 1.5 0 0 0 5 3v1h1V3a.5.5 0 0 1 .5-.5h-1zM8 7a1 1 0 0 1 1 1h1a1 1 0 0 1 1 1v1h1V8a2 2 0 0 0-2-2h-1a1 1 0 0 1-1-1V4h-1v1a1 1 0 0 1-1 1H5a2 2 0 0 0-2 2v2h1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1-1zm-4 0a1 1 0 0 0-1 1H2a2 2 0 0 1 2-2zM2 12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1H2zm11-1a1 1 0 0 1 1 1h1a2 2 0 0 0-2-2v1zm1 1a1 1 0 0 0-1-1v1h1z"/>
                        </svg>
                        <span class="seats-info"><span>${bookedSeats}</span>/${totalSeats} seats</span>
                    </div>
                </div>
                ${actionButtons}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    setupDeleteButtons();
}

// Delete an event
const setupDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    console.log("Delete buttons found:", deleteButtons.length);
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const eventId = button.getAttribute('data-id');
            
            if (!eventId) {
                console.error("No event ID found for delete button");
                alert("Error: Cannot identify event to delete");
                return;
            }
            
            // Show confirmation dialog
            const isConfirmed = confirm("Are you sure you want to delete this event?");
            
            // Only proceed if user clicked "OK" (Yes)
            if (isConfirmed) {
                try {
                    console.log("Attempting to delete event with ID:", eventId);
                    
                    const response = await fetch(`http://localhost:8080/events/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        // Success - remove the event card from the DOM
                        const eventCard = button.closest('.event-card');
                        if (eventCard) {
                            eventCard.remove();
                        }
                        
                        // Also update localStorage events list if applicable
                        try {
                            const eventsStr = localStorage.getItem('events');
                            if (eventsStr) {
                                const events = JSON.parse(eventsStr);
                                const updatedEvents = events.filter(event => event.id != eventId);
                                localStorage.setItem('events', JSON.stringify(updatedEvents));
                            }
                        } catch (e) {
                            console.error("Error updating localStorage after delete:", e);
                        }
                        
                        alert("Event deleted successfully!");
                    } else {
                        const errorData = await response.json().catch(() => null);
                        console.error("Delete error response:", errorData);
                        alert(`Failed to delete event. Status: ${response.status}. ${errorData?.message || ''}`);
                    }
                } catch (error) {
                    console.error('Error deleting event:', error);
                    alert("An error occurred while trying to delete the event.");
                }
            } else {
                // User clicked "Cancel" (No)
                console.log("Event deletion cancelled");
            }
        });
    });
};

// Make functions available globally
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.setupDeleteButtons = setupDeleteButtons;

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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM content loaded, initializing...");
    const user = JSON.parse(localStorage.getItem('user'));
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
    }
    checkForLoginRedirect();
    setupNavigation();
    
    // Only try to create event cards if we're on a page that needs them
    const eventCardsContainer = document.getElementById('eventCards');
    if (eventCardsContainer) {
        createEventCards();
    }
});