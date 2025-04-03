async function createUser(userType, userData) {
    
    const response = await fetch(`http://localhost:8080/user/create-user?role=${userType}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    return response;
}