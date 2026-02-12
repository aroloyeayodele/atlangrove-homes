import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminBlogs, deleteBlog } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const AdminBlogsPage = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                if (!token) throw new Error('Token not found');
                const data = await getAdminBlogs(token);
                setBlogs(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch blogs');
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                if (!token) throw new Error('Token not found');
                await deleteBlog(id, token);
                setBlogs(blogs.filter(blog => blog.id !== id));
            } catch (err: any) {
                setError(err.message || 'Failed to delete blog post');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading posts...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

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
