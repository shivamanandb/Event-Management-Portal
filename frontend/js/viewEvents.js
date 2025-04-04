// DOM Elements
const eventName = document.getElementById('eventName');
const eventCategory = document.getElementById('eventCategory');
const eventDescription = document.getElementById('eventDescription');
const eventStartTime = document.getElementById('eventStartTime');
const eventEndTime = document.getElementById('eventEndTime');
const eventLocation = document.getElementById('eventLocation');
const eventPrice = document.getElementById('eventPrice');
const eventOrganizer = document.getElementById('eventOrganizer');
const registerBtn = document.getElementById('eventBtn');

// Function to populate the display with event data
function populateEventData(eventData) {

    const startDateTime = formatDateTime(eventData.eventDateTime);
    const endDateTime = formatDateTime(eventData.eventEndDateTime);
    eventName.textContent = eventData.title;
    eventCategory.textContent = eventData.category;
    eventDescription.textContent = eventData.description;
    eventStartTime.textContent = `${startDateTime.date} | ${startDateTime.time}`
    eventEndTime.textContent = `${endDateTime.date} | ${endDateTime.time}`
    eventLocation.textContent = eventData.location;
    eventPrice.textContent = eventData.price;
    eventOrganizer.textContent = eventData?.organizerDetails?.organizationName;
}

// Register button click handler
registerBtn.addEventListener('click', () => {
    window.location.href = '/html/allEvents.html';
});

// Load event data when page loads
document.addEventListener('DOMContentLoaded', async() => {
    
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
        window.location.href = '/html/login.html';
        return;
    }
    document.body.style.display = 'block';
    
    // Getting eventId from parameter
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const eventData = await getEvent(eventId);
    console.log("eventData: ", eventData)
    setupNavigation();
    populateEventData(eventData);
});