 // Get form elements
 const form = document.getElementById('eventForm');
        
 // Initialize events in localStorage if it doesn't exist
 if (!localStorage.getItem('events')) {
     localStorage.setItem('events', JSON.stringify([]));
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
 
 // Form submission
 form.addEventListener('submit', async function(event) {
     event.preventDefault();
     
     // Validate form
     if (!validateForm()) {
         return;
     }
     
     // Get form data
     const formData = new FormData(this);
     const eventData = {};
     
     for (const [key, value] of formData.entries()) {
         if (key === 'eventStatus') {
             eventData[key] = value === 'true';
         } else if (key === 'totalSeats' || key === 'remainingSeats' || key === 'price') {
             eventData[key] = parseInt(value, 10);
         } else if (key !== 'thumbnail') {
             eventData[key] = value;
         }
     }
     
     try {
         const token = localStorage.getItem('token');
         if (!token) {
             alert('You need to be logged in to create an event');
             return;
         }

         const eventResponse = await createEvents(token, eventData);
    
         console.log('Event created :', eventResponse);
         
         // Update events in localStorage
         const events = JSON.parse(localStorage.getItem('events')) || [];
         events.push(eventResponse);
         localStorage.removeItem('events')
         localStorage.setItem('events', JSON.stringify(events));
         
         alert('Event created successfully!');
         
         // Redirect to homepage or events listing
         window.location.href = '/html/homepage.html';
         
     } catch (error) {
         console.error('Error creating event:', error);
         alert('Failed to create event: ' + error.message);
     }
 });
 
 // Set min date for event date inputs to today
 const today = new Date();
 const todayStr = new Date(today.getTime() + 6.5 * 60 * 60 * 1000).toISOString().slice(0, 16);
 console.log("today str: ", todayStr)
 document.getElementById('eventDateTime').min = todayStr;
 document.getElementById('eventEndDateTime').min = todayStr;