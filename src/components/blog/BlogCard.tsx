import { Link } from 'react-router-dom';
import { IBlog } from '@/services/propertyService';
import { format } from 'date-fns';

const BlogCard = ({ post }: { post: IBlog }) => {
  return (
    <Link to={`/blog/${post._id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-2">{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</p>
        <h3 className="text-xl font-semibold mb-3 font-serif">{post.title}</h3>
        <p className="text-gray-600 line-clamp-3">{post.summary}</p>
        <div className="mt-4">
          <span className="text-brand-red font-medium hover:underline">Read More</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
