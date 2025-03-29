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
                    <a href="myBookings.html">Your Bookings</a>
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
        <div class="log-in-icon"></div>
        <a href="login.html">Log In</a>
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
    window.location.href = 'homepage.html';
}

// Function to format ISO date string to readable format
function formatDateTime(isoString) {
    if (!isoString || isoString === '5555-05-05T05:55:00') {
        return { date: 'Date TBD', time: 'Time TBD' };
    }

    try {
        const date = new Date(isoString);

        // Format date: "Month Day, Year"
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', dateOptions);

        // Format time: "H:MM AM/PM"
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return { date: formattedDate, time: formattedTime };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { date: 'Invalid Date', time: 'Invalid Time' };
    }
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
                                console.log("events : ", events)
                                const updatedEvents = events.filter(event => event.id != eventId);
                                console.log("updated Events : ", updatedEvents)
                                localStorage.removeItem('events')
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

// Function to populate category filter options
function populateCategoryFilter(events) {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set();

    // Extract all unique categories
    events.forEach(event => {
        if (event.category) {
            categories.add(event.category);
        }
    });

    // Add each category as an option
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to create event cards based on current filter
function displayFilteredEvents(events, selectedCategory = '') {
    const allEventCardsContainer = document.getElementById('allEventCards');
    allEventCardsContainer.innerHTML = ''; // Clear existing cards

    // Filter events if a category is selected
    const filteredEvents = selectedCategory
        ? events.filter(event => event.category === selectedCategory)
        : events;

    // If no events match the filter, show a message
    if (filteredEvents.length === 0) {
        allEventCardsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No events found matching the selected filter.</p>';
        return;
    }

    // Get user role
    const userStr = localStorage.getItem('user');
    let userRole = '';

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            userRole = user.role;
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }

    // Create event cards for filtered events
    filteredEvents.forEach(event => {
        // Format start date and time
        const startDateTime = formatDateTime(event.eventDateTime);

        // Create image path or use a default
        const imagePath = event.image || `/assets/events/event${Math.floor(Math.random() * 5) + 1}.jpg`;

        // Safely handle seat information
        const totalSeats = event.totalSeats ? event.totalSeats : 0;
        const remainingSeats = event.remainingSeat !== undefined ? event.remainingSeat : 0;
        const bookedSeats = totalSeats - remainingSeats;

        // Build action buttons based on user role
        let actionButtonsHTML = '';

        if (userRole === 'ORGANIZER') {
            actionButtonsHTML = `
        <div class="event-actions">
            <a href="updateEventForm.html?id=${event.id}" class="event-btn update-btn">Update Event</a>
            <a href="#" class="event-btn delete-btn" data-id="${event.id}">Delete Event</a>
        </div>
    `;
        } else {
            // Check if there are remaining seats
            if (remainingSeats <= 0) {
                // Disable button if no seats remaining
                actionButtonsHTML = `
            <div class="event-actions">
                <a href="#" class="event-btn book-btn" style="background-color: #cccccc; cursor: not-allowed; pointer-events: none;">Sold Out</a>
            </div>
        `;
            } else {
                actionButtonsHTML = `
            <div class="event-actions">
                <a href="eventBooking.html?id=${event.id}" class="event-btn book-btn">Book Now</a>
            </div>
        `;
            }
        }

        // Create category badge if category exists
        const categoryBadge = event.category
            ? `<span class="category-badge">${event.category}</span>`
            : '';

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
    
    <div class="event-details">
        ${categoryBadge}
        <h3>${event.title}</h3>
        <p class="event-date">${startDateTime.date} | ${startDateTime.time}</p>
        <p class="event-location">${event.location || 'Location TBD'}</p>
        <p>Seats: ${bookedSeats}/${totalSeats}</p>
        ${JSON.parse(localStorage.getItem('user')).role === 'ORGANIZER' ? `<a href="viewEnrolledPeople.html?id=${event.id}" class="event-link">View Enrolled People</a>` : ''}
        ${actionButtonsHTML}
    </div>
`;

        allEventCardsContainer.appendChild(card);
    });

    // Set up delete functionality if applicable
    setupDeleteButtons();
}

document.addEventListener('DOMContentLoaded', async function () {
    // Initialize navigation
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
        console.log("data :", data)
        
        // Store events as JSON string
        if(data){
            localStorage.setItem('events', JSON.stringify(data));
        }
    }
    setupNavigation();

    // Retrieve all events from localStorage
    const allEvents = JSON.parse(localStorage.getItem('events')) || [];


    // Populate the category filter
    populateCategoryFilter(allEvents);

    // Display all events initially
    displayFilteredEvents(allEvents);

    // Set up category filter event listener
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', function () {
        displayFilteredEvents(allEvents, this.value);
    });

    // Set up reset filter button
    const resetFilterBtn = document.getElementById('resetFilter');
    resetFilterBtn.addEventListener('click', function () {
        categoryFilter.value = '';
        displayFilteredEvents(allEvents);
    });
});

// Make functions available globally
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.setupDeleteButtons = setupDeleteButtons;