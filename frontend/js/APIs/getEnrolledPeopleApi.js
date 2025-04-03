async function getEnrolledPeople(eventId) {
    
    const response = await fetch(`http://localhost:8080/events/getEnrolledPeople/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch event details');
    }

    return await response.json();
}