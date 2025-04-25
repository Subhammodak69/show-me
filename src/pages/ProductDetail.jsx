import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const API_URL = `http://127.0.0.1:8000/api/products/${id}/`; // API URL with product ID

  useEffect(() => {
    // Fetch product details
    axios.get(API_URL)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        setError("Error fetching product details.");
        console.error("Error fetching product details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]); // Re-fetch if product ID changes

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  return (
    <div className="container">
      <h2>{product.name}</h2>
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
        <div className="col-md-6">
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <button className="btn btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
