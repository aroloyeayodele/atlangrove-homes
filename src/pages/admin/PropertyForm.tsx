import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminPropertyById, createProperty, updateProperty, uploadImage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [bedrooms, setBedrooms] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [status, setStatus] = useState('available');
    const [description, setDescription] = useState('');
    const [features, setFeatures] = useState<string[]>([]);
    
    // State for image display URLs (absolute or local blobs)
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    // State for relative image URLs to be saved to DB
    const [imageDbUrls, setImageDbUrls] = useState<string[]>([]);
    // State for new image files to be uploaded
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

    const [loading, setLoading] = useState(false);

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
                    setFeatures(data.features || []);
                    
                    const absoluteUrls = data.images || [];
                    setImagePreviewUrls(absoluteUrls);

                    const relativeUrls = absoluteUrls.map((url: string) => {
                        try {
                            return new URL(url).pathname;
                        } catch (e) {
                            return url; // It might already be a relative path
                        }
                    });
                    setImageDbUrls(relativeUrls);

                } catch (err: any) {
                    toast({ variant: "destructive", title: "Failed to fetch property", description: err.message });
                }
            };
            fetchProperty();
        }
    }, [id, token, toast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length > 0) {
            setNewImageFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setImagePreviewUrls(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const urlToRemove = imagePreviewUrls[index];

        // Remove from preview
        setImagePreviewUrls(current => current.filter((_, i) => i !== index));

        // Check if it was a newly added file (blob URL) or an existing DB URL
        if (urlToRemove.startsWith('blob:')) {
            // It's a new file, find its index in the newImageFiles array to remove it
            // This is a simplification; a more robust solution would map blob URLs to files
        } else {
            // It's an existing image, remove it from the list to be saved
            setImageDbUrls(current => current.filter(dbUrl => !urlToRemove.includes(dbUrl)));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!token) throw new Error('Authentication Token not found');

            let finalImageDbUrls = [...imageDbUrls];

            if (newImageFiles.length > 0) {
                const uploadPromises = newImageFiles.map(file => uploadImage(file, token));
                const responses = await Promise.all(uploadPromises);
                const newRelativeUrls = responses.map(res => res.url);
                finalImageDbUrls.push(...newRelativeUrls);
            }

            const propertyData = {
                name, address, status, description,
                price: parseFloat(price),
                bedrooms: parseInt(bedrooms),
                bathrooms: parseInt(bathrooms),
                property_type: propertyType,
                features: JSON.stringify(features),
                images: JSON.stringify(finalImageDbUrls),
            };

            if (id) {
                await updateProperty(id, propertyData, token);
                toast({ title: "Property updated successfully" });
            } else {
                await createProperty(propertyData, token);
                toast({ title: "Property created successfully" });
            }
            navigate('/admin/properties');

        } catch (err: any) {
            toast({ variant: "destructive", title: "Failed to save property", description: err.message });
        } finally {
            setLoading(false);
        }
    };
    
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };
    const addFeature = () => setFeatures([...features, '']);
    const removeFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{id ? 'Edit' : 'Create'} Property</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">

                {/* Text Fields */}
                <Input placeholder="Property Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
                <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />

                {/* Numeric and Select Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input type="number" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
                    <Input type="number" placeholder="Bedrooms" value={bedrooms} onChange={e => setBedrooms(e.target.value)} required />
                    <Input type="number" placeholder="Bathrooms" value={bathrooms} onChange={e => setBathrooms(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={propertyType} onValueChange={setPropertyType} required>
                        <SelectTrigger><SelectValue placeholder="Select Property Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={status} onValueChange={setStatus} required>
                        <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic Features */}
                <div>
                    <label className="font-bold">Features</label>
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <Input value={feature} onChange={e => handleFeatureChange(index, e.target.value)} placeholder={`Feature ${index + 1}`} />
                            <Button type="button" variant="destructive" onClick={() => removeFeature(index)}>Remove</Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2">Add Feature</Button>
                </div>

                {/* Image Upload and Preview */}
                <div>
                    <label className="font-bold">Images</label>
                    <Input type="file" multiple onChange={handleFileChange} className="mb-2" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                        {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-md" />
                                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">{loading ? 'Saving...' : 'Save Property'}</Button>
            </form>
        </div>
    );
};

export default PropertyForm;
