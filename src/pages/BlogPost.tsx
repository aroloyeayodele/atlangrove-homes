import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet';
import { getBlogById } from '@/services/api';
import { IBlog } from '@/services/propertyService';
import { format } from 'date-fns';
import ShareButtons from '@/components/blog/ShareButtons';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const response = await getBlogById(id);
        setPost(response); // Corrected this line
      } catch (err) {
        setError('Failed to fetch blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center py-10">Post not found.</div>;
  }

  const postUrl = window.location.href;

  return (
    <PageLayout>
      <Helmet>
        <title>{post.title} | Atlangrove Homes</title>
        <meta name="description" content={post.summary} />
      </Helmet>

      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6 hover:bg-gray-100">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
            <ShareButtons url={postUrl} title={post.title} />
          </div>
          <img src={post.image} alt={post.title} className="w-full h-auto rounded-lg mb-8" />
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </PageLayout>
  );
};

export default BlogPost;
