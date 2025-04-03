const getAllBookings = async(userId) => {

    // Fetch bookings from backend
    const response = await fetch(`http://localhost:8080/bookings/all/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }

    return await response.json();
}