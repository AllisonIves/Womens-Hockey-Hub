import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "/src/styles/news.css";
import Logo from "/src/assets/Hockey.png";
import axios from "axios";

const ForumLanding = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/forum/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="news-page">
      <div className="news-logo-container">
        <img src={Logo} alt="Women's Hockey Hub Logo" className="news-logo" />
      </div>

      <div className="rules">
        <div className="rules-container">
          <p> Rules:</p>
          <p> Don't be rude and/or racist </p>
          <p> Do not start talking about divisive topics e.g politics </p>
          <p> Do not spam and also self promotion is banned </p>
          </div>
      </div>

      <h1 className="news-title">Forum Categories</h1>

      <div className="news-card-wrapper">
          <div className="news-cards-container">
            {categories.map((category, index) => (
              <Link
                to={`/forum/category/${encodeURIComponent(category)}`}
                key={index}
                className="forum-category-card"
              >
                <div className="news-card-content">
                  <h3>{category}</h3>
                  <p>View threads in this category</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </div>
  );
};

export default ForumLanding;
