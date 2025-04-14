import React, { useEffect, useState } from "react";
import "/src/styles/news.css";
import axios from "axios";
import Logo from "/src/assets/Hockey.png";

/**
 * News component displays a paginated list of news articles.
 * Users can click on a card to view a full article in an overlay.
 *
 * @component
 * @returns {JSX.Element} Rendered news section with pagination and article overlay.
 */
const News = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/news");
        setArticles(res.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };

    fetchNews();
  }, []);

  /**
   * Opens the overlay with the selected article.
   * @param {Object} article - The article to show in full.
   */
  const handleCardClick = (article) => setSelectedArticle(article);
  /** Closes the overlay view. */
  const handleCloseOverlay = () => setSelectedArticle(null);

  /**
   * Changes the current pagination page.
   * @param {number} pageNumber - The new page number to view.
   */
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return (
    <div className="news-page">
      {/* Logo */}
      <div className="news-logo-container">
        <img src={Logo} alt="Women's Hockey Hub Logo" className="news-logo" />
      </div>

      {/* Page Title */}
      <h1 className="news-title">Latest News</h1>

      {/* Scrollable news card container */}
      <div className="news-card-wrapper">
        <div className="news-cards-container">
          {currentArticles.map((article, index) => (
            <div key={index} className="news-card" onClick={() => handleCardClick(article)}>
              {article.imageURL && (
                <img
                  src={article.imageURL}
                  alt={article.title}
                  className="news-card-image"
                />
              )}
              <div className="news-card-content">
                <h3 className="news-card-title">{article.title}</h3>
                <p className="news-card-preview">
                  {article.content.slice(0, 500)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        {currentPage > 1 && (
          <button className="page-button" onClick={() => handlePageChange(currentPage - 1)}>
            Prev
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((pageNum) =>
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
              Page {pageNum}
            </button>
          ))}

        {currentPage < totalPages && (
          <button className="page-button" onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        )}
      </div>

      {/* Article overlay */}
      {selectedArticle && (
        <div className="news-overlay">
          <div className="news-overlay-content">
            <button className="news-overlay-close" onClick={handleCloseOverlay}>×</button>
            <h2>{selectedArticle.title}</h2>
            <p className="news-overlay-meta">
              By {selectedArticle.author} |{" "}
              {new Date(selectedArticle.postedAt).toLocaleDateString()}
            </p>
            {selectedArticle.imageURL && (
              <img
                src={selectedArticle.imageURL}
                alt={selectedArticle.title}
                className="news-overlay-image"
              />
            )}
            <p className="news-overlay-text">{selectedArticle.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
