import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyById, submitContactForm } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const PropertyDetailPage = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [property, setProperty] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                if (!id) throw new Error('Property ID not found');
                const data = await getPropertyById(id);
                setProperty(data);
            } catch (err: any) {
                console.error('Fetch property error:', err);
                setError(err.message || 'Failed to fetch property details');
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitContactForm({ ...formData, message: `Inquiry for ${property?.title || property?.name}: ${formData.message}` });
            toast({ title: 'Inquiry Sent', description: 'Thank you for your interest! We will get back to you shortly.' });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to send inquiry. Please try again later.', variant: 'destructive' });
        }
    };

    if (loading) return (
        <PageLayout>
            <div className="pt-32 pb-16 text-center">Loading property details...</div>
        </PageLayout>
    );

    if (error || !property) return (
        <PageLayout>
            <div className="pt-32 pb-16 text-center">
                <p className="text-red-500 mb-4">{error || 'Property not found'}</p>
                <Button asChild variant="outline">
                    <Link to="/properties"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties</Link>
                </Button>
            </div>
        </PageLayout>
    );

    // Safe parsing helpers
    const safeParse = (val: any) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        try {
            return JSON.parse(val);
        } catch (e) {
            console.error('SafeParse error:', e);
            return [];
        }
    };

    const images = safeParse(property.images);
    const features = safeParse(property.features);
    const displayTitle = property.title || property.name || 'Untitled Property';
    const displayPrice = property.price ? `₦${property.price.toLocaleString()}` : 'Price on request';

    return (
        <PageLayout>
            <div className="pt-32 pb-16 container mx-auto px-4">
                <Button asChild variant="ghost" className="mb-6 hover:bg-gray-100">
                    <Link to="/properties">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                            <img
                                src={images[0] || '/placeholder.svg'}
                                alt={displayTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {images.slice(1, 4).map((img: string, index: number) => (
                                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-sm border border-gray-100">
                                    <img src={img} alt={`${displayTitle} gallery ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{displayTitle}</h1>
                            <div className="flex items-center text-gray-500 text-lg">
                                <MapPin className="mr-2 h-5 w-5 text-brand-blue" />
                                {property.address || property.location}
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-brand-blue">
                            {displayPrice}
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100">
                            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                <Bed className="h-6 w-6 text-brand-blue mb-1" />
                                <span className="font-semibold">{property.bedrooms || 0}</span>
                                <span className="text-xs text-gray-500">Bedrooms</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                <Bath className="h-6 w-6 text-brand-blue mb-1" />
                                <span className="font-semibold">{property.bathrooms || 0}</span>
                                <span className="text-xs text-gray-500">Bathrooms</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                                <Maximize className="h-6 w-6 text-brand-blue mb-1" />
                                <span className="font-semibold">{property.size || '--'}</span>
                                <span className="text-xs text-gray-500">Sqm</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-serif font-semibold">Description</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {property.description || 'No description available for this property.'}
                            </p>
                        </div>

                        {features.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-serif font-semibold">Top Features</h2>
                                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                                    {features.map((feature: string, index: number) => (
                                        <li key={index} className="flex items-center text-gray-600">
                                            <div className="w-2 h-2 rounded-full bg-brand-blue mr-2"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm mt-8">
                            <h2 className="text-2xl font-serif font-semibold mb-6">Inquire About This Property</h2>
                            <form onSubmit={handleContactFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="I'm interested in this property..." required className="min-h-[120px]" />
                                </div>
                                <Button type="submit" className="w-full py-6 text-lg bg-brand-blue hover:bg-brand-blue-dark">
                                    Send Inquiry
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default PropertyDetailPage;
