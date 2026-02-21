import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBlogs, deleteBlog } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"

const AdminBlogsPage = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) {
                    toast({
                        variant: "destructive",
                        title: "Authentication Error",
                        description: "You must be logged in to view this page.",
                    });
                    setLoading(false);
                    return;
                };
                const data = await getAdminBlogs(token);
                setBlogs(data || []);
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Failed to fetch blogs",
                    description: err.message || "An unexpected error occurred.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [toast]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token){
                    toast({
                        variant: "destructive",
                        title: "Authentication Error",
                        description: "Action failed.",
                    });
                    return;
                };
                await deleteBlog(id, token);
                setBlogs(blogs.filter(blog => blog.id !== id));
                toast({
                    title: "Blog post deleted",
                    description: "The blog post has been successfully deleted.",
                });
            } catch (err: any) {
                toast({
                    variant: "destructive",
                    title: "Failed to delete blog post",
                    description: err.message || 'An unexpected error occurred.',
                });
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading posts...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
                <Button asChild>
                    <Link to="/admin/blogs/new">Create New Post</Link>
                </Button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{blog.title}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {blog.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Button asChild variant="outline" className="mr-2">
                                        <Link to={`/admin/blogs/edit/${blog.id}`}>Edit</Link>
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(blog.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogsPage;
