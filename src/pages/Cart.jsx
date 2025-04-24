import React, { useState, useEffect } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const API_URL = "http://127.0.0.1:8000/api/carts/";

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setCartItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching cart items:", error);
            });
    }, []);

    return (
        <div className="container">
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="list-group">
                    {cartItems.map(item => (
                        <li key={item.id} className="list-group-item">
                            {item.product.name} - {item.quantity} pcs - ${item.total_price}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
