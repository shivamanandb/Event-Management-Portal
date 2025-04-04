let enrolledPeople = []; // Global variable to store enrolled people data

function getEventId() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    return eventId;
}

document.addEventListener('DOMContentLoaded', async () => {

    setupNavigation();
    const eventId = getEventId();
    const token = localStorage.getItem('token');

    try {
        
        enrolledPeople = await getEnrolledPeople(eventId);
        console.log("Enrolled People Data: ", enrolledPeople);

        // Initial table render
        renderTable(enrolledPeople);
    } catch (error) {
        console.error('Error fetching enrolled people:', error);
        alert('Failed to load enrolled people. Please try again later.');
    }
});

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
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredData = enrolledPeople.filter(person => {
        const nameMatch = person.name.toLowerCase().includes(nameFilter);
        const statusMatch = statusFilter === '' ||
            (statusFilter === 'Booked' && person.bookingStatus === true) ||
            (statusFilter === 'Cancelled' && person.bookingStatus === false);

        return nameMatch && statusMatch;
    });

    renderTable(filteredData);
}

// Add event listeners for filtering
document.getElementById('nameFilter').addEventListener('input', filterTable);
document.getElementById('statusFilter').addEventListener('change', filterTable);