// src/AdminPanel.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './admin.scss';
import { Button } from '@mui/material';


const links = [
  {
    name: 'Profile',
    path: '/admin'
  },
  {
    name: 'Blogs',
    path: '/blogs'
  },
  {
    name: 'Architectural projects',
    path: '/architect'
  },
  {
    name: 'IT posts',
    path: '/itblogs'
  }
]

const AdminPanel: React.FC = () => {
  const { logout, checkToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkToken()) {
      logout(); 
      navigate('/'); 
    }
  }, [logout, navigate, checkToken]);

  return (
    <div className='adminApp'>
      <div className="sidebar">
        <ul>
          {links.map((link) => (
            <li key={link.name}>
              <Link className='link' to={link.path}>{link.name}</Link>
            </li>
          ))}
          <Button variant="contained" style={{backgroundColor: '#39d4ba', margin: '10px'}} onClick={logout}>Logout</Button>
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
