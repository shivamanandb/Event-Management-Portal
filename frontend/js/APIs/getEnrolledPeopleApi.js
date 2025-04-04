async function getEnrolledPeople(eventId) {
    
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `<div class="loader">Loading...</div>`;
    document.body.appendChild(loader);
    const response = await fetch(`http://localhost:8080/events/getEnrolledPeople/${eventId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    loader.remove();

    if (!response.ok) {
        throw new Error('Failed to fetch event details');
    }

    return await response.json();
}