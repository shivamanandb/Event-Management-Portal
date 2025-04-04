const getAllBookings = async(userId) => {

    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `<div class="loader">Loading...</div>`;
    document.body.appendChild(loader);
    // Fetch bookings from backend
    const response = await fetch(`http://localhost:8080/bookings/all/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    loader.remove();
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }

    return await response.json();
}