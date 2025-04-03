const createCards = (event) => {

    // Format start date and time
    const startDateTime = formatDateTime(event.eventDateTime);
    // Create image path or use a default
    // const imagePath = event.image || `/assets/events/event${Math.floor(Math.random() * 5) + 1}.jpg`;

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
        ${JSON.parse(localStorage.getItem('user')).role === 'ORGANIZER' ? `<a href="viewEnrolledPeople.html?id=${event.id}" class="event-link">View Enrolled People</a>` : ''}
        ${actionButtonsHTML}
    </div>
`;

    allEventCardsContainer.appendChild(card);
}
