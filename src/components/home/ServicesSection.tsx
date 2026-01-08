import { Home, Search, Key, TrendingUp } from 'lucide-react';

const services = [
  {
    id: 'sell',
    title: 'We Sell',
    description: 'Find your dream property from our exclusive portfolio of premium real estate options across Nigeria. ',
    icon: Home,
    bgColor: 'bg-red-50',
    iconColor: 'text-brand-red',
  },
  {
    id: 'buy',
    title: 'We Buy',
    description: 'Looking to sell your property? We offer competitive valuations and a hassle-free selling experience.',
    icon: Search,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'rent',
    title: 'We Rent',
    description: 'Explore our selection of rental properties, from luxury apartments to commercial spaces.',
    icon: Key,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'invest',
    title: 'Investment Advisory',
    description: 'Make informed real estate investment decisions with our expert consultancy services.',
    icon: TrendingUp,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
            Our <span className="text-brand-red">Services</span>
          </h2>
          <p className="text-gray-600 slide-up animate-delay-200">
            Atlangrove Homes provides eco-friendly, comprehensive real estate solutions tailored to your needs,
            whether you're buying, selling, renting, or investing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all slide-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <div className={`${service.bgColor} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5`}>
                <service.icon className={`h-7 w-7 ${service.iconColor}`} />
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
