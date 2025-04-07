async function paymentKeyResponse() {
    
    const response = await fetch('http://localhost:8080/payment/razorpay-key', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    if(!response.ok){
        throw new Error('Failed to fetch payment key');
    }

    return await response.text();
}