import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";
import replyCharacterLimit from "/src/utilities/replyCharacterLimit";
import replyCharacterMin from "/src/utilities/replyCharacterMin";

const ForumThread = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleEditReply = async (replyId, isDelete) => {
    setErrorMessage(""); // Clear any existing error message
    if(!isDelete){
    // Ensure the reply text is valid (min length check)
    const minResult = replyCharacterMin(replyText);
    if (!minResult.isValid) {
      setErrorMessage(minResult.message);
      return;
    }
  
    // Ensure the reply text doesn't exceed the character limit
    const result = replyCharacterLimit(replyText);
    if (!result.isValid) {
      setErrorMessage(result.message);
      return;
    }
  
    try {
      // Send a PUT request to the API to update the reply
      const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}/${replyId}`, {
        userName: displayName,
        contents: replyText,
      });
  
      // Update the state with the updated reply data
      setPost(res.data);
      setReplyText(""); // Clear the reply text
      setErrorMessage(""); // Clear any error message
    } catch (error) {
      console.error("Failed to edit reply:", error);
      setErrorMessage("Failed to edit reply. Please try again.");
    }
  }
  else{
    try {
      // Send a PUT request to the API to update the reply
      const res = await axios.put(`http://localhost:5000/api/forum/id/${postId}/${replyId}`, {
        contents: "This message has been deleted",
      });
  
      // Update the state with the updated reply data
      setPost(res.data);
      setReplyText(""); // Clear the reply text
      setErrorMessage(""); // Clear any error message
    } catch (error) {
      console.error("Failed to delete reply:", error);
      setErrorMessage("Failed to delete reply. Please try again.");
    }
  }
  };

  useEffect(() => {
    if (post) {
      // Function to fetch the user for a given username
      const fetchUser = async (userName) => {
        try {
          // If user data is already in state, do not fetch again
          if (users[userName]) return;

          const encodedUserName = encodeURIComponent(userName);
          const res = await axios.get(`http://localhost:5000/api/users/${encodedUserName}`);
          setUsers((prevUsers) => ({ ...prevUsers, [userName]: res.data }));
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };

      // Fetch the user for the original post
      fetchUser(post.userName);

      //Fetch user for each reply
      post.replies.forEach((reply) => {
        if (!users[reply.userName]) { //Avoid re-fetching the same user
          fetchUser(reply.userName);
        }
      });
    }
  }, [post, users]); //Run when post or users change

  //Function to format date for readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    //Format date
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, //12-hour clock
    });
  
    //Combine date and time
    return `${formattedDate} at ${formattedTime}`;
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
              {/* Check if user exists before rendering image */}
              {users[post.userName] && users[post.userName].photoURL && (
                <img src={users[post.userName].photoURL} alt={`${post.userName}'s profile`} width={100} height={100} />
              )}
              <hr/>
              <p>{formatDate(post.createdAt)}</p>
            </div>
            <div className="news-card-content">
              <p>{post.contents}</p>
              <div className="edit-delete-container">
              {post.isEdited && (<div className="edited-icon">✎</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <h2 className="news-title">Replies</h2>
      {post.replies && post.replies.length > 0 ? (
        <>
          <div className="replies-wrapper">
            <div className="news-cards-container">
              {currentReplies.map((reply, index) => (
                <div key={index} className="news-card">
                  <div className="meta-container">
                  <p>{reply.userName}</p>
                    {/* Check if user exists before rendering image */}
                    {users[reply.userName] && users[reply.userName].photoURL && (
                      <img src={users[reply.userName].photoURL} alt={`${reply.userName}'s profile`} width={100} height={100} />
                    )}
                    <p>{formatDate(reply.createdAt)}</p>
                  </div>
                  <div className="news-card-content">
                    <p>{reply.contents}</p>
                    <div className="edit-delete-container">
              {post.isEdited && (<div className="edited-icon">✎</div>)}
                <button className="edit-button" onClick={() => handleEditReply(reply._id, false)}>Edit</button>
                <button className="delete-button" onClick={() => handleEditReply(reply._id, true)}>Delete</button>
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
