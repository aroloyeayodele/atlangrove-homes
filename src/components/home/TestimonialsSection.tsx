import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Samuel Johnson',
    role: 'Property Investor',
  content: 'Exclusive Estates guided me through the entire process of acquiring investment property in Lagos. Their market knowledge and professionalism are unmatched.',
    avatar: '',
  },
  {
    id: 2,
    name: 'Amina Ibrahim',
    role: 'First-time Homebuyer',
  content: 'As a first-time buyer, I was nervous about the process, but the team at Exclusive Estates made everything simple and transparent. I couldn\'t be happier with my new home!',
    avatar: '',
  },
  {
    id: 3,
    name: 'Chidi Okonkwo',
    role: 'Property Developer',
  content: 'Working with Exclusive Estates has significantly expanded our development portfolio. Their consulting services and market insights have been invaluable to our success.',
    avatar: '',
  },
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const intervalRef = useRef<number | null>(null);

  const nextTestimonial = () => {
    setSlideDirection('right');
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setSlideDirection('left');
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Auto rotate testimonials
    intervalRef.current = window.setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset animation after each transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setSlideDirection(null);
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
            Client <span className="text-brand-red">Testimonials</span>
          </h2>
          <p className="text-gray-600 slide-up animate-delay-200">
            Hear what our clients have to say about their experience working with Exclusive Estates.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 slide-up animate-delay-400">
          <div className="relative bg-white rounded-lg p-8 md:p-10 shadow-lg border border-gray-100">
            <Quote className="absolute top-8 left-8 text-brand-red opacity-10 w-16 h-16" />
            
            <div className="text-center relative z-10">
              <div className="overflow-hidden h-32">
                <div 
                  className={cn(
                    "transition-all duration-500",
                    slideDirection === 'right' ? 'translate-x-[100%] opacity-0' : 
                    slideDirection === 'left' ? '-translate-x-[100%] opacity-0' : 
                    'translate-x-0 opacity-100'
                  )}
                >
                  <blockquote className="text-xl md:text-2xl font-serif text-gray-800 italic mb-8">
                    "{testimonials[activeIndex].content}"
                  </blockquote>
                </div>
              </div>

              <div className="mt-6 inline-flex flex-col items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-red mb-3">
                  <img 
                    src={testimonials[activeIndex].avatar} 
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonials[activeIndex].name}</h4>
                  <p className="text-gray-500 text-sm">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === idx ? 'bg-brand-red scale-110' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-brand-red transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-brand-red transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
