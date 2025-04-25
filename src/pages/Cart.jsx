import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // use this instead of axios

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const API_URL = "http://127.0.0.1:8000/api/carts/";

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            setError("You must be logged in to view the cart.");
            setLoading(false);
            navigate('/signin');
            return;
        }

        axiosInstance.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            setCartItems(response.data);
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                setError("Session expired. Please log in again.");
                navigate('/signin');
            } else {
                setError("Error fetching cart items. Please try again later.");
            }
            console.error("Error fetching cart items:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [navigate]);

    if (loading) return <div>Loading cart items...</div>;

    if (error) return <div style={{ color: "red" }}>{error}</div>;

    const totalPrice = cartItems.reduce((total, item) => total + item.total_price, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

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
                                {item.product.name} - {item.quantity} pcs - ${item.total_price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3">
                        <strong>Total Price: </strong>${totalPrice.toFixed(2)}
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-primary" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
