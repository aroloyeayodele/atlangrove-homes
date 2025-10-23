
import PageLayout from '@/components/layout/PageLayout';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import MapSection from '@/components/contact/MapSection';

const Contact = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6 slide-up">
              Contact <span className="text-brand-red">Us</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 slide-up animate-delay-200">
              We'd love to hear from you. Get in touch with our team for any inquiries 
              about our properties or services.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-12 bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="slide-up">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
            
            {/* Contact Info */}
            <div className="slide-up animate-delay-400">
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <MapSection />
    </PageLayout>
  );
};

export default Contact;
