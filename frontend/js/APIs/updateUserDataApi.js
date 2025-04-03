// update user data
async function updateData(userData) {

    try {
        const response = await fetch('http://localhost:8080/user/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        const data = await response.text(); // Convert response to text
        return data; // Return response data

    } catch (err) {
        console.error("Error updating data:", err);
        return err; // Return an error message
    }
}