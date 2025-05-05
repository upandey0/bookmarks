import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Card, Button } from 'react-bootstrap';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkCard from '../components/BookmarkCard';
import api from '../api/apiClient';

const Home = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/api/bookmarks');
        
        let bookmarksData;
        
        if (res.data.data) {
          // Response format: { data: [...bookmarks] }
          bookmarksData = res.data.data;
        } else if (Array.isArray(res.data)) {
          // Response format: [...bookmarks]
          bookmarksData = res.data;
        } else if (typeof res.data === 'object' && res.data !== null) {
          
          bookmarksData = Array.isArray(res.data.bookmarks) ? res.data.bookmarks : [res.data];
        } else {
          bookmarksData = [];
        }
        
        setBookmarks(Array.isArray(bookmarksData) ? bookmarksData : []);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to fetch bookmarks. Please try again.');
      } finally {
        setLoading(false);
      }
    };
   
    fetchBookmarks();
  }, []);

  const addBookmark = (bookmark) => {
    setBookmarks([bookmark, ...bookmarks]);
  };

  const deleteBookmark = async (id) => {
    try {
      await api.delete(`/api/bookmarks/${id}`);
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark. Please try again.');
     
      // Auto-hide error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">My Bookmarks</h1>
        <p className="lead text-secondary">Save and organize your favorite links in one place</p>
      </div>
     
      <BookmarkForm addBookmark={addBookmark} />
     
      {error && (
        <Alert 
          variant="danger" 
          className="mb-4 shadow-sm" 
          dismissible 
          onClose={() => setError('')}
        >
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}
     
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading your bookmarks...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm bg-light">
          <Card.Body>
            <div className="display-1 text-primary mb-3">
              <i className="bi bi-bookmark-plus"></i>
            </div>
            <h3 className="mb-3">No bookmarks yet</h3>
            <p className="text-muted mb-4">
              Start building your collection by adding your first bookmark using the form above!
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsFormVisible(true)}
              className="px-4"
            >
              Add Your First Bookmark
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {bookmarks.map(bookmark => (
            <Col key={bookmark._id}>
              <BookmarkCard
                bookmark={bookmark}
                onDelete={deleteBookmark}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Home;