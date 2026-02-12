import { useState, useEffect } from 'react';
import { getInquiries } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const InquiriesPage = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const data = await getInquiries(token);
                setInquiries(data || []);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch inquiries');
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, [token]);

    if (loading) {
        return <div className="text-center py-10">Loading inquiries...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">View Inquiries</h1>
            
            {inquiries.length === 0 ? (
                <p>No inquiries found.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(inquiry.submitted_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{inquiry.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{inquiry.email}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{inquiry.phone || 'N/A'}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{inquiry.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InquiriesPage;
