import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const API_URL = "http://127.0.0.1:8000/api/categories/";

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    return (
        <div className="container">
            <h2>Product Categories</h2>
            <div className="list-group">
                {categories.map(category => (
                    <button key={category.id} className="list-group-item list-group-item-action">
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Home;
