let enrolledPeople = []; // Global variable to store enrolled people data

function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    return eventId;
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventId = getEventId();
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/eventDetails/get-events/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }

        enrolledPeople = await response.json();
        console.log("Enrolled People Data: ", enrolledPeople);

        // Initial table render
        renderTable(enrolledPeople);
    } catch (error) {
        console.error('Error fetching enrolled people:', error);
        alert('Failed to load enrolled people. Please try again later.');
    }
});

// Function to format a date and time value safely
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return { date: "Date not available", time: "Time not available" };
    
    try {
        // Create a Date object
        const date = new Date(dateTimeString);
        
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date");
        }

        // Extract date components
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() returns 0-11, so add 1
        const day = date.getDate();

        // Extract time components
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Format date as YYYY-MM-DD
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        // Format time as HH:MM
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return { date: formattedDate, time: formattedTime };
    } catch (e) {
        console.error("Error formatting date/time:", e);
        return { date: "Invalid date", time: "Invalid time" };
    }
}

// Function to render the table
function renderTable(data) {
    const tableBody = document.getElementById('peopleTableBody');
    tableBody.innerHTML = ''; // Clear existing rows
    console.log("data: ", data)

    data.forEach(person => {
        const row = document.createElement('tr');

        // Determine status class and booked tickets
        let statusClass = person.bookingStatus === true ? "color: green" : "color: red";
        const numberOfTickets = person.numberOfBookedSeats || 1; // Default to 1 if not specified
        const {date: formattedDate, time: formattedTime} = formatDateTime(person.eventDateTime)
        row.innerHTML = `
                    <td>${person.name}</td>
                    <td>${person.phone}</td>
                    <td style="${statusClass}">${person.bookingStatus === true ? 'Booked' : 'Cancelled'}</td>
                    <td>${person.paymentReferenceId}</td>
                    <td>${formattedDate} | ${formattedTime}</td>
                    <td>${numberOfTickets}</td>
                `;

        tableBody.appendChild(row);
    });
}

// Function to filter table data
function filterTable() {
    const nameFilter = document.getElementById('nameFilter').value.toLowerCase();
    const eventFilter = document.getElementById('eventFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredData = enrolledPeople.filter(person => {
        const nameMatch = person.name.toLowerCase().includes(nameFilter);
        const eventMatch = !eventFilter || person.eventName.toLowerCase().includes(eventFilter);
        const statusMatch = statusFilter === '' ||
            (statusFilter === 'Booked' && person.bookingStatus === true) ||
            (statusFilter === 'Cancelled' && person.bookingStatus === false);

        return nameMatch && eventMatch && statusMatch;
    });

    renderTable(filteredData);
}

// Add event listeners for filtering
document.getElementById('nameFilter').addEventListener('input', filterTable);
document.getElementById('eventFilter').addEventListener('input', filterTable);
document.getElementById('statusFilter').addEventListener('change', filterTable);