document.addEventListener('DOMContentLoaded', async () => {

    // check token is available or not
    if(!localStorage.getItem('token')){
        window.location.href = '/html/login.html';
        return;
    }

    // check user role
    if(JSON.parse(localStorage.getItem('user')).role != 'ATTENDEE'){
        alert("Unauthorized Access !!.");
        window.location.href = '/html/homepage.html';
        return;
    }

    document.body.style.display = 'block';
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
        
        const bookings = await getAllBookings(user.id);

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
});

// Display bookings
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = ''; // Clear existing bookings

    if (!bookings || bookings.length === 0) {
        bookingsList.innerHTML = `
        <div class="empty-bookings">
            <h2>No Bookings Found</h2>
            <p>You haven't booked any events yet. Explore and book some exciting events!</p>
        </div>`;
        return;
    }

    bookings.forEach(booking => {

        const eventDateTime = formatDateTime(booking?.event?.eventDateTime);
        const ticketBookedDate = formatDateTime(booking.bookingDateTime);
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
            <h3>${booking?.event?.title}</h3>
            <span class="booking-status ${statusClass}">${statusText}</span>
        </div>
        <div class="booking-meta">
            <b>Event Date And Time: </b><span>${eventDateTime.date} | ${eventDateTime.time}</span>
            <div> 
                <b>Ticket Booking Date And Time: </b><span>${ticketBookedDate.date} | ${ticketBookedDate.time}</span>
            </div>
            <p><b>Location:</b> ${booking?.event?.location || 'Location TBD'}</p>
            <p><b>Tickets:</b> ${booking.numberOfBookedSeats} seat(s)</p>
            <p><b>Payment Reference ID:</b> ${booking?.myOrder?.paymentReferenceId} </p>
        </div>
        <div class="booking-actions">
            <a href="/event-details.html?id=${booking?.event?.id}" class="booking-btn view-details-btn">View Details</a>
            ${booking?.bookingStatus === true ?
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

                    const cancelledEventData = await cancelBookings(bookingId);

                    // Getting new data with updated number of seats
                    const currEventData = bookings.filter(booking => booking?.id != cancelledEventData?.id);
                    bookings.push(currEventData);

                    window.location.href = "/html/myBookings.html"
                    
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
