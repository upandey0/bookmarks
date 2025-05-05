import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
 
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <i className="bi bi-bookmark-heart-fill me-2"></i>
          Link Saver
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {user ? (
            <Nav className="align-items-center">
              <Nav.Item className="d-none d-md-block me-3 text-white">
                <i className="bi bi-person-circle me-2"></i>
                {user.email}
              </Nav.Item>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </Button>
            </Nav>
          ) : (
            <Nav>
              <Button
                as={Link}
                to="/login"
                variant="outline-light"
                className="me-2"
              >
                Login
              </Button>
              <Button
                as={Link}
                to="/register"
                variant="light"
                className="text-primary"
              >
                Sign Up
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;