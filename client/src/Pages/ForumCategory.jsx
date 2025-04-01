import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "/src/styles/news.css";

const ForumCategory = () => {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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
                >
                  <div className="news-card-content">
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
      )}
    </div>
  );
};

export default ForumCategory;
