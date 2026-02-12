import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProperties, deleteProperty } from '../../services/api';
import { Button } from '@/components/ui/button';

const AdminPropertiesPage = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) throw new Error('Token not found');
                const data = await getAdminProperties(token);
                setProperties(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                const token = sessionStorage.getItem('authToken');
                if (!token) throw new Error('Token not found');
                await deleteProperty(id, token);
                setProperties(properties.filter(prop => prop.id !== id));
            } catch (err: any) {
                setError(err.message || 'Failed to delete property');
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading properties...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Properties</h1>
                <Button asChild>
                    <Link to="/admin/properties/new">Create New Property</Link>
                </Button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{property.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{property.address}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{property.price}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {property.status}
                                    </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Button asChild variant="outline" className="mr-2">
                                        <Link to={`/admin/properties/edit/${property.id}`}>Edit</Link>
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(property.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPropertiesPage;
