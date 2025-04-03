async function updateEventForm(eventDataId, eventData) {
    
    // Send update request to server
    const response = await fetch(`http://localhost:8080/events/update/${eventDataId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update event');
    }
    
    // Show success message and redirect
    alert('Event updated successfully!');
}