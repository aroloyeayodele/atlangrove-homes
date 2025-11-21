import PageLayout from '@/components/layout/PageLayout';
import MissionSection from '@/components/about/MissionSection';
import TeamSection from '@/components/about/TeamSection';
import CtaSection from '@/components/home/CtaSection';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>About Exclusive Estates | Premium Real Estate in Africa</title>
        <meta name="description" content="Learn about Exclusive Estates, Africa's leading luxury real estate brand. Discover our story, vision, mission, values, and team." />
        <meta name="keywords" content="Exclusive Estates, luxury homes, premium real estate, Nigeria, Africa, property sales, smart homes, secure estates" />
        <meta property="og:title" content="About Exclusive Estates" />
        <meta property="og:description" content="Discover the story, vision, and values of Exclusive Estates, Africa's trusted luxury real estate brand." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.jpg" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Exclusive Estates",
            "url": "https://exclusive-estates.vercel.app/",
            "logo": "/lovable-uploads/d8b82a03-78f9-4b90-ac43-39097201c852.png",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+234 123 456 7890",
              "contactType": "customer service",
              "email": "info@exclusiveestates.com"
            }],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Victoria Island",
              "addressLocality": "Lagos",
              "addressCountry": "Nigeria"
            }
          }
        `}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 slide-up">
              About <span className="text-brand-red">Exclusive Estates</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              Exclusive Estates is a premium-living brand delivering thoughtfully designed homes, secure estates, and elevated lifestyle experiences across Africa.<br />
              As a distinguished brand under iHomes Africa, we combine decades of real estate expertise with contemporary design excellence to create residential spaces that define luxury living.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-100">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">Our Story</h2>
            <p className="text-gray-600">A journey of excellence in premium real estate</p>
          </div>
          <div className="grid gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2013</strong>
              <h3 className="font-semibold mt-2">Founding</h3>
              <p className="text-gray-600">iHomes Africa established with a vision to transform African real estate</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2016</strong>
              <h3 className="font-semibold mt-2">Growth</h3>
              <p className="text-gray-600">Expanded portfolio across multiple African countries</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2020</strong>
              <h3 className="font-semibold mt-2">Integration</h3>
              <p className="text-gray-600">Launch of Exclusive Estates as premium luxury brand</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2023</strong>
              <h3 className="font-semibold mt-2">Expansion</h3>
              <p className="text-gray-600">Pan-African network with 50+ premium properties</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2025</strong>
              <h3 className="font-semibold mt-2">Vision</h3>
              <p className="text-gray-600">Leading Africa’s luxury residential transformation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section (Vision first) */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-600">To redefine premium living across Africa through excellence in design, smart solutions, and superior customer experience.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">Deliver luxury homes crafted with integrity, innovation, and uncompromising quality that elevate the African residential experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">Our Values</h2>
            <p className="text-gray-600">Principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <span className="inline-block mb-2 rounded-full bg-green-100 p-2"><img src="/icons/integrity.svg" alt="Integrity icon" className="h-8 w-8 text-green-600" /></span>
              <h3 className="font-semibold mb-2 text-green-700">Integrity</h3>
              <p className="text-gray-600 text-sm">Transparent and honest in every transaction</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <span className="inline-block mb-2 rounded-full bg-yellow-100 p-2"><img src="/icons/excellence.svg" alt="Excellence icon" className="h-8 w-8 text-yellow-600" /></span>
              <h3 className="font-semibold mb-2 text-yellow-700">Excellence</h3>
              <p className="text-gray-600 text-sm">Uncompromising quality standards</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <span className="inline-block mb-2 rounded-full bg-blue-100 p-2"><img src="/icons/professionalism.svg" alt="Professionalism icon" className="h-8 w-8 text-blue-600" /></span>
              <h3 className="font-semibold mb-2 text-blue-700">Professionalism</h3>
              <p className="text-gray-600 text-sm">Expert guidance and service</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <span className="inline-block mb-2 rounded-full bg-purple-100 p-2"><img src="/icons/innovation.svg" alt="Innovation icon" className="h-8 w-8 text-purple-600" /></span>
              <h3 className="font-semibold mb-2 text-purple-700">Innovation</h3>
              <p className="text-gray-600 text-sm">Embracing smart solutions</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <span className="inline-block mb-2 rounded-full bg-pink-100 p-2"><img src="/icons/customer.svg" alt="Customer-Centricity icon" className="h-8 w-8 text-pink-600" /></span>
              <h3 className="font-semibold mb-2 text-pink-700">Customer-Centricity</h3>
              <p className="text-gray-600 text-sm">Your satisfaction is our priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
              Our <span className="text-brand-red">Locations</span>
            </h2>
            <p className="text-gray-600 slide-up animate-delay-200">
              With offices in key Nigerian cities, we're positioned to serve clients 
              nationwide with local expertise and personalized attention.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all slide-up">
              <div className="w-full" style={{ height: '320px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15767.303325681223!2d7.47244!3d9.0761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b1a26736b4d%3A0xf2af578b0d9b992c!2sWuse%20II%2C%20Abuja!5e0!3m2!1sen!2sng!4v1695903213789!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Exclusive Estates Abuja Office Location"
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-2">Abuja Office</h3>
                <p className="text-gray-600">
                  Wuse 2, Abuja, Nigeria
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all slide-up animate-delay-200">
              <div className="w-full" style={{ height: '320px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15856.605109766984!2d3.4142!3d6.4300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53aec4dd92d%3A0x5e34fe6a84cdcd80!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1695903350123!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Exclusive Estates Lagos Office Location"
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-2">Lagos Office</h3>
                <p className="text-gray-600">
                  Victoria Island, Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TeamSection />
      <CtaSection />
    </PageLayout>
  );
};

export default About;
