import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminBlogById, createBlog, updateBlog, uploadImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');

    // State for the image preview URL (can be absolute or a local blob URL)
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    
    // State for the relative image URL to be saved to the database
    const [imageDbUrl, setImageDbUrl] = useState<string | null>(null);
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    if (!token) {
                        toast({
                            variant: "destructive",
                            title: "Authentication Error",
                            description: "You must be logged in to perform this action.",
                        });
                        return;
                    }
                    const data = await getAdminBlogById(id, token);
                    setTitle(data.title);
                    setContent(data.content);
                    setStatus(data.status);

                    // When we fetch the data, the backend provides an absolute URL for display
                    if (data.imageUrl) {
                        setImagePreviewUrl(data.imageUrl);

                        // We must extract the relative path to be stored for submission
                        // This prevents re-saving an absolute URL back into the DB
                        try {
                            const url = new URL(data.imageUrl);
                            setImageDbUrl(url.pathname); 
                        } catch (e) {
                             // If it's already a relative path, use it as is
                            setImageDbUrl(data.imageUrl);
                        }
                    }
                } catch (err: any) {
                    toast({
                        variant: "destructive",
                        title: "Failed to fetch blog post",
                        description: err.message || 'An unexpected error occurred.',
                    });
                }
            };
            fetchBlog();
        }
    }, [id, token, toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImageFile(file);
            // Create a temporary local URL for an immediate preview of the new image
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!token) {
                // ... (auth check)
                return;
            }

            // This is the key change: start with the existing database URL.
            let finalImageUrl = imageDbUrl;

            // If a new file was chosen, upload it and get its new relative URL.
            if (imageFile) {
                const uploadResponse = await uploadImage(imageFile, token);
                finalImageUrl = uploadResponse.url; // This URL is relative, e.g., /api/serve-media/...
            }

            const blogData = { title, content, status, image_url: finalImageUrl };

            if (id) {
                await updateBlog(id, blogData, token);
                toast({
                    title: "Blog post updated",
                    description: "The blog post has been successfully updated.",
                });
            } else {
                await createBlog(blogData, token);
                toast({
                    title: "Blog post created",
                    description: "The blog post has been successfully created.",
                });
            }

            navigate('/admin/blogs');
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Failed to save blog post",
                description: err.message || 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Blog Post</h1>
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
                    <Input type="file" onChange={handleFileChange} className="mb-2" />
                    {imagePreviewUrl && (
                        <div className="mt-2">
                            <img src={imagePreviewUrl} alt="Image Preview" className="w-48 h-48 object-cover rounded-md" />
                        </div>
                    )}
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Post'}</Button>
            </form>
        </div>
    );
};

export default BlogForm;
