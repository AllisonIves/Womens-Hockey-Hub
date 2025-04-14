import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import replyCharacterLimit from "/src/utilities/replyCharacterLimit";
import replyCharacterMin from "/src/utilities/replyCharacterMin";


// Register the locale data
TimeAgo.addDefaultLocale(en);

/**
 * ForumCategory component displays a list of forum threads within a specific category.
 * Threads can be sorted, paginated, and new threads can be created by authenticated users.
 *
 * @component
 * @returns {JSX.Element} Rendered forum category page with post list and create post form.
 */

const ForumCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [postText, setPostText] = useState("");
  const itemsPerPage = 25;
  const [displayName, setDisplayName] = useState("");

  // Fetch posts and sort by pinned/recent reply when category changes
  useEffect(() => {
    setDisplayName(sessionStorage.getItem("displayName"));

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/category/${category}`);
        
      //Sort the posts so that posts with isPinned set to true appear first
      const sortedPosts = res.data.sort((a, b) => {
        // Sort pinned posts first
        if (a.isPinned === b.isPinned) {
          //If posts are both pinned or not pinned, sort by the last reply's createdAt timestamp
          const aLastReply = a.replies.length > 0 
            ? new Date(a.replies[a.replies.length - 1].createdAt) 
            : new Date(a.createdAt); //Use post's timestamp if no replies
          const bLastReply = b.replies.length > 0 
            ? new Date(b.replies[b.replies.length - 1].createdAt) 
            : new Date(b.createdAt); //Use post's timestamp if no replies

          return bLastReply - aLastReply;  //Sort by latest reply or post createdAt date
        }

        return a.isPinned ? -1 : 1; //If a.isPinned is true, it comes first, else, it comes after b
      });

        setPosts(sortedPosts); //Set the sorted posts as posts
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

    /**
   * Handles thread submission, including validation and server call.
   */
  const handleSubmitPost = async () => {
    setErrorMessage("");
  
    // Validate minimum character count
    const minResult = replyCharacterMin(postText);
    if (!minResult.isValid) {
      setErrorMessage(minResult.message);
      return;
    }
  
    // Validate maximum character count
    const limitResult = replyCharacterLimit(postText);
    if (!limitResult.isValid) {
      setErrorMessage(limitResult.message);
      return;
    }
  
    try {
      const res = await axios.post("http://localhost:5000/api/forum/", {
        userName: displayName,
        contents: postText,
        Category: category,
      });
  
      const updatedPosts = [res.data, ...posts];
  
      const sortedPosts = updatedPosts.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
      });
  
      setPosts(sortedPosts);
      setPostText("");
      setShowPostForm(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to submit post:", error);
      if (error.response?.data?.error?.toLowerCase().includes("banned")) {
        setErrorMessage("Your post contains banned word(s). Please remove them and try again.");
      } else {
        setErrorMessage("Failed to submit post. Please try again.");
      }
    }
  };

  /**
   * Shows the post creation form when user clicks "Start a Thread".
   */
  const handleStartThreadClick = () => {
    setShowPostForm(true); //Show the post form when the buttn is clicked
  };

  /**
   * Sets the current pagination page.
   * @param {number} pageNumber - Page number to navigate to.
   */
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div className="news-page">
      <h1 className="news-title">Threads in {category}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No threads found in this category.</p>
      ) : (
        <>
          <div className="news-card-wrapper">
            <div className="news-cards-container">
              {currentItems.map((post) => (
                <Link
                  to={`/forum/thread/${post.id}`}
                  key={post.id}
                  className="news-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="meta-container" />
                  <div className="news-card-content">
                  {post.isPinned && (<div className="pin-icon">📌</div>)}
                  <p>
                    {/* Show number replies with grammatical handling for single reply threads*/}
                    {post.replies.length === 1
                    ? `${post.replies.length} reply`
                    : `${post.replies.length} replies`}
                  </p>
                  <p>
                  {`Original poster: ${post.userName}`}
                  </p>
                  {/* Display how long ago last reply was using React Time Ago */}
                  {post.replies.length > 0 && (
                    <p>
                      Most recent reply: <ReactTimeAgo date={new Date(post.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt)} locale="en-CA" />
                    </p>
                  )}
                    <p>{post.contents.slice(0, 300)}...</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            className="page-button"
            onClick={() => navigate("/forum")}
            style={{ marginBottom: "1rem" }}
          >
            ← Back to Landing Page
          </button>

          <div className="pagination">
            {currentPage > 1 && (
              <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>
                Prev
              </button>
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
              <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
        </>
      )
      }

      {/* Show the Start Thread button when form is hidden */}
        {!showPostForm && (
          <button className="page-button start-thread-btn" onClick={handleStartThreadClick}>
            Start a Thread
          </button>
        )}

        {/* Show the thread form when button is clicked */}
        {showPostForm && (
          <div className="news-card-wrapper">
            <div className="news-cards-container">
              <div className="news-card">
                <div className="news-card-content reply-form-content">
                  <h3 className="reply-form-title">Start a Thread</h3>
                  <textarea
                    className="reply-textarea"
                    placeholder="Write your post here..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                  {errorMessage && <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>}
                  <button className="page-button reply-submit-button" onClick={handleSubmitPost}>
                    Submit Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ForumCategory;
