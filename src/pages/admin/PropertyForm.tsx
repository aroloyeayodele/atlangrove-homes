import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminPropertyById, createProperty, updateProperty, uploadImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [status, setStatus] = useState('available');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProperty = async () => {
                try {
                    if (!token) throw new Error('Token not found');
                    const data = await getAdminPropertyById(id, token);
                    setName(data.name);
                    setAddress(data.address);
                    setPrice(data.price.toString());
                    setBedrooms(data.bedrooms.toString());
                    setBathrooms(data.bathrooms.toString());
                    setPropertyType(data.property_type);
                    setStatus(data.status);
                    setDescription(data.description);
                    setFeatures(JSON.parse(data.features || '[]'));
                    setImages(JSON.parse(data.images || '[]'));
                } catch (err: any) {
                    setError(err.message || 'Failed to fetch property');
                }
            };
            fetchProperty();
        }
    }, [id, token]);

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const addFeature = () => setFeatures([...features, '']);
    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

    const handleImageUpload = async (files: FileList | null) => {
        if (files) {
            setImageFiles(Array.from(files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!token) throw new Error('Token not found');
            let uploadedImageUrls = [...images];

            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(file => uploadImage(file, token));
                const responses = await Promise.all(uploadPromises);
                uploadedImageUrls.push(...responses.map(res => `/media/${res.key}`));
            }

            const propertyData = {
                name,
                address,
                price: parseFloat(price),
                bedrooms: parseInt(bedrooms),
                bathrooms: parseInt(bathrooms),
                property_type: propertyType,
                status,
                description,
                features,
                images: uploadedImageUrls,
            };

            if (id) {
                await updateProperty(id, propertyData, token);
            } else {
                await createProperty(propertyData, token);
            }

            navigate('/admin/properties');
        } catch (err: any) {
            setError(err.message || 'Failed to save property');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Property</h1>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                {/* Form fields for property details */}
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Property'}</Button>
            </form>
        </div>
    );
};

export default PropertyForm;
