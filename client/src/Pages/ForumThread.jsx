import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";

const ForumThread = () => {
  const { postId } = useParams(); // Extract the postId from the URL parameters
  const [post, setPost] = useState(null); // State for storing post
  const [loading, setLoading] = useState(true); // State for loading state

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/id/${postId}`);
        console.log("Fetched post:", res.data); // For debugging purposes
        setPost(res.data); // Set the fetched post to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Failed to fetch post:", err); // Log error if any
        setLoading(false); // Set loading to false if error occurs
      }
    };

    fetchPost(); // Call the function to fetch the post
  }, [postId]); // This effect runs when postId changes

  if (loading) return <div className="news-page"><p>Loading thread...</p></div>; // Loading state
  if (!post) return <div className="news-page"><p>Thread not found.</p></div>; // If no post is found

  return (
    <div className="news-page">
      <h1 className="news-title">Thread View</h1>

      {/* Main Post */}
      <div className="news-card-wrapper">
        <div className="news-cards-container">
          <div className="news-card">
            <div className="news-card-content">
              <p>{post.contents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {post.replies && post.replies.length > 0 ? (
        <>
          <h2 className="news-title">Replies</h2>
          <div className="news-card-wrapper">
            <div className="news-cards-container">
              {post.replies.map((reply, index) => (
                <div key={index} className="news-card">
                  <div className="news-card-content">
                    <p>{reply.contents}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>No replies yet.</p>
      )}
    </div>
  );
};

export default ForumThread;
