
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/format';
import { useState } from 'react';

export interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  category: 'land' | 'carcass' | 'finished';
  imageUrl: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number; // Sqm
}

interface PropertyCardProps {
  property: PropertyData;
  className?: string;
}

const PropertyCard = ({ property, className }: PropertyCardProps) => {
  const [imgSrc, setImgSrc] = useState(property.imageUrl);
  const categoryLabel = {
    land: 'Land',
    carcass: 'Carcass',
    finished: 'Finished'
  };

  return (
    <Link 
      to={`/properties/${property.id}`} 
      className={`property-card group ${className}`}
    >
      <div className="relative overflow-hidden rounded-t-lg aspect-[4/3]">
        <img 
          src={imgSrc || ''} 
          alt={property.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgSrc('https://placehold.co/800x600?text=No+Image')}
        />
        <div className="absolute top-4 left-4">
          <Badge 
            className="bg-brand-blue/90 hover:bg-brand-blue text-white border-none font-medium"
          >
            {categoryLabel[property.category]}
          </Badge>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-serif text-lg font-medium line-clamp-1 group-hover:text-brand-blue transition-colors">
          {property.title}
        </h3>
        <p className="text-brand-blue font-medium">
          {formatCurrency(property.price)}
        </p>
        <div className="flex items-center text-brand-gray">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        {/* Show room info only for carcass and finished properties */}
        {(property.category === 'carcass' || property.category === 'finished') && (
          <div className="flex items-center space-x-4 pt-2 text-sm border-t border-gray-100">
            {property.bedrooms && (
              <div className="text-gray-600">
                <span className="font-medium">{property.bedrooms}</span> Beds
              </div>
            )}
            {property.bathrooms && (
              <div className="text-gray-600">
                <span className="font-medium">{property.bathrooms}</span> Baths
              </div>
            )}
            {property.size && (
              <div className="text-gray-600">
                <span className="font-medium">{property.size}</span> Sqm
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default PropertyCard;
