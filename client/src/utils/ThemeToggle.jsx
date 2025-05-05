import React from 'react';
import { Form } from 'react-bootstrap';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="theme-toggle d-flex align-items-center">
      <i className="bi bi-sun-fill me-2 text-warning"></i>
      <Form.Check 
        type="switch"
        id="theme-switch"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="theme-switch"
      />
      <i className="bi bi-moon-fill ms-2 text-primary"></i>
    </div>
  );
};

export default ThemeToggle;