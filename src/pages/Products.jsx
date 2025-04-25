import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance"; // assuming axiosInstance is properly configured

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = "http://127.0.0.1:8000/api/products/";

    useEffect(() => {
        axiosInstance.defaults.withCredentials = true;

        axiosInstance.get(API_URL)
            .then((response) => {
                setProducts(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                setError("Error fetching products. Please try again later.");
                console.error("Error fetching products:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading products...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="container">
            <h2>Products</h2>
            <div className="row">
                {products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            {product.image_url && (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="card-img-top"
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text"><strong>Price:</strong> ${product.price}</p>
                                <button className="btn btn-primary">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
