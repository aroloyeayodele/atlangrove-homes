
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PropertyGrid from '@/components/property/PropertyGrid';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getFeaturedProperties } from '@/services/propertyService';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Fallback properties data for when API is unavailable
const fallbackProperties = [
  {
    id: '1',
    title: 'CommonWealth City',
    location: 'Karshi, Nansarawa',
    price: 450000000,
    category: 'finished' as const,
    bedrooms: 5,
    bathrooms: 6,
    squareMeters: 650,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  },
  {
    id: '2',
    title: "King's COurt Waru",
    location: 'Waru, Abuja',
    price: 125000000,
    category: 'Land' as const,
    bedrooms: 3,
    bathrooms: 3,
    squareMeters: 180,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  },
  {
    id: '3',
    title: 'One Million Dollar View',
    location: 'Guzape Abuja',
    price: 200000000,
    category: 'commercial' as const,
    bedrooms: 0,
    bathrooms: 4,
    squareMeters: 350,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
  },
];

const FeaturedProperties = () => {
  const { toast } = useToast();
  
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['featuredProperties'],
    queryFn: getFeaturedProperties,
    retry: 1, // Only retry once
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use fallback data when there's an error or no data
  const displayProperties = error || properties.length === 0 ? fallbackProperties : properties;

  // Handle errors with an effect but don't show toast for API errors in production
  useEffect(() => {
    if (error) {
      console.log('Using fallback properties due to API unavailability');
      // Only show toast in development
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: 'Using sample data',
          description: 'API is unavailable, showing sample properties.',
          variant: 'default',
        });
      }
    }
  }, [error, toast]);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4 slide-up">
              Featured <span className="text-brand-red">Properties</span>
            </h2>
            <p className="text-gray-600 max-w-2xl slide-up animate-delay-200">
              Explore our curated selection of premium properties located in prime areas across Nigeria.
              From luxury apartments to commercial spaces, we have something for everyone.
            </p>
          </div>
          <Button asChild variant="ghost" className="slide-up animate-delay-400">
            <Link to="/properties" className="flex items-center font-medium">
              View All Properties <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-brand-red animate-spin" />
            <span className="ml-2 text-gray-500">Loading properties...</span>
          </div>
        ) : (
          <div className="slide-up animate-delay-400">
            <PropertyGrid properties={displayProperties} loading={false} />
            {error && process.env.NODE_ENV === 'development' && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Development Notice</AlertTitle>
                <AlertDescription>
                  API is currently unavailable. Showing sample properties for demonstration.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
