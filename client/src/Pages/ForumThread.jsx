import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";

const ForumThread = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const repliesPerPage = 25;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/id/${postId}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="news-page"><p>Loading thread...</p></div>;
  if (!post) return <div className="news-page"><p>Thread not found.</p></div>;

  // Pagination logic
  const indexOfLastReply = currentPage * repliesPerPage;
  const indexOfFirstReply = indexOfLastReply - repliesPerPage;
  const currentReplies = post.replies.slice(indexOfFirstReply, indexOfLastReply);
  const totalPages = Math.ceil(post.replies.length / repliesPerPage);

  return (
    <div className="news-page">
      <h1 className="news-title">Thread View</h1>

      {/* Unified wrapper for main post */}
      <div className="news-card-wrapper original-post-wrapper">
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
              {currentReplies.map((reply, index) => (
                <div key={index} className="news-card">
                  <div className="news-card-content">
                    <p>{reply.contents}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            {currentPage > 1 && (
              <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNum =>
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 2)
              )
              .map((pageNum) => (
                <button
                  key={pageNum}
                  className="page-button"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={pageNum === currentPage}
                >
                  {pageNum}
                </button>
              ))}
            {currentPage < totalPages && (
              <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            )}
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>No replies yet.</p>
      )}
    </div>
  );
};

export default ForumThread;
