import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = "http://127.0.0.1:8000/api/carts/";

    useEffect(() => {
        const token = localStorage.getItem("access");

        // Ensure that the token is used in the header
        axios.defaults.withCredentials = true; // This ensures cookies (session) are sent

        if (!token) {
            setError("You must be logged in to view the cart.");
            setLoading(false);
            return;
        }

        axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setCartItems(response.data);
        })
        .catch(error => {
            setError("Error fetching cart items. Please try again later.");
            console.error("Error fetching cart items:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading cart items...</div>;

    if (error) return <div style={{ color: "red" }}>{error}</div>;

    const totalPrice = cartItems.reduce((total, item) => total + item.total_price, 0);

    return (
        <div className="container">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul className="list-group">
                        {cartItems.map(item => (
                            <li key={item.id} className="list-group-item">
                                {item.product.name} - {item.quantity} pcs - ${item.total_price}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">
                        <strong>Total Price: </strong>${totalPrice}
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-primary">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
