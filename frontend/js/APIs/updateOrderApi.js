const updateOrder = async(orderData) => {

    const token = localStorage.getItem('token')
    // Update order status
    const orderResponse = await fetch('http://localhost:8080/user/update-order', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
        throw new Error("Failed to update order");
    }

    return await orderResponse.json();
}