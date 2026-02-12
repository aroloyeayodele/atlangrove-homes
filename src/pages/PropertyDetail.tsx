import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPropertyById, submitContactForm } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
            await submitContactForm({ ...formData, message: `Inquiry for ${property.name}: ${formData.message}` });
            toast({ title: 'Inquiry Sent', description: 'Thank you for your interest! We will get back to you shortly.' });
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            toast({ title: 'Error', description: 'Failed to send inquiry. Please try again later.', variant: 'destructive' });
        }
    };

    if (loading) return <div className="text-center py-10">Loading property details...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!property) return <div className="text-center py-10">Property not found.</div>;

    const images = property.images ? JSON.parse(property.images) : [];
    const features = property.features ? JSON.parse(property.features) : [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <img src={images[0]} alt={property.name} className="w-full h-auto rounded-lg shadow-lg mb-4" />
                    <div className="grid grid-cols-3 gap-2">
                        {images.slice(1).map((img: string, index: number) => (
                            <img key={index} src={img} alt={`${property.name} gallery ${index + 1}`} className="w-full h-auto rounded-lg shadow" />
                        ))}
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                    <p className="text-xl text-gray-600 mb-4">{property.address}</p>
                    <p className="text-3xl font-semibold text-green-600 mb-4">₦{property.price.toLocaleString()}</p>
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-3">Key Details</h2>
                        <div className="grid grid-cols-2 gap-4 text-lg">
                            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
                            <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
                            <p><strong>Type:</strong> <span className="capitalize">{property.property_type}</span></p>
                            <p><strong>Status:</strong> <span className="capitalize">{property.status}</span></p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-3">Description</h2>
                        <p>{property.description}</p>
                    </div>

                    {features.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-3">Features</h2>
                            <ul className="list-disc list-inside grid grid-cols-2 gap-2">
                                {features.map((feature: string, index: number) => <li key={index}>{feature}</li>)}
                            </ul>
                        </div>
                    )}
                    
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us About This Property</h2>
                        <form onSubmit={handleContactFormSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" required />
                                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" required />
                            </div>
                            <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Your Phone (Optional)" className="mb-4" />
                            <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your Message" required />
                            <Button type="submit" className="mt-4 w-full">Send Inquiry</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailPage;
