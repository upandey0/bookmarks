import React from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../utils/ThemeToggle';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="bi bi-bookmark-star-fill me-2"></i>
            BookmarkHub
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav>
            <Nav className="d-flex align-items-center">
              <ThemeToggle />
              {user && (
                <>
                  <div className="d-flex align-items-center me-3">
                    <div className="user-avatar me-2">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="d-none d-md-inline text-light">
                      {user.email}
                    </span>
                  </div>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="main-content">
        {children}
      </main>

      <footer className="py-4 mt-5 border-top" style={{backgroundColor: 'var(--footer-bg)', color: 'var(--footer-color)'}}>
        <Container className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} BookmarkHub. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  );
};

export default Layout;