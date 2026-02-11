
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.login(email, password);
      // Assuming the API returns a token that we need to store
      if (response.token) {
        sessionStorage.setItem('authToken', response.token);
        toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
        navigate('/admin/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-center">Admin Login</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-red text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
