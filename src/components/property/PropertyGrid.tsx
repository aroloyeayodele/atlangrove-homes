
import { useState, useEffect } from 'react';
import PropertyCard, { PropertyData } from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyGridProps {
  properties: PropertyData[];
  loading?: boolean;
}

const PropertyGrid = ({ properties, loading = false }: PropertyGridProps) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Generate loading skeletons
  const renderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, index) => (
        <div key={`skeleton-${index}`} className="property-card">
          <div className="rounded-t-lg aspect-[4/3] overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {isLoading
        ? renderSkeletons()
        : Array.isArray(properties) && properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
      
      {!isLoading && (!Array.isArray(properties) || properties.length === 0) && (
        <div className="col-span-full text-center py-10">
          <h3 className="text-xl font-serif font-medium text-gray-700">No properties found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
