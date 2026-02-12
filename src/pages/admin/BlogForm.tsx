import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminBlogById, createBlog, updateBlog, uploadImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    if (!token) throw new Error('Token not found');
                    const data = await getAdminBlogById(id, token);
                    setTitle(data.title);
                    setContent(data.content);
                    setStatus(data.status);
                    setImageUrl(data.image_url);
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch blog post');
                }
            };
            fetchBlog();
        }
    }, [id, token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!token) throw new Error('Token not found');
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const uploadResponse = await uploadImage(imageFile, token);
                finalImageUrl = `/media/${uploadResponse.key}`;
            }

            const blogData = { title, content, status, image_url: finalImageUrl };

            if (id) {
                await updateBlog(id, blogData, token);
            } else {
                await createBlog(blogData, token);
            }

            navigate('/admin/blogs');
        } catch (err: any) {
            setError(err.message || 'Failed to save blog post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Blog Post</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Title</label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Content</label>
                    <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Featured Image</label>
                    <Input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="mb-2" />
                    {imageUrl && !imageFile && <img src={imageUrl} alt="Featured" className="w-32 h-32 object-cover" />}
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Post'}</Button>
            </form>
        </div>
    );
};

export default BlogForm;
