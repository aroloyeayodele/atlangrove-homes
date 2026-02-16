import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminBlogById, createBlog, updateBlog, uploadImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";

const BlogForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [imageUrl, setImageUrl] = useState('');
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
                    };
                    const data = await getAdminBlogById(id, token);
                    setTitle(data.title);
                    setContent(data.content);
                    setStatus(data.status);
                    setImageUrl(data.image_url);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "You must be logged in to save a blog post.",
                });
                setLoading(false);
                return;
            };
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const uploadResponse = await uploadImage(imageFile, token);
                finalImageUrl = `/media/${uploadResponse.key}`;
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
                    <Input type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} className="mb-2" />
                    {imageUrl && !imageFile && <img src={imageUrl} alt="Featured" className="w-32 h-32 object-cover" />}
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Post'}</Button>
            </form>
        </div>
    );
};

export default BlogForm;