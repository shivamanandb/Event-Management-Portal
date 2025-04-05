// Function to get eventId
function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    return eventId;
}

// Function to populate form with event data
function populateForm(event) {
    document.getElementById('eventId').value = event.id;
    document.getElementById('title').value = event.title;
    document.getElementById('category').value = event.category;
    document.getElementById('description').value = event.description;
    document.getElementById('eventDateTime').value = event.eventDateTime;
    document.getElementById('eventEndDateTime').value = event.eventEndDateTime;
    document.getElementById('location').value = event.location;
    document.getElementById('ticket-price').value = event.price;
    document.getElementById('totalSeats').value = event.totalSeats;
    document.getElementById('remainingSeats').value = event.remainingSeat;
    document.getElementById('eventStatus').value = event.eventStatus.toString();
}

// Form validation function
function validateForm() {
    const startTime = new Date(document.getElementById('eventDateTime').value);
    const endTime = new Date(document.getElementById('eventEndDateTime').value);
    const totalSeats = parseInt(document.getElementById('totalSeats').value);
    const remainingSeats = parseInt(document.getElementById('remainingSeats').value);
    
    if (endTime <= startTime) {
        alert('End time must be after start time');
        return false;
    }
    
    if (remainingSeats > totalSeats) {
        alert('Remaining seats cannot be greater than total seats');
        return false;
    }
    
    return true;
}

// Load event data when page loads
document.addEventListener('DOMContentLoaded', async function() {

    // check if token present or not
    if(!localStorage.getItem('token')){
        window.location.href = '/html/login.html';
        return;
    }

    // check user role
    if(JSON.parse(localStorage.getItem('user')).role != 'ORGANIZER'){
        alert("You are not authorized to update an event.");
        window.location.href = '/html/homepage.html';
        return;
    }

    document.body.style.display = 'block';

    const eventId = getEventId();
    console.log("Event id: ", eventId)
    
    if (!eventId) {
        alert('No event ID provided');
        return;
    }
    
    // Get event data from localStorage
    const eventData = await getEvent(eventId);

    if (eventData && eventData.id == eventId) {
        populateForm(eventData);
    } else {
        // In a real application, you would fetch the event data from the server
        alert('Event data not found');
    }
    
    // Set min date for event date inputs to today
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 16);
    document.getElementById('eventDateTime').min = todayStr;
    document.getElementById('eventEndDateTime').min = todayStr;
});

// Form submission
document.getElementById('eventForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(this);

    const eventData = {
        id: formData.get('eventId')
    };
    
    for (const [key, value] of formData.entries()) {
        if (key === 'eventId') continue; // Already added
        
        if (key === 'eventStatus') {
            eventData[key] = value === 'true';
        } else if (key === 'totalSeats' || key === 'remainingSeats' || key === 'price') {
            eventData[key] = parseInt(value, 10);
        } else {
            eventData[key] = value;
        }
    }
    
    try {
        // Get the authentication token
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('You need to be logged in to update an event');
            return;
        }
        
        console.log('Updating event with data:', eventData);
        
        const response = await updateEventForm(eventData.id, eventData);
        
        window.location.href = 'homepage.html';
        
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event: ' + error.message);
    }
});