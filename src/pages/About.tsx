import PageLayout from '@/components/layout/PageLayout';
import MissionSection from '@/components/about/MissionSection';
import TeamSection from '@/components/about/TeamSection';
import CtaSection from '@/components/home/CtaSection';

const About = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 slide-up">
              About <span className="text-brand-red">iHomes Africa</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              We are a leading real estate company in Africa, dedicated to providing exceptional 
              property solutions and personalized service to our clients.
            </p>
          </div>
        </div>
      </section>

      <MissionSection />
      <TeamSection />

      {/* Vision Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6 slide-up">
              <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
                Our <span className="text-brand-red">Vision</span>
              </h2>
              <p className="text-gray-600">
                Our vision at iHomes Africa is to be the most trusted and innovative real estate 
                company in Africa, known for our integrity, expertise, and commitment to client satisfaction.
              </p>
              <p className="text-gray-600">
                We aim to transform the real estate landscape by setting new standards of excellence 
                in property development, sales, and advisory services. Through our innovative approach 
                and deep market knowledge, we strive to create exceptional value for our clients and 
                contribute to the sustainable development of communities across Nigeria.
              </p>
              <p className="text-gray-600">
                With a focus on long-term relationships and continuous improvement, we are committed 
                to being your trusted partner on your real estate journey.
              </p>
            </div>
            
            <div className="order-1 md:order-2 slide-up animate-delay-400">
              <div className="relative">
                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                    alt="Modern Building" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-brand-red rounded-tl-3xl z-[-1]"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-200 rounded-br-3xl z-[-1]"></div>
              </div>
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
              <div className="aspect-video overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15767.303325681223!2d7.47244!3d9.0761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b1a26736b4d%3A0xf2af578b0d9b992c!2sWuse%20II%2C%20Abuja!5e0!3m2!1sen!2sng!4v1695903213789!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="iHomes Africa Abuja Office Location"
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
              <div className="aspect-video overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15856.605109766984!2d3.4142!3d6.4300!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53aec4dd92d%3A0x5e34fe6a84cdcd80!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1695903350123!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="iHomes Africa Lagos Office Location"
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

      <CtaSection />
    </PageLayout>
  );
};

export default About;
