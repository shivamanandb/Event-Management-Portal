async function createEvents(token, eventData) {

    const response = await fetch('http://localhost:8080/events/create-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create event');
    }

    return await response.json()
}