import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 bg-brand-blue relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-20 right-[10%] w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute bottom-10 left-[15%] w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 slide-up">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-white/90 mb-8 text-lg slide-up animate-delay-200">
            Whether you're looking to buy, sell, or invest, our expert team is ready to guide you through every step of your real estate journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 slide-up animate-delay-400">
            <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-white/90">
              <Link to="/properties">
                Explore Properties
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-brand-blue bg-white hover:bg-white/90 border-white">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
