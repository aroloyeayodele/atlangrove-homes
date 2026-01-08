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
            "name": "Atlangrove Heights",
            "url": "https://www.atlangrovehomes.com/",
            "logo": "/lovable-uploads/d8b82a03-78f9-4b90-ac43-39097201c852.png",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+234 806 655 8355",
              "contactType": "customer service",
              "email": "info@example.com"
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
              About <span className="text-brand-red">Atlangrove Homes</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              ATLANGROVE HOMES was created on February 25, 2021 to provide quality and affordable accommodation to Nigerians who desire and deserve to live in a decent and comfortable environment.
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

      {/* Vision & Mission Section (Vision first) */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-600">To be catalysts for transformative experiences — crafting not just homes but narratives of lives well lived, creating enduring value and belonging.</p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">To provide quality and affordable accommodation while redefining possibilities in real estate with integrity, professionalism, and innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Atlangrove Narrative & USPs */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Who We Are</h2>
              <p className="text-gray-600 mb-4">
                Welcome to a vision where Atlangrove Homes Limited is not just a real estate endeavour but also a journey to turn aspirations into addressable realities.
              </p>
              <p className="text-gray-600">
                The organisation was created by competent and professional realtors, estate agencies well trained and recognized by the Nigeria Institute of Estate Surveyors and Valuers.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold mb-4">Unique Selling Propositions</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Affordability</li>
                <li>Genuine Certificate of Occupancy</li>
                <li>Security</li>
                <li>Comfort</li>
              </ul>
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
                  title="Atlangrove Homes Abuja Office Location"
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-medium mb-2">Abuja Office</h3>
                <p className="text-gray-600">Suite FF037, AICL Neighbourhood Shopping Centre, Garki Area 3, Abuja</p>
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
                  title="Lagos Office Location"
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

      {/* Leadership Section */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-8">Leadership</h2>
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-semibold">Bishop Israel Morakinyo — Chairman</h3>
                <p className="text-gray-700 mt-2">
                  A titan in real estate management with 25 years of entrepreneurial impact in Nigeria. Distinguished fellow of several professional bodies and the first African indigenous ordained Bishop in the State of Israel. Presiding Bishop of Family Altar Assembly International (US) and Chairman at Step Synergy. Currently Chairman of Atlangrove Homes Ltd., shaping the industry while mentoring youths and emerging leaders.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Mr. Ayodele O. Aroloye — Managing Director/CEO</h3>
                <p className="text-gray-700 mt-2">
                  Serial entrepreneur, inventor, and administrator with two decades of experience across manufacturing and multiple boards. Background in Industrial Mathematics; experience with NCR & Associates Limited, NNAR, and ESVARBON. Founder and CEO of Atlangrove Engineering and Homes Ltd., leading with innovation and excellence.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Ayomikun Fred Bulu — Chief Administrative Officer</h3>
                <p className="text-gray-700 mt-2">
                  Dynamic CAO with 5+ years post-university experience across business development, IMC, publishing, and training. Provides research, startup guidance, operations advisory, and brand equity building. Business & Strategic Development Consultant to Atlangrove Engineering and Homes Ltd., driving impactful growth across Africa.
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

