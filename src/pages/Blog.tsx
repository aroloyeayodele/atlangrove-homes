
import PageLayout from '@/components/layout/PageLayout';
import { Helmet } from 'react-helmet';
import BlogGrid from '@/components/blog/BlogGrid';

const Blog = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>Blog | Atlangrove Homes</title>
        <meta name="description" content="Read the latest articles and updates from Atlangrove Homes." />
      </Helmet>

      <section className="pt-32 pb-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 slide-up">
              Our <span className="text-brand-blue">Blog</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              Stay up-to-date with the latest news, insights, and stories from the Atlangrove Homes team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="section-container">
          <BlogGrid />
        </div>
      </section>
    </PageLayout>
  );
};

export default Blog;
