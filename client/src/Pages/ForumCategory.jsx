import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';


// Register the locale data
TimeAgo.addDefaultLocale(en);

const ForumCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [postText, setPostText] = useState("");
  const itemsPerPage = 25;
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setDisplayName(sessionStorage.getItem("displayName"));

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forum/category/${category}`);
        
        //Sort the posts so that isPinned = true posts appear first
        const sortedPosts = res.data.sort((a, b) => {
          //Sort pinned posts first
          if (a.isPinned === b.isPinned) return 0;
          return a.isPinned ? -1 : 1;  //If a.isPinned is true, it comes first, else, it comes after b
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

  
  const handleSubmitPost = async () => {
    setErrorMessage("");

    try {
      const res = await axios.post('http://localhost:5000/api/forum/', {
        userName: displayName,
        contents: postText,
        Category: category
      });

      setPost(res.data);
      setPostText("");
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to submit post:", error);
      setErrorMessage("Failed to submit post. Please try again.");
    }
  };

  const handleStartThreadClick = () => {
    setShowPostForm(true); //Show the post form when the buttn is clicked
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      seconds: null,
      hour12: true, //24 hour clocks are for the French and the military
    };
    return `${date.toLocaleDateString('en-US', options)}`; //Use US format to put year last
  };
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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

      {/*Start thread button*/}
      {!showPostForm && (
        <button className="start-thread-btn" onClick={handleStartThreadClick}>
          Start a Thread
        </button>
      )}
      {showPostForm && (
        <div className="news-card-content reply-form-content">
          <h3 className="reply-form-title">Start a thread</h3>
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
      )}
    </div>
  );
};

export default ForumCategory;
