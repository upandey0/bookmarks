import { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import api from '../api/apiClient.js'; 
import { useAuth } from '../context/AuthContext'; 

const BookmarkForm = ({ addBookmark }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth(); 
 
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    if (!token) {
      setError('You must be logged in to add bookmarks');
      return;
    }
   
    // Simple URL validation
    if (!url.trim().startsWith('http')) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }
   
    setLoading(true);
    setError('');
   
    try {
      const res = await api.post('/api/bookmarks', { url });
      addBookmark(res.data.data);
      setUrl('');
    } catch (err) {
      console.error('Bookmark error:', err);
      setError(err.response?.data?.error || 'Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Add New Bookmark</h5>
       
        <Form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
         
          <Row className="g-2">
            <Col xs={12} md={9}>
              <Form.Control
                type="text"
                placeholder="Enter URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                required
              />
            </Col>
            <Col xs={12} md={3}>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-100"
              >
                {loading ? 'Saving...' : 'Save Link'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BookmarkForm;