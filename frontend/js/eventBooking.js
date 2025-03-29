// Get eventId from params
function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    return eventId;
}

function formatDateTime(isoString) {
    if (!isoString || isoString === '5555-05-05T05:55:00') {
        return { date: 'Date TBD', time: 'Time TBD' };
    }

    try {
        const date = new Date(isoString);

        // Format date: "Month Day, Year"
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', dateOptions);

        // Format time: "H:MM AM/PM"
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-IN', timeOptions);

        return { date: formattedDate, time: formattedTime };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { date: 'Invalid Date', time: 'Invalid Time' };
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const quantityDisplay = document.getElementById('quantity');
    const title = document.getElementById('title');
    const dateTime = document.getElementById('dateTime');
    const organizer = document.getElementById('organizer');
    const remainingSeat = document.getElementById('seats-remaining');
    const ticketPrice = document.getElementById('ticket-price');
    const checkoutBtn = document.getElementById('rzp-button1');

    const eventId = getEventId();
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const event = events.find(e => e.id == eventId);

    if (!event) {
        console.error("Event not found!");
        return;
    }

    let quantity = 1;
    const maxSeats = 8;

    const e_dateTime = formatDateTime(event.eventDateTime);

    title.textContent = event.title;
    dateTime.innerHTML = `<p style="color: #1a150b">Event Date: ${e_dateTime.date} | ${e_dateTime.time}</p>`;
    organizer.innerHTML = `<h3 style="color: #15616d">Organizer Name: ${event.organizerDetails.organizationName}</h3>`;
    remainingSeat.textContent = `${event.remainingSeat} ${event.remainingSeat == 1 ? 'seat' : 'seats'} remaining`;
    ticketPrice.textContent = `Each Ticket Price: ${event.price} Rs.`;

    decreaseBtn.addEventListener('click', function () {
        if (quantity > 1) {
            quantity--;
            updateQuantity();
        }
    });

    increaseBtn.addEventListener('click', function () {
        if (quantity < maxSeats && quantity < event.remainingSeat) {
            quantity++;
            updateQuantity();
        }
    });

    function updateQuantity() {
        quantityDisplay.textContent = quantity;
    }

    // Check if no seats are remaining and disable the checkout button
    if (event.remainingSeat === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.backgroundColor = "#cccccc";
        checkoutBtn.style.cursor = "not-allowed";
    }

    checkoutBtn.addEventListener('click', async () => {
        const quantityValue = parseInt(document.getElementById('quantity').textContent);
        let amount = event.price * quantityValue;

        if (!amount) {
            alert('Amount is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to continue');
                // Redirect to login page
                window.location.href = 'login.html';
                return;
            }

            // Create order request
            const response = await fetch('http://localhost:8080/user/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: amount,
                    info: 'order_request'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate order ID');
            }

            const data = await response.json();

            if (data.status === "created") {
                // Open payment form
                let options = {
                    key: 'rzp_test_V8mM0kjKmdKKSA',
                    amount: data.amount,
                    currency: 'INR',
                    name: 'EventHub',
                    description: 'Event Management Platform',
                    order_id: data.id,
                    handler: function (response) {
                        updatePaymentOnServer(
                            response.razorpay_payment_id,
                            response.razorpay_order_id,
                            'paid',
                            quantityValue,
                            eventId
                        );
                    },
                    prefill: {
                        name: "",
                        email: "",
                        contact: ""
                    },
                    notes: {
                        address: "Event Management Platform"
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };

                var rzp1 = new Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    console.error('Payment failed:', response.error);
                    alert('Payment failed: ' + response.error.description);
                });

                rzp1.open();
            }
        } catch (error) {
            console.error('Error generating order ID:', error);
            alert('Error processing payment. Please try again.');
        }
    });
});

async function updatePaymentOnServer(paymentReferanceId, bookingOrderId, bookingStatus, quantityValue, eventId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Session expired. Please log in again.');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const orderData = {
        paymentReferanceId: paymentReferanceId,
        bookingOrderId: bookingOrderId,
        bookingStatus: bookingStatus,
        quantityValue: quantityValue,
        eventId: eventId
    };

    try {
        // Update order status
        const orderResponse = await fetch('http://localhost:8080/user/update-order', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
            throw new Error("Failed to update order");
        }

        const eventData = await orderResponse.json();

        // Update local storage with updated event data
        const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
        const updatedEvents = allEvents.filter(event => event.id != eventData.id);
        updatedEvents.push(eventData);
        localStorage.setItem('events', JSON.stringify(updatedEvents));

        // Create booking
        const bookingData = {
            userId: user.id,
            eventId: eventId,
            numberOfBookedSeats: quantityValue
        };

        const bookingResponse = await fetch(`http://localhost:8080/bookings/create-booking/${paymentReferanceId}`, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        if (!bookingResponse.ok) {
            throw new Error("Failed to create booking");
        }

        // Update UI to reflect changes
        document.getElementById('seats-remaining').textContent =
            `${eventData.remainingSeat} ${eventData.remainingSeat == 1 ? 'seat' : 'seats'} remaining`;

        alert('Payment successful! Your booking has been confirmed.');

        const eventDetailsData = {
            userId: JSON.parse(localStorage.getItem("user")).id,
            eventId: JSON.parse(getEventId())
        }
        const eventDetailResposne = await fetch('http://localhost:8080/eventDetails/save-event', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(eventDetailsData)
        })

        if (!eventDetailResposne.ok) {
            throw new Error("Failed to update event Details");
        }

        const eventDetailData = await eventDetailResposne.json();

        console.log("Event Details response: ", eventDetailResposne)

        // Optionally redirect to bookings page
        window.location.href = 'myBookings.html';

    } catch (error) {
        console.log(error);
        console.error("Error updating payment details:", error);
        alert('Payment was successful, but there was an issue finalizing your booking. Please contact support.');
    }
}