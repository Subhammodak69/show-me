import React, { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
    const [products, setProducts] = useState([]);
    const API_URL = "http://127.0.0.1:8000/api/products/";

    useEffect(() => {
        axios.get(API_URL)
            .then(response => {
                setProducts(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
            });
    }, []);

    return (
        <div className="container">
            <h2>Products</h2>
            <div className="row">
                {products.map(product => (
                    <div key={product.id} className="col-md-4 mb-4">
                        <div className="card">
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
