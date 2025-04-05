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

      <div className="rules-card-wrapper">
        <div className="rules">
          <div className="rules-container">
            <p>
              Welcome to the Women’s Hockey Hub Forum! This is our community — a place to cheer,
              connect, and celebrate the PWHL together. Here’s how we keep it great:
            </p>

            <p>
              <strong>Keep it clean, and our sticks on the ice</strong><br />
              <span>Play fair, be kind, and keep the vibe respectful.</span>
            </p>

            <p>
              <strong>Pass the puck</strong><br />
              <span>Make space for every voice. Let others share their thoughts too.</span>
            </p>

            <p>
              <strong>Celebrate the game</strong><br />
              <span>Win or lose, we're here for the love of hockey and the players who inspire us.</span>
            </p>

            <p>
              <strong>Lift the team</strong><br />
              <span>Encourage each other, share what you love, and help this community grow.</span>
            </p>

            <p>
              <strong>Stay onside</strong><br />
              <span>Keep posts hockey-related and in the right zone (aka: the right category).</span>
            </p>

            <p>
              <strong>Stay out of the penalty box</strong><br />
              <span>Be kind and be inclusive.</span>
            </p>
          </div>
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