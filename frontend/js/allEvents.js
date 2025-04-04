
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

        // Safely handle seat information
        const totalSeats = event.totalSeats ? event.totalSeats : 0;
        const remainingSeats = event.remainingSeat !== undefined ? event.remainingSeat : 0;
        const bookedSeats = totalSeats - remainingSeats;    
        const today = new Date();
        const todayStr = new Date(today.getTime() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 16);
        
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
            }
            else if (todayStr >= event.eventDateTime) {
                actionButtonsHTML = `
            <div class="event-actions">
                <a href="#" class="event-btn book-btn" style="background-color: #cccccc; cursor: not-allowed; pointer-events: none;">Booking Over</a>
            </div>`
            }
            else {
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
        <div class="card">
            <p class="event-date">${startDateTime.date} | ${startDateTime.time}</p>
            <div>
                <p> Price: <span style="color: red">${event.price} Rs.</span> </p>
            </div>
            ${JSON.parse(userStr).role == 'ATTENDEE' ? `<p>Organizer - ${event?.organizerDetails?.organizationName}</p>` : ''}
            <div class="seat-location">
                <p class="event-location">${event.location || 'Location TBD'}</p>
                <p>Seats: ${bookedSeats}/${totalSeats}</p>
            </div>
        </div>
        ${JSON.parse(localStorage.getItem('user')).role === 'ORGANIZER' ? `<a href="viewEnrolledPeople.html?id=${event.id}" class="event-link">View Enrolled People</a>` : `<a href="viewEvents.html?id=${event.id}" class="event-link">View Event Details</a>`}
        ${actionButtonsHTML}
    </div>
`;

        allEventCardsContainer.appendChild(card);
    });

    // Set up delete functionality
    setupDeleteButtons();
}

document.addEventListener('DOMContentLoaded', async function () {

    // Check if user is logged in
    if (!localStorage.getItem('token')) {
        window.location.href = '/html/login.html';
        return;
    }
    document.body.style.display = 'block';

    // Initialize navigation
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    allEvents = await fetchEvents(token);
    console.log("allEvents: ", allEvents)

    setupNavigation();

    // Heading should be different for Attendee and Organizer
    const heading = document.getElementById('heading');
    
    heading.innerHTML = `${user.role == 'ATTENDEE'? 'All Events' : 'Your Events'}`

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