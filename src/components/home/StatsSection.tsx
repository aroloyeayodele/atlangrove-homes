import { Home, Map, Users, Award } from 'lucide-react';

const stats = [
  {
    id: 'properties',
    title: 'Properties',
    value: '500+',
    description: 'Premium listings across Nigeria',
    icon: Home,
    color: 'text-brand-red',
  },
  {
    id: 'locations',
    title: 'Locations',
    value: '20+',
    description: 'Prime cities and neighborhoods',
    icon: Map,
    color: 'text-blue-600',
  },
  {
    id: 'clients',
    title: 'Happy Clients',
    value: '1,200+',
    description: 'Successful transactions',
    icon: Users,
    color: 'text-amber-600',
  },
  {
    id: 'experience',
    title: 'Experience',
    value: '15+ Years',
    description: 'In the Nigerian real estate market',
    icon: Award,
    color: 'text-green-600',
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
            Our <span className="text-brand-red">Impact</span>
          </h2>
          <p className="text-gray-600 slide-up animate-delay-200 mb-8">
            Atlangrove Homes has been a trusted name in Nigerian real estate, 
            delivering exceptional results for our clients across the country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.id}
              className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all slide-up"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="mx-auto mb-4 flex items-center justify-center">
                <stat.icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              <h3 className="text-3xl font-serif font-medium mb-2">{stat.value}</h3>
              <h4 className="text-lg font-medium mb-2">{stat.title}</h4>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
