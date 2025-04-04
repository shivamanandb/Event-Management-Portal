async function getEvent(eventId) {
    
    const response = await fetch(`http://localhost:8080/events/${eventId}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error('event not found');
    }

    return await response.json();
}