// Variables to store event data
let currentEvent = null;

// Function to get event ID from URL parameters
function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to fetch event details
async function fetchEventDetails() {
    const eventId = getEventIdFromUrl();
    
    if (!eventId) {
        alert('Error: No event ID provided');
        window.location.href = 'allEvents.html';
        return;
    }
    
    try {
        // First check localStorage for events
        const eventsStr = localStorage.getItem('events');
        if (eventsStr) {
            const events = JSON.parse(eventsStr);
            currentEvent = events.find(event => event.id === eventId);
            
            if (currentEvent) {
                populateForm(currentEvent);
                return;
            }
        }
        
        // If not found in localStorage, try to fetch from API
        // This would be your actual API call if you're using a backend
        // const response = await fetch(`/api/events/${eventId}`);
        // if (!response.ok) throw new Error('Failed to fetch event');
        // currentEvent = await response.json();
        // populateForm(currentEvent);
        
        // If we reach here and currentEvent is still null, we couldn't find the event
        if (!currentEvent) {
            alert('Error: Event not found');
            window.location.href = 'allEvents.html';
        }
    } catch (error) {
        console.error('Error fetching event details:', error);
        alert('An error occurred while fetching event details');
    }
}

// Function to populate form with event details
function populateForm(event) {
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDescription').value = event.description;
    
    // Parse the event date and time
    const eventDate = new Date(event.eventDateTime);
    
    // Format date as YYYY-MM-DD for the date input
    const formattedDate = eventDate.toISOString().split('T')[0];
    document.getElementById('eventDate').value = formattedDate;
    
    // Format time as HH:MM for the time input
    const hours = eventDate.getHours().toString().padStart(2, '0');
    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
    document.getElementById('eventTime').value = `${hours}:${minutes}`;
    
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventThumbnail').value = event.thumbnail;
    document.getElementById('eventCategory').value = event.category;
    document.getElementById('eventCapacity').value = event.totalSeats;
    document.getElementById('eventPrice').value = event.ticketPrice;
    document.getElementById('eventId').value = event.id;
}

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const updatedEvent = {
        id: formData.get('id'),
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        thumbnail: formData.get('thumbnail'),
        category: formData.get('category'),
        totalSeats: parseInt(formData.get('totalSeats')),
        ticketPrice: parseFloat(formData.get('ticketPrice')),
        // Combine date and time
        eventDateTime: new Date(`${formData.get('eventDate')}T${formData.get('eventTime')}:00`).toISOString()
    };
    
    try {
        // Calculate the remaining seats
        // Preserve the original remaining seats ratio
        const remainingRatio = currentEvent.remainingSeat / currentEvent.totalSeats;
        updatedEvent.remainingSeat = Math.round(updatedEvent.totalSeats * remainingRatio);
        
        // Preserve organizer details
        updatedEvent.organizerDetails = currentEvent.organizerDetails;
        
        // First, update the event in localStorage
        const eventsStr = localStorage.getItem('events');
        if (eventsStr) {
            const events = JSON.parse(eventsStr);
            const eventIndex = events.findIndex(e => e.id === updatedEvent.id);
            
            if (eventIndex !== -1) {
                events[eventIndex] = { ...events[eventIndex], ...updatedEvent };
                localStorage.setItem('events', JSON.stringify(events));
                
                alert('Event updated successfully!');
                window.location.href = 'allEvents.html';
                return;
            }
        }
        
        // If you have an API, this would be your API call
        // const response = await fetch(`/api/events/${updatedEvent.id}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${localStorage.getItem('token')}`
        //     },
        //     body: JSON.stringify(updatedEvent)
        // });
        
        // if (!response.ok) throw new Error('Failed to update event');
        
        // alert('Event updated successfully!');
        // window.location.href = 'allEvents.html';
        
        // If we reach here, we couldn't update the event
        alert('Error: Could not update event');
    } catch (error) {
        console.error('Error updating event:', error);
        alert('An error occurred while updating the event');
    }
}

// Function to handle cancel button
function handleCancel() {
    window.location.href = 'allEvents.html';
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation
    if (typeof setupNavigation === 'function') {
        setupNavigation();
    }
    
    // Fetch event details to populate the form
    fetchEventDetails();
    
    // Add event listeners
    document.getElementById('updateEventForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancelButton').addEventListener('click', handleCancel);
});