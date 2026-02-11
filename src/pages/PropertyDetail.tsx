import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, SquareCode, Calendar, Check, Phone, Send, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import PageLayout from '@/components/layout/PageLayout';
import { PropertyData } from '@/components/property/PropertyCard';
import { formatCurrency, generateWhatsAppLink } from '@/utils/format';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<(PropertyData & {
    description?: string | null;
    status?: 'Available' | 'Sold' | 'Pending' | null;
    listedDate?: string | null;
    propertySize?: string | null;
    contactPhone?: string | null;
    images: string[];
    features: string[];
  }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        
        const mockProperty = {
          id: id,
          title: 'Modern Apartment in Downtown',
          description: 'A beautiful and modern apartment located in the heart of the city. Comes with all the amenities you could ask for.',
          price: 1200000,
          location: 'Downtown, Cityville',
          category: 'finished' as const,
          imageUrl: 'https://via.placeholder.com/800x600.png?text=Property+Image+1',
          bedrooms: 3,
          bathrooms: 2,
          squareMeters: 150,
          status: 'Available' as const,
          listedDate: new Date().toISOString(),
          propertySize: '150 sqm',
          contactPhone: '+1234567890',
          images: [
            'https://via.placeholder.com/800x600.png?text=Property+Image+1',
            'https://via.placeholder.com/800x600.png?text=Property+Image+2',
            'https://via.placeholder.com/800x600.png?text=Property+Image+3',
          ],
          features: [
            'Swimming Pool',
            'Gymnasium',
            '24/7 Security',
            'Parking Garage',
            'Balcony',
            'Modern Kitchen'
          ],
        };

        setProperty(mockProperty);

      } catch (e) {
        console.error('Failed to load property', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <div className="section-container pt-32 pb-16">
          <PropertyDetailSkeleton />
        </div>
      </PageLayout>
    );
  }

  if (!property) {
    return (
      <PageLayout>
        <div className="section-container pt-32 pb-16">
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif font-medium mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/properties">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
              </Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const whatsappLink = generateWhatsAppLink(
    property.contactPhone,
    property.title,
    property.location
  );

  return (
    <PageLayout>
      <div className="section-container pt-32 pb-16">
        {/* Back button */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0 text-gray-600 hover:text-brand-red">
            <Link to="/properties" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Back to Properties
            </Link>
          </Button>
        </div>

        {/* Property header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 fade-in">
          <div>
            <Badge className="mb-4 bg-brand-red hover:bg-brand-red text-white border-none">
              {property.category === 'land' ? 'Land' : 
               property.category === 'carcass' ? 'Carcass' : 'Finished Building'}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">
              {property.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2 text-brand-red" />
              <span>{property.location}</span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="text-3xl font-serif font-medium text-brand-red">
              {formatCurrency(property.price)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Images and details */}
          <div className="lg:col-span-2">
            {/* Property images carousel */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-8 fade-in">
              <Carousel className="w-full">
                <CarouselContent>
                  {property.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        <img
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            {/* Tabs for details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden slide-up">
              <Tabs defaultValue="overview">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none h-auto p-0">
                    <TabsTrigger 
                      value="overview"
                      className="py-4 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="features"
                      className="py-4 px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand-red"
                    >
                      Features
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-serif font-medium mb-4">Description</h3>
                    <p className="text-gray-600">
                      {property.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h3 className="text-xl font-serif font-medium mb-4">Property Details</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center text-gray-600">
                          <Calendar className="h-5 w-5 mr-3 text-brand-red" />
                          <span>Listed: {new Date(property.listedDate).toLocaleDateString()}</span>
                        </li>
                        <li className="flex items-center text-gray-600">
                          <SquareCode className="h-5 w-5 mr-3 text-brand-red" />
                          <span>Property Size: {property.propertySize}</span>
                        </li>
                        
                        {property.category !== 'land' && (
                          <>
                            <li className="flex items-center text-gray-600">
                              <Bed className="h-5 w-5 mr-3 text-brand-red" />
                              <span>{property.bedrooms} Bedrooms</span>
                            </li>
                            <li className="flex items-center text-gray-600">
                              <Bath className="h-5 w-5 mr-3 text-brand-red" />
                              <span>{property.bathrooms} Bathrooms</span>
                            </li>
                          </>
                        )}
                        
                        <li className="flex items-start text-gray-600">
                          <Check className="h-5 w-5 mr-3 text-brand-red mt-0.5" />
                          <span>Status: <span className="text-green-600 font-medium">{property.status}</span></span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="hidden md:block">
                      <h3 className="text-xl font-serif font-medium mb-4">Contact</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-4">
                          <Phone className="h-5 w-5 mr-3 text-brand-red" />
                          <span className="text-gray-700">{property.contactPhone}</span>
                        </div>
                        <a 
                          href={whatsappLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                        >
                          <MessageSquare className="h-5 w-5" />
                          <span>WhatsApp Inquiry</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="p-6">
                  <h3 className="text-xl font-serif font-medium mb-4">Property Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 mr-2 text-brand-red mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right column: Contact form and similar properties */}
          <div className="space-y-8">
            {/* Contact card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 slide-up animate-delay-400">
              <h3 className="text-xl font-serif font-medium mb-4">Interested in this property?</h3>
              <p className="text-gray-600 mb-6">
                Contact our agent for more information or to schedule a viewing.
              </p>
              
              <div className="mb-6">
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
              
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Call us directly:</h4>
                  <a 
                    href={`tel:${property.contactPhone}`}
                    className="flex items-center text-brand-red"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {property.contactPhone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Send email:</h4>
                  <a 
                    href="mailto:ihomesafrica@gmail.com"
                    className="flex items-center text-brand-red"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Email Us
                  </a>
                </div>
              </div>
            </div>
            
            {/* CTA card */}
            <div className="bg-brand-red text-white rounded-lg shadow-md overflow-hidden p-6 slide-up animate-delay-600">
              <h3 className="text-xl font-serif font-medium mb-4">Looking for something else?</h3>
              <p className="text-white/90 mb-6">
                Browse our full range of properties or contact us with your specific requirements.
              </p>
              <div className="space-y-3">
                <Button asChild variant="outline" className="w-full bg-transparent text-white border-white hover:bg-white/10">
                  <Link to="/properties">Browse All Properties</Link>
                </Button>
                <Button asChild className="w-full bg-white text-brand-red hover:bg-white/90">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Skeleton loader for the property detail page
const PropertyDetailSkeleton = () => (
  <div>
    <div className="mb-6">
      <Skeleton className="h-10 w-32" />
    </div>
    
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8">
      <div>
        <Skeleton className="h-6 w-24 mb-4" />
        <Skeleton className="h-10 w-96 mb-2" />
        <Skeleton className="h-6 w-64 mb-4" />
      </div>
      <div className="mt-4 lg:mt-0">
        <Skeleton className="h-8 w-48" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Skeleton className="aspect-[16/9] w-full mb-8" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  </div>
);

export default PropertyDetail;
