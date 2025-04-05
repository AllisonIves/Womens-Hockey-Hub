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
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editPostText, setEditPostText] = useState("");
  const repliesPerPage = 25;

  // Fetch post by ID
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

  // Submit a new reply
  const handleSubmitReply = async () => {
    setErrorMessage("");

    const minResult = replyCharacterMin(replyText);
    if (!minResult.isValid) return setErrorMessage(minResult.message);

    const result = replyCharacterLimit(replyText);
    if (!result.isValid) return setErrorMessage(result.message);

    try {
      const res = await axios.post(`http://localhost:5000/api/forum/${postId}/reply`, {
        userName: displayName,
        contents: replyText,
      });
      setPost(res.data);
      setReplyText("");
    } catch (error) {
      console.error("Failed to submit reply:", error);
      setErrorMessage("Failed to submit reply. Please try again.");
    }
  };

  // Soft delete a reply
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

  // Soft delete the main post
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

  // Start editing a reply
  const handleEditClick = (replyId, currentText) => {
    setEditingReplyId(replyId);
    setEditReplyText(currentText);
    setErrorMessage("");
  };

  // Cancel editing a reply
  const handleEditCancel = () => {
    setEditingReplyId(null);
    setEditReplyText("");
  };

  // Submit edited reply
  const handleEditSubmit = async (replyId) => {
    const minResult = replyCharacterMin(editReplyText);
    if (!minResult.isValid) return setErrorMessage(minResult.message);

    const result = replyCharacterLimit(editReplyText);
    if (!result.isValid) return setErrorMessage(result.message);

    try {
      const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}/${replyId}`, {
        userName: displayName,
        contents: editReplyText,
      });
      setPost(res.data);
      setEditingReplyId(null);
      setEditReplyText("");
    } catch (error) {
      console.error("Failed to edit reply:", error);
      setErrorMessage("Failed to edit reply. Please try again.");
    }
  };

  // Fetch user data for post and replies
  useEffect(() => {
    if (post) {
      const fetchUser = async (userName) => {
        if (users[userName]) return;
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${encodeURIComponent(userName)}`);
          setUsers((prev) => ({ ...prev, [userName]: res.data }));
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };

      fetchUser(post.userName);
      post.replies.forEach((reply) => {
        if (!users[reply.userName]) fetchUser(reply.userName);
      });
    }
  }, [post, users]);

  // Format date string
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

  // Change reply page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Conditional loading states
  if (loading) return <div className="news-page"><p>Loading thread...</p></div>;
  if (!post) return <div className="news-page"><p>Thread not found.</p></div>;

  // Calculate pagination logic
  const indexOfLastReply = currentPage * repliesPerPage;
  const indexOfFirstReply = indexOfLastReply - repliesPerPage;
  const currentReplies = post.replies.slice(indexOfFirstReply, indexOfLastReply);
  const totalPages = Math.ceil(post.replies.length / repliesPerPage);

  // Component render
  return (
    <div className="news-page">
      <h1 className="news-title">Thread View</h1>

      {/* Main Post */}
      <div className="news-card-wrapper original-post-wrapper">
        <div className="news-cards-container">
          <div className="news-card">
            <div className="meta-container" style={{ color: "white", padding: "1rem" }}>
              <p>{post.userName}</p>
              {users[post.userName]?.photoURL && (
                <img src={users[post.userName].photoURL} alt={`${post.userName}'s profile`} width={100} height={100} />
              )}
              <hr />
              <p>{formatDate(post.createdAt)}</p>
            </div>
            <div className="news-card-content">
              {editingPost ? (
                <>
                  <textarea
                    className="reply-textarea edit-reply-textarea"
                    value={editPostText}
                    onChange={(e) => setEditPostText(e.target.value)}
                  />
                  <div className="edit-delete-container">
                    <button className="edit-button" onClick={async () => {
                      const min = replyCharacterMin(editPostText);
                      if (!min.isValid) return setErrorMessage(min.message);
                      const max = replyCharacterLimit(editPostText);
                      if (!max.isValid) return setErrorMessage(max.message);

                      try {
                        const res = await axios.put(`http://localhost:5000/api/forum/id/${post.id}`, {
                          userName: displayName,
                          contents: editPostText,
                          isEdited: true,
                        });
                        setPost(res.data);
                        setEditingPost(false);
                        setEditPostText("");
                      } catch (error) {
                        console.error("Failed to update post:", error);
                        setErrorMessage("Failed to update post. Please try again.");
                      }
                    }}>
                      Submit
                    </button>
                    <button className="delete-button" onClick={() => {
                      setEditingPost(false);
                      setEditPostText("");
                    }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{post.contents}</p>
                  {post.isEdited && <div className="edited-icon">✎</div>}
                  {post.userName === displayName && post.contents !== "This post has been deleted" && (
                    <div className="edit-delete-container" style={{ marginTop: "1rem" }}>
                      <button className="edit-button" onClick={() => {
                        setEditingPost(true);
                        setEditPostText(post.contents);
                      }}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(post.id)}>Delete</button>
                    </div>
                  )}
                </>
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
              {currentReplies.map((reply) => (
                <div key={reply._id} className="news-card">
                  <div className="meta-container">
                    <p>{reply.userName}</p>
                    {users[reply.userName]?.photoURL && (
                      <img src={users[reply.userName].photoURL} alt={`${reply.userName}'s profile`} width={100} height={100} />
                    )}
                    <p>{formatDate(reply.createdAt)}</p>
                  </div>
                  <div className="news-card-content">
                    {editingReplyId === reply._id ? (
                      <>
                        <textarea
                          className="reply-textarea edit-reply-textarea"
                          value={editReplyText}
                          onChange={(e) => setEditReplyText(e.target.value)}
                        />
                        <div className="edit-delete-container">
                          <button className="edit-button" onClick={() => handleEditSubmit(reply._id)}>Submit</button>
                          <button className="delete-button" onClick={handleEditCancel}>Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{reply.contents}</p>
                        <div className="edit-delete-container">
                          {reply.isEdited && <div className="edited-icon">✎</div>}
                          {reply.userName === displayName && reply.contents !== "This post has been deleted" && (
                            <>
                              <button className="edit-button" onClick={() => handleEditClick(reply._id, reply.contents)}>Edit</button>
                              <button className="delete-button" onClick={() => handleDeleteReply(reply._id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </>
                    )}
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

      {/* Back Button */}
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
