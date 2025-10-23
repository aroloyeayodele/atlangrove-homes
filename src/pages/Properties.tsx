
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PropertyGrid from '@/components/property/PropertyGrid';
import PropertyFilter from '@/components/property/PropertyFilter';
import { PropertyData } from '@/components/property/PropertyCard';
import { getAllProperties } from '@/services/propertyService';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

const Properties = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'all';
  
  const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
  const [filters, setFilters] = useState({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 500000000,
  });

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties', filters.category],
    queryFn: () => getAllProperties(filters.category !== 'all' ? filters.category : undefined),
  });

  // Handle errors with an effect
  useEffect(() => {
    if (error) {
      console.error('Failed to fetch properties:', error);
      toast({
        title: 'Error fetching properties',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (properties.length) {
      // Apply price filters
      const filtered = properties.filter(
        (property) =>
          property.price >= filters.minPrice && property.price <= filters.maxPrice
      );
      
      setFilteredProperties(filtered);
    }
  }, [properties, filters]);

  const handleFilterChange = (newFilters: {
    category: string;
    minPrice: number;
    maxPrice: number;
  }) => {
    // Update URL query params
    const params = new URLSearchParams();
    if (newFilters.category !== 'all') {
      params.set('category', newFilters.category);
    }
    navigate({ search: params.toString() }, { replace: true });
    
    setFilters(newFilters);
  };

  return (
    <PageLayout>
      <section className="pt-28 pb-16 bg-gray-50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4 slide-up">
              Our <span className="text-brand-red">Properties</span>
            </h1>
            <p className="text-gray-600 slide-up animate-delay-200">
              Explore our extensive portfolio of premium properties across Nigeria. 
              Whether you're looking to buy land, a carcass, or a finished building, 
              we have the perfect option for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar filter */}
            <div className="slide-right">
              <PropertyFilter 
                onFilterChange={handleFilterChange} 
                activeCategory={initialCategory}
              />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 slide-up animate-delay-400">
              <PropertyGrid 
                properties={filteredProperties} 
                loading={isLoading} 
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Properties;
