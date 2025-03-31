import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";

const ForumCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/category/${category}`);
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  return (
    <div className="news-page">
      <h1 className="news-title">Threads in {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No threads found in this category.</p>
      ) : (
        <div className="news-card-wrapper">
          <div className="news-cards-container">
            {posts.map((post) => (
              <Link
                to={`/forum/thread/${post.id}`}
                key={post.id}
                className="news-card"
              >
                <div className="news-card-content">
                  <p>{post.contents.slice(0, 300)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumCategory;
