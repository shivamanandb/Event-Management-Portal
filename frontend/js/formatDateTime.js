// Function to format ISO date string to readable format
function formatDateTime(isoString) {
    if (!isoString || isoString === '5555-05-05T05:55:00') {
        return { date: 'Date', time: 'Time' };
    }

    try {
        const date = new Date(isoString);

        // Format date: "Month Day, Year"
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-IN', dateOptions);

        // Format time: "H:MM AM/PM"
        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const formattedTime = date.toLocaleTimeString('en-IN', timeOptions);

        return { date: formattedDate, time: formattedTime };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { date: 'Invalid Date', time: 'Invalid Time' };
    }
}