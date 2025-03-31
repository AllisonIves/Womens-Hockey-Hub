import React from "react";
import { Link } from "react-router-dom";
import "/src/styles/news.css";
import Logo from "/src/assets/Hockey.png";

const ForumLanding = () => {
  const testCategories = [
    "Test Category 1",
    "Test Category 2",
    "Test Category 3",
    "Test Category 4",
    "Test Category 5",
  ];

  return (
    <div className="news-page">
      <div className="news-logo-container">
        <img src={Logo} alt="Women's Hockey Hub Logo" className="news-logo" />
      </div>

      <h1 className="news-title">Forum Categories</h1>

      <div className="news-card-wrapper">
        <div className="news-cards-container">
          {testCategories.map((category, index) => (
            <Link
              to={`/forum/category/${encodeURIComponent(category)}`}
              key={index}
              className="news-card"
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
