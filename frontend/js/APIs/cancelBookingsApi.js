async function cancelBookings(bookingId) {

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
    return await response.json();
}