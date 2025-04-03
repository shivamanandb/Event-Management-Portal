const fetchCurrentUser = async(token) => {
    try {
        const response = await fetch('http://localhost:8080/current-user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get current User');
        }
        
        const data = await response.json();
        console.log("User data:", data);
        localStorage.setItem('user', JSON.stringify(data));
    } catch(error){
        console.error('Error while saving user details:', error);
    }
}
