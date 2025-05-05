import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get first letter of email for avatar
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">BookmarkHub</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {user && (
              <Nav>
                <Dropdown align="end">
                  <Dropdown.Toggle as="div" className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar">
                        {userInitial}
                      </div>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="mt-2 shadow">
                    <Dropdown.Item disabled>
                      Signed in as <strong>{user.email}</strong>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      Sign out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main content */}
      <main className="flex-grow-1 py-4">
        <Container>
          {children}
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 mt-auto">
        <Container>
          <p className="text-center text-muted mb-0">
            BookmarkHub &copy; {new Date().getFullYear()}
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;