import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";
import replyCharacterLimit from "/src/utilities/replyCharacterLimit";
import replyCharacterMin from "/src/utilities/replyCharacterMin";

const ForumThread = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postText, setPostText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const repliesPerPage = 25;

  useEffect(() => {
    setDisplayName(sessionStorage.getItem("displayName"));
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

  const handleSubmitReply = async () => {
    setErrorMessage("");

    const minResult = replyCharacterMin(replyText);
    if (!minResult.isValid) {
      setErrorMessage(minResult.message);
      return;
    }

    const result = replyCharacterLimit(replyText);
    if (!result.isValid) {
      setErrorMessage(result.message);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/forum/${postId}/reply`, {
        userName: displayName,
        contents: replyText,
      });

      setPost(res.data);
      setReplyText("");
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
      setErrorMessage("Failed to submit reply. Please try again.");
    }
  };

  const handleDeleteReply = async (replyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this reply?");
    if (!confirmDelete) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}/${replyId}`, {
        userName: displayName,
        contents: "This post has been deleted",
        isEdited: true,
      });

      setPost(res.data);
    } catch (error) {
      console.error("Failed to delete message");
    }
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this thread?");
    if (!confirmDelete) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}`, {
        userName: displayName,
        contents: "This post has been deleted",
        isEdited: true,
      });

      setPost(res.data);
    } catch (error) {
      console.error("Failed to soft-delete post:", error);
    }
  };

  const handleEditReply = async (replyId, isDelete) => {
    setErrorMessage("");

    if (!isDelete) {
      const minResult = replyCharacterMin(replyText);
      if (!minResult.isValid) {
        setErrorMessage(minResult.message);
        return;
      }

      const result = replyCharacterLimit(replyText);
      if (!result.isValid) {
        setErrorMessage(result.message);
        return;
      }

      try {
        const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}/${replyId}`, {
          userName: displayName,
          contents: replyText,
        });

        setPost(res.data);
        setReplyText("");
        setErrorMessage("");
      } catch (error) {
        console.error("Failed to edit reply:", error);
        setErrorMessage("Failed to edit reply. Please try again.");
      }
    } else {
      handleDeleteReply(replyId);
    }
  };

  useEffect(() => {
    if (post) {
      const fetchUser = async (userName) => {
        try {
          if (users[userName]) return;

          const encodedUserName = encodeURIComponent(userName);
          const res = await axios.get(`http://localhost:5000/api/users/${encodedUserName}`);
          setUsers((prev) => ({ ...prev, [userName]: res.data }));
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };

      fetchUser(post.userName);

      post.replies.forEach((reply) => {
        if (!users[reply.userName]) {
          fetchUser(reply.userName);
        }
      });
    }
  }, [post, users]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="news-page"><p>Loading thread...</p></div>;
  if (!post) return <div className="news-page"><p>Thread not found.</p></div>;

  const indexOfLastReply = currentPage * repliesPerPage;
  const indexOfFirstReply = indexOfLastReply - repliesPerPage;
  const currentReplies = post.replies.slice(indexOfFirstReply, indexOfLastReply);
  const totalPages = Math.ceil(post.replies.length / repliesPerPage);

  return (
    <div className="news-page">
      <h1 className="news-title">Thread View</h1>

      {/* Main Post */}
      <div className="news-card-wrapper original-post-wrapper">
        <div className="news-cards-container">
          <div className="news-card">
            <div className="meta-container">
              <p>{post.userName}</p>
              {users[post.userName]?.photoURL && (
                <img src={users[post.userName].photoURL} alt={`${post.userName}'s profile`} width={100} height={100} />
              )}
              <hr />
              <p>{formatDate(post.createdAt)}</p>
            </div>
            <div className="news-card-content">
              <p>{post.contents}</p>
              {post.isEdited && <div className="edited-icon">✎</div>}

              {post.userName === displayName && post.contents !== "This post has been deleted" && (
                <div className="edit-delete-container" style={{ marginTop: "1rem" }}>
                  <button className="delete-button" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <h2 className="news-title">Replies</h2>
      {post.replies?.length > 0 ? (
        <>
          <div className="replies-wrapper">
            <div className="news-cards-container">
              {currentReplies.map((reply, index) => (
                <div key={index} className="news-card">
                  <div className="meta-container">
                    <p>{reply.userName}</p>
                    {users[reply.userName]?.photoURL && (
                      <img src={users[reply.userName].photoURL} alt={`${reply.userName}'s profile`} width={100} height={100} />
                    )}
                    <p>{formatDate(reply.createdAt)}</p>
                  </div>
                  <div className="news-card-content">
                    <p>{reply.contents}</p>
                    <div className="edit-delete-container">
                      {reply.isEdited && <div className="edited-icon">✎</div>}
                      {reply.userName === displayName && reply.contents !== "This post has been deleted" && (
                        <>
                          <button className="edit-button" onClick={() => handleEditReply(reply._id, false)}>Edit</button>
                          <button className="delete-button" onClick={() => handleEditReply(reply._id, true)}>Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            {currentPage > 1 && (
              <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>Prev</button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((pageNum) =>
                pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 2)
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

      {/* Back Button always visible */}
      <button
        className="page-button"
        onClick={() => navigate(-1)}
        style={{ marginTop: "1rem", marginBottom: "2rem" }}
      >
        ← Back to Category
      </button>

      {/* Reply Form */}
      <div className="news-card-wrapper reply-form-wrapper">
        <div className="news-cards-container">
          <div className="news-card">
            <div className="news-card-content reply-form-content">
              <h3 className="reply-form-title">Post a Reply</h3>
              <textarea
                className="reply-textarea"
                placeholder="Write your reply here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              {errorMessage && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>}
              <button className="page-button reply-submit-button" onClick={handleSubmitReply}>
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumThread;
