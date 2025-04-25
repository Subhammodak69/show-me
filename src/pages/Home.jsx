import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance'; // Make sure this is correctly configured

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = "http://127.0.0.1:8000/api/categories/";

    useEffect(() => {
        const token = localStorage.getItem("access");

        if (!token) {
            setError("You must be logged in to view categories.");
            setLoading(false);
            return;
        }

        axiosInstance.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            setError("Error fetching categories. Please try again later.");
            console.error("Error fetching categories:", error);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div style={{ color: "red" }}>{error}</div>;
    }

    return (
        <div className="container">
            <h2>Product Categories</h2>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                <div className="list-group">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => console.log(`Category ${category.name} clicked`)}
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
