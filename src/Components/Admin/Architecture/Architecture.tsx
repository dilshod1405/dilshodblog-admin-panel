import './architecture.scss'
import AdminPanel from '../Admin'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button } from '@mui/material';

interface ArchitecturalPost  {
        id: string;
        title: string;
        file: string;
        pic: string;
    }

const Architecture: React.FC = () => {
    const [architecturalPosts, setArchitecturalPosts] = useState<ArchitecturalPost[]>([]);
    const [formData, setFormData] = useState({ title: '', file: null, pic: null });

    useEffect(() => {
        const fetchArchitecturalPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/architecture/architect/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Architectural posts:', response.data);
                
                setArchitecturalPosts(response.data);
            } catch (err) {
                console.error('Fetch architectural posts error:', err);
            }
        };
    
        fetchArchitecturalPosts();
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        if (formData.file) data.append('file', formData.file);
        if (formData.pic) data.append('pic', formData.pic);
    
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('http://127.0.0.1:8000/architecture/architect/', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setArchitecturalPosts(prev => [...prev, response.data]); // Add the new post to state
            setFormData({ title: '', file: null, pic: null }); // Reset form
        } catch (err) {
            console.error('Create architectural post error:', err);
        }
    };



    const handleUpdate = async (id: string) => {
        const data = new FormData();
        // Only append fields that you want to update
        data.append('title', formData.title);
    
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.put(`http://127.0.0.1:8000/architecture/architect/${id}/`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setArchitecturalPosts(prev =>
                prev.map(post => (post.id === id ? { ...post, ...response.data } : post))
            );
        } catch (err) {
            console.error('Update architectural post error:', err);
        }
    };

    

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.delete(`http://127.0.0.1:8000/architecture/architect/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setArchitecturalPosts(prev => prev.filter(post => post.id !== id));
        } catch (err) {
            console.error('Delete architectural post error:', err);
        }
    };

    

    return (
      <div className='archi'>
        <AdminPanel />
        
          <div>
          <h1>Architectural Posts</h1>
          <form onSubmit={handleSubmit}>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                <input type="file" name="file" onChange={handleChange} />
                <input type="file" name="pic" onChange={handleChange} />
                <button type="submit">Add Post</button>
            </form>
            <div className='posts'>
            {Array.isArray(architecturalPosts) && architecturalPosts.map(post => (
                    <div key={post.id}>
                        <h2>{post.id} - {post.title}</h2>
                        <a href={post.file} target="_blank" rel="noopener noreferrer">View File</a>
                        <img src={post.pic} alt="" />
                        <Button variant="contained" onClick={() => handleUpdate(post.id)}>Edit</Button>
                        <Button variant="contained" onClick={() => handleDelete(post.id)}>Delete</Button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    )
  }

export default Architecture