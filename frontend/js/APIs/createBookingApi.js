async function createBookings(paymentReferanceId, bookingData) {
    
    const bookingResponse = await fetch(`http://localhost:8080/bookings/create-booking/${paymentReferanceId}`, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
    });

    if (!bookingResponse.ok) {
        throw new Error("Failed to create booking");
    }

    return await bookingResponse.json();

}