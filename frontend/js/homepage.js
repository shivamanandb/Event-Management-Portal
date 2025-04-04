    
// Function to create event cards - with limit option for homepage
function createEventCards(events, limit = 3) {
    // console.log("Creating event cards...");
    const container = document.getElementById('eventCards');
    
    if (!container) {
        console.error("Event cards container not found");
        return;
    }
    
    // Safely get events from localStorage
    if (!events) {
        container.innerHTML = '<p>No events available</p>';
        return;
    }

    try {

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
        const maxLength = 85;
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

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM content loaded, initializing...");
    const token = localStorage.getItem('token');
    const response = await fetchEvents(token);
    setupNavigation();
    
    // Only try to create event cards if we're on a page that needs them
    const eventCardsContainer = document.getElementById('eventCards');
    if (eventCardsContainer) {
        createEventCards(response);
    }
});