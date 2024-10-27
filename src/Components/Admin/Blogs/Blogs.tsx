import React, { useState, useEffect } from 'react'
import './blogs.scss'
import AdminPanel from '../Admin'
import { Button } from '@mui/material';
import axios from 'axios';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    photo: string;
}

const Blogs: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [posts, setPosts] = useState<Record<string, any>>({});
    const [id, setEditingPost] = useState<BlogPost | null>(null); // For handling the post being edited
    const [formData, setFormData] = useState<{ title: string; content: string; photo?: File | null }>({
        title: '',
        content: '',
        photo: null,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, content: event.target.value });
      };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, title: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (file) {
            formData.append('photo', file);
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://127.0.0.1:8000/blogs/poster/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // Include the token here
                },
            });
            console.log('Success:', response.data);
            setSuccessMessage('Successfully added new blog post!');
        } catch (err) {
            setError('Failed to upload data. Please try again.');
            console.error('Upload error:', err);
        }
    };


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/blogs/poster/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(response.data);
            } catch (err) {
                console.error('Fetch posts error:', err);
            }
        };
    
        fetchPosts();
    }, []);
    

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`http://127.0.0.1:8000/blogs/poster/${id}/`, {
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


    const handleUpdate = async () => {
        if (!id) return; // Ensure editingPost is defined
    
        const updatedData = new FormData();
        updatedData.append('title', formData.title);
        updatedData.append('content', formData.content);
    
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.error('No access token found');
            return; // Exit if token is not available
        }
    
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/blogs/poster/${id}/`,
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
                    post.id === id.id ? { ...post, ...response.data } : post
                )
            );
    
            console.log('Update response:', response.data);
    
            // Optionally reset editing state and form data
            setEditingPost(null);
            setFormData({ title: '', content: '', photo: null });
        } catch (err: any) {
            console.error('Update error:', err.response?.data || err.message);
        }
    };
    
    

    return (
      <div className='blogs'>
        <AdminPanel />
        <div className="content">
          <h1>Blogs</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

          <form className="inputs" onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} value={title}/>
            <input type="text" placeholder="Content" onChange={(e) => setContent(e.target.value)} value={content}/>
            <input type="file" placeholder="Image" onChange={handleFileChange}/>
            <Button variant="contained" type="submit">Submit</Button>
          </form>

          <div className="deleter">
                <ul>
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map(post => (
                            <li key={post.id}>
                                <h2>{post.id} - {post.title}</h2>
                                <button onClick={() => handleDelete(post.id)}>Delete</button>
                                <button onClick={() => setEditingPost(post.id)}>Edit</button>
                            </li>
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </ul>

                {id && (
            <form style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }} onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Title"
                />
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Content"
                />
                <button type="submit">Update Post</button>
            </form>
        )}
          </div>
        </div>
      </div>
    )
  }

export default Blogs;
