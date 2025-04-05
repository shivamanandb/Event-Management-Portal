const fetchEvents = async(token) => {
    try {
        // Get and parse user data from localStorage
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
            console.error('User data not found in localStorage');
            return;
        }
        
        const user = JSON.parse(userStr);
        console.log("User:", user);
        
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `<div class="loader">Loading...</div>`;
        document.body.appendChild(loader);
        
        // Only fetch events if user is an ATTENDEE
        if(user && user.role == 'ATTENDEE') {
            const response = await fetch('http://localhost:8080/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            loader.remove();

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Event could not fetch');
            }
            
            return await response.json();
            
            // Store events as JSON string
            if(data){
                localStorage.setItem('events', JSON.stringify(data));
            }
        } else if(user && user.role == 'ORGANIZER') {
            const response = await fetch(`http://localhost:8080/events/organizer/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            loader.remove();

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || 'Event could not fetch');
            }
            
            const data = await response.json();
            
            return data;
        }
        
        
    } catch(error) {
        console.error('Could not fetch events:', error);
    }
}