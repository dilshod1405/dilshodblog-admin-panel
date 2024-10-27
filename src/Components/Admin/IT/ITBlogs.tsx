import AdminPanel from '../Admin'
import './itblogs.scss'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

interface ITPost {
    id: string;
    title: string;
    picture: string;
    description: string;
}

const ITBlogs: React.FC = () => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [ITPosts, setITPosts] = useState<ITPost[]>([]);
    const [formData, setFormData] = useState({ title: '', description: '', picture: null });
    const [posts, setPosts] = useState<Record<string, any>>({});
    const [id, setEditingPost] = useState<ITPost | null>(null); // For handling the post being edited

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.picture) data.append('picture', formData.picture);
    
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('http://127.0.0.1:8000/it/it-post/', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setITPosts(prev => [...prev, response.data]); // Add the new post to state
            setFormData({ title: '', description: '', picture: null }); // Reset form
        } catch (err) {
            console.error('Create architectural post error:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };


    useEffect(() => {
        const fetchArchitecturalPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/it/it-post/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Architectural posts:', response.data);
                
                setITPosts(response.data);
            } catch (err) {
                console.error('Fetch architectural posts error:', err);
            }
        };
    
        fetchArchitecturalPosts();
    }, []);



    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://127.0.0.1:8000/it/it-post/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setSuccessMessage('Successfully deleted the blog post!');
            setPosts(posts.filter((post: Record<string, any>) => post.id !== id));
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setError(`Error: ${err.response.status}`);
            } else {
                setError('Failed to delete the blog post. Please try again.');
            }
            console.error('Delete error:', err);
        }
    };


    const handleUpdate = async (id: string) => {
        if (!id) return; // Ensure editingPost is defined
    
        const updatedData = new FormData();
        updatedData.append('title', formData.title);
        updatedData.append('description', formData.description);
    
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No access token found');
            return; // Exit if token is not available
        }
    
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/it/it-post/${id}/`,
                updatedData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
    
            // Update local posts state to reflect the changes immediately
            setPosts(prevPosts =>
                prevPosts.map((post: Record<string, any>) =>
                    post.id === id ? { ...post, ...response.data } : post
                )
            );
    
            console.log('Update response:', response.data);
    
            // Optionally reset editing state and form data
            setEditingPost(null);
            setFormData({ title: '', description: '', picture: null });
        } catch (err: any) {
            console.error('Update error:', err.response?.data || err.message);
        }
    };

    return (
      <div className='itblog'>
        <AdminPanel />
        <div className="content">
          <h1>IT Blogs</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder='Description'/>
                <input type="file" name="picture" onChange={handleChange} />
                <Button variant="contained" type="submit">Add Post</Button>
            </form>

            
        </div>
      </div>
    )
  }

  export default ITBlogs;