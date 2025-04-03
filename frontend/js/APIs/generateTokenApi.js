async function generateToken(email, password) {
    
    const response = await fetch('http://localhost:8080/generate-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if(!response.ok){
        // handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login Failed');
    }

    return await response.json();
}