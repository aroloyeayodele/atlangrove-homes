import { Shield, TrendingUp, Award, Heart, Leaf } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We conduct business with transparency, accountability and ethical practices.'
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We embrace forward-thinking design, smart technologies and sustainable building practices.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for the highest standards in construction, design and customer satisfaction.'
  },
  {
    icon: Heart,
    title: 'Customer-Centricity',
    description: 'We place our clients at the center of every decision, ensuring their needs and preferences guide our developments.'
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We are committed to environmentally responsible development that protects and preserves resources for future generations.'
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
            {/* Accent  element */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-brand-blue rounded-tl-3xl z-[-1]"></div>
          </div>

          {/* Right   column   - Content  yes*/}
          <div className="space-y-6 slide-up">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6">
              Our <span className="text-brand-blue">Mission</span>
            </h2>
            <p className="text-gray-600">
              To build vibrant and sustainable communities that enhance the lives of residents and contribute positively to the broader urban landscape.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex space-x-4">
                <div className="bg-red-50 rounded-lg p-3 h-fit">
                  <Award className="h-6 w-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6">Our Vision</h3>
                  <p className="text-gray-600 mb-8">
                    To be recognized as a leading force in real estate development—where quality, design and trust come together to create exceptional living experiences.
                  </p>
                  <h3 className="text-2xl font-semibold mb-6">Core Values</h3>
                  {values.map((value, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-medium text-lg mb-1">{value.title}</h3>
                      <p className="text-gray-600 text-sm">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
