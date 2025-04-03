// Delete an event
const setupDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    console.log("Delete buttons found:", deleteButtons.length);

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const eventId = button.getAttribute('data-id');

            if (!eventId) {
                console.error("No event ID found for delete button");
                alert("Error: Cannot identify event to delete");
                return;
            }

            // Show confirmation dialog
            const isConfirmed = confirm("Are you sure you want to delete this event?");

            // Only proceed if user clicked "OK" (Yes)
            if (isConfirmed) {
                try {
                    console.log("Attempting to delete event with ID:", eventId);

                    const response = await fetch(`http://localhost:8080/events/${eventId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        // Success - remove the event card from the DOM
                        const eventCard = button.closest('.event-card');
                        if (eventCard) {
                            eventCard.remove();
                        }

                        // Also update localStorage events list if applicable
                        try {
                            const eventsStr = localStorage.getItem('events');
                            if (eventsStr) {
                                const events = JSON.parse(eventsStr);
                                console.log("events : ", events)
                                const updatedEvents = events.filter(event => event.id != eventId);
                                console.log("updated Events : ", updatedEvents)
                                localStorage.removeItem('events')
                                localStorage.setItem('events', JSON.stringify(updatedEvents));
                            }
                        } catch (e) {
                            console.error("Error updating localStorage after delete:", e);
                        }

                        alert("Event deleted successfully!");
                    } else {
                        const errorData = await response.json().catch(() => null);
                        console.error("Delete error response:", errorData);
                        alert(`Failed to delete event. Status: ${response.status}. ${errorData?.message || ''}`);
                    }
                } catch (error) {
                    console.error('Error deleting event:', error);
                    alert("An error occurred while trying to delete the event.");
                }
            } else {
                // User clicked "Cancel" (No)
                console.log("Event deletion cancelled");
            }
        });
    });
};
