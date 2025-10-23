import { Sparkles, Users, ShieldCheck, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Sparkles,
    title: 'Excellence',
    description: 'We are committed to delivering exceptional service and results for every client.'
  },
  {
    icon: Users,
    title: 'Client-Centered',
    description: 'Your goals and satisfaction are at the heart of everything we do.'
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description: 'We operate with honesty, transparency, and ethical practices in all our dealings.'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We continuously adapt and improve to deliver the best real estate solutions.'
  }
];

const MissionSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column - Image */}
          <div className="relative slide-right">
            <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1527576539890-dfa815648363" 
                alt="iHomes Africa building"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="font-serif text-2xl md:text-3xl font-semibold">Our Story</div>
            </div>
            {/* Accent element */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-brand-red rounded-tl-3xl z-[-1]"></div>
          </div>

          {/* Right column - Content */}
          <div className="space-y-6 slide-up">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              Our <span className="text-brand-red">Mission</span>
            </h2>
            <p className="text-gray-600">
              Founded on principles of excellence and integrity, iHomes Africa has grown to become 
              a leading real estate firm in Nigeria. Our mission is to transform the real estate 
              experience through personalized service, market expertise, and innovative solutions.
            </p>
            <p className="text-gray-600">
              We are committed to helping our clients make informed decisions by providing transparent, 
              data-driven insights and guidance throughout their real estate journey.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {values.map((value, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="bg-red-50 rounded-lg p-3 h-fit">
                    <value.icon className="h-6 w-6 text-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
