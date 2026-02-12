import { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertiesPage = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState('all');

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                const data = await getProperties(category);
                setProperties(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [category]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Our Properties</h1>
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="carcass">Carcass</SelectItem>
                        <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading && <div className="text-center py-10">Loading...</div>}
            {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <Card key={property.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <Link to={`/properties/${property.id}`}>
                                <img src={property.images && JSON.parse(property.images)[0]} alt={property.name} className="w-full h-56 object-cover" />
                                <CardHeader>
                                    <CardTitle className="text-xl">{property.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700">{property.address}</p>
                                    <p className="text-lg font-semibold mt-2">₦{property.price.toLocaleString()}</p>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;
