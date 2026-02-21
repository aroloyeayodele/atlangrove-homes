import { Home, Search, Key, TrendingUp } from 'lucide-react';

const services = [
  {
    id: 'residential',
    title: 'Residential Development',
    description: 'High-quality residential communities that blend modern living with timeless design and architectural excellence.',
    icon: Home,
    bgColor: 'bg-red-50',
    iconColor: 'text-brand-blue',
  },
  {
    id: 'master-planned',
    title: 'Master-Planned Communities',
    description: 'Thoughtfully designed communities that offer a complete living experience with amenities and green spaces.',
    icon: Search,
    bgColor: 'bg-blue-50',
    iconColor: 'text-brand-blue',
  },
  {
    id: 'luxury-homes',
    title: 'Luxury Homes',
    description: 'Exquisite homes featuring premium finishes, smart technologies, and exceptional craftsmanship.',
    icon: Key,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'sustainable',
    title: 'Sustainable Housing',
    description: 'Eco-friendly homes designed with sustainable materials and energy-efficient technologies.',
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
            Our <span className="text-brand-blue">Services</span>
          </h2>
          <p className="text-gray-600 slide-up animate-delay-200">
            Atlangrove Homes specializes in creating high-quality residential communities that blend modern living with timeless design. 
            Our services reflect our commitment to excellence, innovation, and sustainable development.
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
