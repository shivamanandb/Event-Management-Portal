document.addEventListener('DOMContentLoaded', async () => {
    // Setup navigation first
    setupNavigation();

    // Fetch user data and bookings
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Redirect to login if no user is found
        window.location.href = 'homepage.html';
        return;
    }

    try {
        // Fetch bookings from backend
        const response = await fetch(`http://localhost:8080/bookings/all/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const bookings = await response.json();
        console.log("Bookingdss:: ", bookings) 

        // Display bookings
        displayBookings(bookings);

        // Setup cancel booking functionality
        setupCancelBookingButtons(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = `
    <div class="empty-bookings">
        <h2>Error Loading Bookings</h2>
        <p>Unable to retrieve your bookings. Please try again later.</p>
    </div>
`;
    }

    // // Setup additional event listeners
    // setupEventListeners();
});

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
/**
* Converts a LocalDateTime to an ISO 8601 formatted string
* @param {LocalDateTime} localDateTime - The LocalDateTime to convert
* @returns {string} ISO 8601 formatted string
*/
function localDateTimeToISOString(localDateTime) {
    // Ensure the input is a valid LocalDateTime object
    if (!(localDateTime instanceof Date)) {
        throw new Error('Input must be a Date object');
    }

    // Convert to ISO string 
    // toISOString() converts to UTC, so we'll use a custom method to preserve local time
    const year = localDateTime.getFullYear();
    const month = String(localDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(localDateTime.getDate()).padStart(2, '0');
    const hours = String(localDateTime.getHours()).padStart(2, '0');
    const minutes = String(localDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(localDateTime.getSeconds()).padStart(2, '0');
    const milliseconds = String(localDateTime.getMilliseconds()).padStart(3, '0');

    // Format: YYYY-MM-DDTHH:mm:ss.sssZ
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

// Format date and time
function formatDateTime(isoString) {
    if (!isoString) {
        return { date: 'Date', time: 'Time' };
    }

    try {
        const date = new Date(isoString);
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

        return {
            date: date.toLocaleDateString('en-US', dateOptions),
            time: date.toLocaleTimeString('en-US', timeOptions)
        };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { date: 'Invalid Date', time: 'Invalid Time' };
    }
}

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = ''; // Clear existing bookings

    if (!bookings || bookings.length === 0) {
        bookingsList.innerHTML = `
    <div class="empty-bookings">
        <h2>No Bookings Found</h2>
        <p>You haven't booked any events yet. Explore and book some exciting events!</p>
    </div>
`;
        return;
    }

    bookings.forEach(booking => {
        const event = JSON.parse(localStorage.getItem('events')).find(event => event.id == booking.eventId)

        console.log("event:", event)
        const eventDateTime = formatDateTime(event.eventDateTime);
        const ticketBookedDate = formatDateTime(booking.bookingDateTime)
        const imagePath = '';


        // Determine status color and text
        let statusClass = '';
        let statusText = '';
        switch (booking.bookingStatus) {
            case true:
                statusClass = 'status-confirmed';
                statusText = 'Confirmed';
                break;
            case false:
                statusClass = 'status-cancelled';
                statusText = 'Cancelled';
                break;
            default:
                statusClass = 'status-pending';
                statusText = 'Unknown';
        }

        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
    
    <div class="booking-details">
        <div class="booking-header">
            <h3>${event.title}</h3>
            <span class="booking-status ${statusClass}">${statusText}</span>
        </div>
        <div class="booking-meta">
            <b>Event Date And Time: </b><span>${eventDateTime.date} | ${eventDateTime.time}</span>
            <div> 
                <b>Ticket Booking Date And Time: </b><span>${ticketBookedDate.date} | ${ticketBookedDate.time}</span>
            </div>
            <p>Location: ${event.location || 'Location TBD'}</p>
            <p>Tickets: ${booking.numberOfBookedSeats} seat(s)</p>
        </div>
        <div class="booking-actions">
            <a href="/event-details.html?id=${event.id}" class="booking-btn view-details-btn">View Details</a>
            ${booking.bookingStatus === true ?
                `<a href="#" class="booking-btn cancel-booking-btn" data-id="${booking.id}">Cancel Booking</a>`
                : ''
            }
        </div>
    </div>
`;

        bookingsList.appendChild(bookingCard);
    });
}

function setupCancelBookingButtons(bookings) {
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const bookingId = button.getAttribute('data-id');

            // Use a more modern confirmation dialog
            const confirmCancel = confirm("Are you sure you want to cancel this booking? This action cannot be undone.");

            if (confirmCancel) {
                try {
                    // Disable the button immediately and permanently
                    button.disabled = true;
                    button.textContent = 'Cancelling...';
                    button.style.opacity = '0.5';
                    button.classList.add('disabled');

                    // Send cancel booking request to backend
                    const response = await fetch(`http://localhost:8080/bookings/cancel/${bookingId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!response.ok) {
                        // Throw an error with more context
                        const errorBody = await response.text();
                        throw new Error(`Failed to cancel booking: ${errorBody}`);
                    }
                    const cancelledEventData = await response.json();
                    console.log("cancelled event data : ", cancelledEventData)

                    // update remaining seat into localStorage
                    let eventData = JSON.parse(localStorage.getItem('events'));
                    const currEventData = eventData.find((e)=> e.id == cancelledEventData.eventId)
                    console.log("Current Event Data : ", currEventData);
                    console.log("Cancelled Event Data : ", cancelledEventData);
                    currEventData.remainingSeat += cancelledEventData.numberOfBookedSeats;
                    localStorage.removeItem('events')
                    eventData = eventData.filter((e) => e.id != cancelledEventData.eventId)
                    eventData.push(currEventData)
                    localStorage.setItem('events', JSON.stringify(eventData))

                    // Refetch bookings to ensure most up-to-date data
                    const user = JSON.parse(localStorage.getItem('user'));
                    const refreshResponse = await fetch(`http://localhost:8080/bookings/all/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    if (!refreshResponse.ok) {
                        throw new Error('Failed to refresh bookings after cancellation');
                    }

                    const updatedBookings = await refreshResponse.json();
                    console.log("updated bookings: ", updatedBookings)

                    // Display updated bookings
                    displayBookings(updatedBookings);

                } catch (error) {
                    console.error('Error cancelling booking:', error);

                    // Re-enable the button if there's an error
                    button.disabled = false;
                    button.textContent = 'Cancel Booking';
                    button.style.opacity = '1';
                    button.classList.remove('disabled');
                }
            }
        });
    });
}
