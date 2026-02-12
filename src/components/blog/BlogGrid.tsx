import { useState, useEffect } from 'react';
import { getAllBlogs } from '@/services/api';
import { IBlog } from '@/services/propertyService';
import BlogCard from './BlogCard';

const BlogGrid = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        if (Array.isArray(response)) {
          setBlogs(response);
        } else {
          // Set blogs to an empty array if the response is not an array
          setBlogs([]); 
        }
      } catch (err) { 
        setError('Failed to fetch blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.isArray(blogs) && blogs.length > 0 ? (
        blogs.map((post) => <BlogCard key={post._id} post={post} />)
      ) : (
        <div>No blog posts found.</div>
      )}
    </div>
  );
};

export default BlogGrid;
