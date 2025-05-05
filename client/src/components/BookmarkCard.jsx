import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const BookmarkCard = ({ bookmark, onDelete }) => {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [faviconSrc, setFaviconSrc] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { isDark } = useTheme();
  
  // Extract domain for display and favicon fallback
  let domain = '';
  try {
    const url = new URL(bookmark.url);
    domain = url.hostname.replace('www.', '');
  } catch (error) {
    domain = 'Invalid URL';
  }

  // Set up favicon from Google's favicon service
  useEffect(() => {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`;
    setFaviconSrc(faviconUrl);
  }, [bookmark.url]);

  // Handle favicon load error
  const handleFaviconError = () => {
    // Use a placeholder if favicon fails to load
    setFaviconSrc('https://placehold.co/24x24?text=🔖');
  };

  // Format date
  const formattedDate = bookmark.createdAt
    ? new Date(bookmark.createdAt).toLocaleDateString()
    : '';
  
  // Handle delete with loading state
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      setIsDeleting(true);
      try {
        await onDelete(bookmark._id);
      } catch (err) {
        console.error('Error in deletion:', err);
      } finally {
        setIsDeleting(false);
      }
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
      <Card className="h-100 bookmark-card shadow-sm hover-shadow transition-all">
        <Card.Body className="d-flex flex-column">
          {/* Header with title and favicon */}
          <div className="d-flex mb-2">
            <img 
              src={faviconSrc} 
              alt="Site Icon"
              width="24"
              height="24"
              className="me-2 flex-shrink-0"
              onError={handleFaviconError} 
            />
            <Card.Title className="mb-0 line-clamp-2" style={{ wordBreak: 'break-word' }}>
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
              <Card.Text className="text-secondary small mb-1 line-clamp-2">
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
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="d-flex flex-wrap mb-3">
              {bookmark.tags.map((tag, index) => (
                <Badge
                  key={index}
                  bg={isDark ? "secondary" : "light"}
                  text={isDark ? "light" : "dark"}
                  className="me-1 mb-1"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {formattedDate}
            </small>
            
            <div>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Visit bookmark</Tooltip>}
              >
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  href={bookmark.url} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="me-2"
                >
                  <i className="bi bi-box-arrow-up-right"></i>
                </Button>
              </OverlayTrigger>
              
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Delete bookmark</Tooltip>}
              >
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  aria-label="Delete bookmark"
                >
                  {isDeleting ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-trash"></i>
                  )}
                </Button>
              </OverlayTrigger>
            </div>
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