// Get eventId from params
function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    return eventId;
}

document.addEventListener('DOMContentLoaded', async function () {

    // check token available or not
    if(!localStorage.getItem('token')){
        window.location.href = '/html/login.html';
        return;
    }

    // check the user is ATTENDEE or not 
    if(JSON.parse(localStorage.getItem('user')).role != 'ATTENDEE'){
        alert("You are not authorized to book an event.");
        window.location.href = '/html/homepage.html';
        return;
    }

    document.body.style.display = 'block';

    const decreaseBtn = document.getElementById('decrease-btn');
    const increaseBtn = document.getElementById('increase-btn');
    const quantityDisplay = document.getElementById('quantity');
    const title = document.getElementById('title');
    const dateTime = document.getElementById('dateTime');
    const organizer = document.getElementById('organizer');
    const remainingSeat = document.getElementById('seats-remaining');
    const ticketPrice = document.getElementById('ticket-price');
    const checkoutBtn = document.getElementById('rzp-button1');
    const token = localStorage.getItem('token');

    const eventId = getEventId();
    const events = await fetchEvents(token);
    const event = events.find(e => e.id == eventId);

    const keyId = await paymentKeyResponse();   

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

    // check if event start date and time is eqaul to the current date and time
    const today = new Date();
    const todayStr = new Date(today.getTime()+5.5*60*60*1000).toISOString().slice(0, 16)
    if(todayStr >= event.eventDateTime){
        checkoutBtn.disabled = true;
        checkoutBtn.style.backgroundColor = "#cccccc";
        checkoutBtn.style.cursor = "not allowed";
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
            const data = await createOrderApi(amount, token)

            if (data.status === "created") {

                // Open payment form
                let options = {
                    key: keyId,
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
        const eventData = await updateOrder(orderData);

        // Create booking
        const bookingData = {
            userId: user.id,
            eventId: eventId,
            numberOfBookedSeats: quantityValue
        };

        const bookingResponse = await createBookings(paymentReferanceId, bookingData);
        // Update UI to reflect changes
        document.getElementById('seats-remaining').textContent =
            `${eventData.remainingSeat} ${eventData.remainingSeat == 1 ? 'seat' : 'seats'} remaining`;

        alert('Payment successful! Your booking has been confirmed.');

        // Optionally redirect to bookings page
        window.location.href = 'myBookings.html';

    } catch (error) {
        console.log(error);
        console.error("Error updating payment details:", error);
        alert('Payment was successful, but there was an issue finalizing your booking. Please contact support.');
    }
}