const createOrderApi = async (amount, token) => {

    const response = await fetch('http://localhost:8080/payment/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            amount: amount,
            info: 'order_request'
        })
    });

    if (!response.ok) {
        throw new Error('Failed to generate order ID');
    }

    return await response.json();
}