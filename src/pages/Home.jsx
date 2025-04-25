import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const API_URL = "http://127.0.0.1:8000/api/categories/";

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                setError("Error fetching categories. Please try again later.");
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setLoading(false); // Stop loading when data is fetched
            });
    }, []);

    if (loading) {
        return <div>Loading categories...</div>; // Show loading text while fetching
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>; // Show error message
    }

    return (
        <div className="container">
            <h2>Product Categories</h2>
            {categories.length === 0 ? (
                <p>No categories available.</p> // Show if no categories are fetched
            ) : (
                <div className="list-group">
                    {categories.map(category => (
                        <button 
                            key={category.id} 
                            className="list-group-item list-group-item-action"
                            onClick={() => console.log(`Category ${category.name} clicked`)} // Placeholder for category click
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
