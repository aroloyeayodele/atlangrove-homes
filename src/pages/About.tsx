import PageLayout from '@/components/layout/PageLayout';
import MissionSection from '@/components/about/MissionSection';
import TeamSection from '@/components/about/TeamSection';
import CtaSection from '@/components/home/CtaSection';
import { Helmet } from 'react-helmet';

const About = () => {
  return (
    <PageLayout>
      <Helmet>
        <title>About Atlangrove Homes | Quality Real Estate in Nigeria</title>
        <meta name="description" content="Learn about Atlangrove Homes — providing quality and affordable accommodation, crafting homes and transformative experiences across Nigeria." />
        <meta name="keywords" content="Atlangrove Homes, real estate, Nigeria, Abuja, affordable homes, secure estates" />
        <meta property="og:title" content="About Atlangrove Homes" />
        <meta property="og:description" content="Atlangrove Homes creates quality, affordable homes and transformative living experiences across Nigeria." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/preview.jpg" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Atlangrove Homes",
            "url": "https://www.atlangrovehomes.com/",
            "logo": "/lovable-uploads/d8b82a03-78f9-4b90-ac43-39097201c852.png",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+234 806 655 8355",
              "contactType": "customer service",
              "email": "info@atlangrovehomes.com"
            }],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Suite FF037, AICL Neighbourhood Shopping Centre, Garki Area 3",
              "addressLocality": "Abuja",
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
              About <span className="text-brand-red">Us</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              Atlangrove Homes is a premier real estate development company dedicated to creating high-quality residential communities that blend modern living with timeless design. Founded with a vision to redefine the standards of urban and suburban living, Atlangrove Homes has earned a reputation for Excellence, Innovation and Integrity in the real estate sector.
              <br /><br />
              We specialize in the development of Master-planned communities, Luxury Homes and Sustainable Housing solutions that reflect the evolving needs of today's homeowners. Each of our project is a testament to our commitment in Architectural Excellence, Smart planning and Lasting value.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-100">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">Our Story</h2>
            <p className="text-gray-600">A journey of excellence in real estate and community building</p>
          </div>
          <div className="grid gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">2021</strong>
              <h3 className="font-semibold mt-2">Founding</h3>
              <p className="text-gray-600">Atlangrove Homes was established, led by competent and professional realtors accredited by the Nigeria Institute of Estate Surveyors and Valuers.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">Vision</strong>
              <h3 className="font-semibold mt-2">Transformative Living</h3>
              <p className="text-gray-600">We aspire to be catalysts for transformative experiences, crafting not just homes but narratives of lives well lived.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">Mission</strong>
              <h3 className="font-semibold mt-2">Creating Value</h3>
              <p className="text-gray-600">Redefining the landscape of possibilities by creating enduring value and fostering a sense of belonging.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <strong className="text-brand-red text-xl">Focus</strong>
              <h3 className="font-semibold mt-2">Quality & Affordability</h3>
              <p className="text-gray-600">World-class housing emphasizing affordability, comfort, security, and genuine Certificate of Occupancy (C of O).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & USPs */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-semibold mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brand-red mb-3">Integrity</h3>
                <p className="text-gray-600">We conduct business with transparency, accountability and ethical practices.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brand-red mb-3">Innovation</h3>
                <p className="text-gray-600">We embrace forward-thinking design, smart technologies and sustainable building practices.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brand-red mb-3">Excellence</h3>
                <p className="text-gray-600">We strive for the highest standards in construction, design and customer satisfaction.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brand-red mb-3">Customer-Centricity</h3>
                <p className="text-gray-600">We place our clients at the center of every decision, ensuring their needs and preferences guide our developments.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg md:col-span-2 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h3l-4 4-4-4h3V1h2v6zm-1 4v6h-2v-6H3l4-4 4 4h-3v2h2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-brand-red mb-3">Sustainability</h3>
                <p className="text-gray-600">We are committed to environmentally responsible development that protects and preserves resources for future generations.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-center">Why Choose Atlangrove Homes?</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 max-w-2xl mx-auto">
                <li>Affordability without compromising quality</li>
                <li>Genuine Certificate of Occupancy</li>
                <li>Secure and well-planned communities</li>
                <li>Modern, comfortable living spaces</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <TeamSection />
      
      {/* Location Section */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Our <span className="text-brand-red">Location</span>
            </h2>
            <p className="text-gray-600">
              Visit our office in Abuja for personalized service and expert advice on your real estate needs.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="w-full" style={{ height: '320px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15767.303325681223!2d7.47244!3d9.0761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b1a26736b4d%3A0xf2af578b0d9b992c!2sWuse%20II%2C%20Abuja!5e0!3m2!1sen!2sng!4v1695903213789!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Atlangrove Homes Abuja Office Location"
                  className="w-full h-full"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-serif font-medium mb-2">Head Office</h3>
                <p className="text-gray-600">Suite FF037, AICL Neighbourhood Shopping Centre,<br />Garki Area 3, Abuja, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaSection />
    </PageLayout>
  );
};

export default About;

