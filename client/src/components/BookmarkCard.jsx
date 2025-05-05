import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Image } from 'react-bootstrap';

const BookmarkCard = ({ bookmark, onDelete }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [faviconSrc, setFaviconSrc] = useState(bookmark.favicon || '');
  
  // Extract domain for display and favicon fallback
  let domain = '';
  try {
    const url = new URL(bookmark.url);
    domain = url.hostname.replace('www.', '');
  } catch (error) {
    domain = 'Invalid URL';
  }

  // Set up favicon fallback logic
  useEffect(() => {
    if (bookmark.favicon) {
      setFaviconSrc(bookmark.favicon);
    }
  }, [bookmark.favicon]);

  // Handle favicon load error
  const handleFaviconError = () => {
    // If original favicon failed, try domain/favicon.ico
    if (faviconSrc === bookmark.favicon && domain !== 'Invalid URL') {
      // Make sure domain has proper protocol
      let domainWithProtocol = domain;
      if (!domain.startsWith('http')) {
        domainWithProtocol = `https://${domain}`;
      }
      const fallbackFavicon = `${domainWithProtocol}/favicon.ico`;
      setFaviconSrc(fallbackFavicon);
    } else {
      // If fallback also failed, hide the favicon
      setFaviconSrc('');
    }
  };

  // Format date
  const formattedDate = bookmark.createdAt
    ? new Date(bookmark.createdAt).toLocaleDateString()
    : '';
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(bookmark._id);
    }
  };

  // Truncate summary for card display
  const MAX_SUMMARY_LENGTH = 150;
  const hasSummary = bookmark.summary && bookmark.summary.trim().length > 0;
  const isLongSummary = hasSummary && bookmark.summary.length > MAX_SUMMARY_LENGTH;
  const truncatedSummary = isLongSummary 
    ? `${bookmark.summary.substring(0, MAX_SUMMARY_LENGTH)}...` 
    : bookmark.summary;

  return (
    <>
      <Card className="h-100 shadow-sm hover-shadow transition-all">
        <Card.Body className="d-flex flex-column">
          {/* Header with title and delete button */}
          <div className="d-flex justify-content-between mb-2">
            <div className="w-100 pe-2">
              <div className="d-flex align-items-start">
                {/* Favicon with fallback */}
                {faviconSrc && (
                  <Image 
                    src={faviconSrc} 
                    alt="Site icon" 
                    width={16} 
                    height={16} 
                    className="me-2 mt-1 flex-shrink-0"
                    onError={handleFaviconError} 
                  />
                )}
                {/* Title with word break for long titles */}
                <Card.Title className="mb-0 h5" style={{ wordBreak: 'break-word' }}>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-primary"
                  >
                    {bookmark.title}
                  </a>
                </Card.Title>
              </div>
            </div>
            {/* Delete button with trash icon */}
            <Button
              variant="link"
              className="p-0 text-danger ms-1 flex-shrink-0"
              onClick={handleDelete}
              aria-label="Delete bookmark"
              style={{ height: 'fit-content' }}
            >
              <i className="bi bi-trash-fill">X</i>
            </Button>
          </div>
          
          {/* URL and date */}
          <Card.Subtitle className="mb-2 text-muted small">
            <div className="d-flex flex-wrap align-items-center">
              <div className="d-flex align-items-center me-2 mb-1">
                <i className="bi bi-link-45deg me-1"></i>
                <span className="text-truncate">{domain}</span>
              </div>
              {formattedDate && (
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-calendar-event me-1"></i>
                  {formattedDate}
                </div>
              )}
            </div>
          </Card.Subtitle>
          
          {/* Summary with truncation and see more button */}
          {hasSummary && (
            <div className="mb-3">
              <Card.Text className="text-secondary small mb-1">
                {truncatedSummary}
              </Card.Text>
              {isLongSummary && (
                <Button 
                  variant="link" 
                  className="p-0 text-primary small" 
                  onClick={() => setShowFullSummary(true)}
                >
                  See full summary
                </Button>
              )}
            </div>
          )}
          
          {/* Tags */}
          <div className="mt-auto">
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1">
                {bookmark.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    bg="primary"
                    className="bg-opacity-10 text-primary rounded-pill fw-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Modal for full summary */}
      <Modal
        show={showFullSummary}
        onHide={() => setShowFullSummary(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-break">
            {bookmark.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="summary-content" style={{ maxHeight: '70vh', overflow: 'auto' }}>
            {bookmark.summary.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFullSummary(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => window.open(bookmark.url, '_blank')}
          >
            Visit Website
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BookmarkCard;