// src/Login.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import './login.scss'
import { Container, TextField, Button } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate-token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
  
      // Save token to local storage
      if (access && refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
    } else {
        throw new Error('Tokens not returned from the server');
    }
  
      // Call login to update context state
      login();
  
      // Navigate to the admin panel
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err); // Log the error for debugging
      setError('username yoki parol xato');
    }
  };
  

  return (
    <div className='login'>
        <div className="content">
            <Container fixed >
                <AssignmentIndIcon style={{ fontSize: 70, color: '#39d4ba' }}/>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                    <TextField style={{borderBottom: 'solid 2px #39d4ba'}} id="standard-basic" label="username" variant="standard" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div>
                    <TextField style={{borderBottom: 'solid 2px #39d4ba'}} id="standard-password-input" label="Password" type="password" autoComplete="current-password" variant="standard" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <Button variant="contained" type='submit'>Login</Button>
                    {error && <p style={{ color: '#39d4ba', textAlign: 'center', marginTop: '15px' }}>{error}</p>}
                </form>
            </Container>
      </div>
    </div>
  );
};

export default Login;
