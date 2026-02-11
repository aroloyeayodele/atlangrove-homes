
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// These types can be moved to a shared `types.ts` file later
type Category = 'land' | 'carcass' | 'finished';

type Property = {
  id: string;
  title: string;
  price: number;
  location: string;
  category: Category;
  image_url?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_meters?: number | null;
  created_at?: string;
  // These will be populated by the backend
  gallery?: { id: number; url: string; }[];
  features?: { id: number; feature: string; }[];
};

const emptyForm: Omit<Property, 'id' | 'created_at' | 'gallery' | 'features'> = {
  title: '',
  price: 0,
  location: '',
  category: 'finished',
  image_url: '',
  bedrooms: null,
  bathrooms: null,
  square_meters: null,
};

const PropertiesAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // State for related items (gallery, features)
  const [gallery, setGallery] = useState<{ id: number; url: string; }[]>([]);
  const [features, setFeatures] = useState<{ id: number; feature: string; }[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const categories = useMemo(() => ['land', 'carcass', 'finished'] as Category[], []);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (!token) {
      toast({ title: 'Unauthorized', description: 'Please log in to continue.', variant: 'destructive' });
      navigate('/admin');
      return;
    }
    setAuthToken(token);
    refresh(token);
  }, [navigate, toast]);

  const refresh = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminProperties(token);
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: 'Could not fetch properties.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['price', 'bedrooms', 'bathrooms', 'square_meters'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value as any }));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
    setGallery([]);
    setFeatures([]);
    setNewFeature('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setSaving(true);
    setError(null);

    try {
      let uploadedUrl = form.image_url;
      if (file) {
        toast({ title: 'Uploading Image...', description: 'Please wait.' });
        const uploadResponse = await api.uploadImage(file, authToken);
        uploadedUrl = uploadResponse.url; // Assuming API returns { url: '...' }
        toast({ title: 'Upload Successful', description: 'Image has been uploaded.' });
      }

      const propertyData = { ...form, image_url: uploadedUrl };

      if (editingId) {
        await api.updateProperty(editingId, propertyData, authToken);
        toast({ title: 'Saved', description: 'Property updated successfully' });
      } else {
        await api.createProperty(propertyData, authToken);
        toast({ title: 'Created', description: 'Property added successfully' });
      }
      resetForm();
      await refresh(authToken);
    } catch (err: any) {
      const errMsg = err.message || 'Failed to save property';
      setError(errMsg);
      toast({ title: 'Error', description: errMsg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Property) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: p.price,
      location: p.location,
      category: p.category,
      image_url: p.image_url || '',
      bedrooms: p.bedrooms ?? null,
      bathrooms: p.bathrooms ?? null,
      square_meters: p.square_meters ?? null,
    });
    setGallery(p.gallery || []);
    setFeatures(p.features || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!authToken || !confirm('Delete this property? This cannot be undone.')) return;
    try {
      await api.deleteProperty(id, authToken);
      toast({ title: 'Deleted', description: 'Property removed' });
      if (editingId === id) {
        resetForm();
      }
      await refresh(authToken);
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // Note: Full Gallery and Feature management will require dedicated API endpoints.
  const handleDummyAction = () => {
      toast({ title: 'Coming Soon', description: 'This feature will be enabled once the backend is complete.' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-serif font-semibold">Manage Properties</h1>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
        </div>

        {/* Form -- UI is the same */}
        <form onSubmit={handleSave} className="rounded-xl border bg-white p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-medium mb-4 border-b pb-3">{editingId ? 'Edit Property' : 'Add New Property'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Title</label>
              <input name="title" value={form.title} onChange={onChange} required className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Price</label>
              <input name="price" type="number" min={0} value={form.price} onChange={onChange} required className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Location</label>
              <input name="location" value={form.location} onChange={onChange} required className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Category</label>
              <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red">
                {categories.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700">Primary Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-red/10 file:text-brand-red hover:file:bg-brand-red/20"
              />
              {editingId && form.image_url && !file && (
                <p className="text-xs text-gray-500 mt-1">Current image is set. Uploading a new one will replace it.</p>
              )}
            </div>
            <div>
              <label className="text-sm text-gray-700">Bedrooms</label>
              <input name="bedrooms" type="number" min={0} value={form.bedrooms ?? ''} onChange={onChange} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Bathrooms</label>
              <input name="bathrooms" type="number" min={0} value={form.bathrooms ?? ''} onChange={onChange} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div>
              <label className="text-sm text-gray-700">Square Meters</label>
              <input name="square_meters" type="number" min={0} value={form.square_meters ?? ''} onChange={onChange} className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <div className="mt-4 flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button type="submit" disabled={saving || !authToken} className="bg-brand-red hover:bg-brand-red/90 text-white">
              {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Add Property')}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        {/* Property List Table -- UI is the same */}
        <div className="rounded-xl border bg-white overflow-x-auto">
          <table className="min-w-full text-sm">
             <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Location</th>
                <th className="p-3 font-medium">Beds</th>
                <th className="p-3 font-medium">Baths</th>
                <th className="p-3 font-medium">m²</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={8}>Loading properties...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={8}>No properties found. Add one above to get started.</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 align-top">
                      <div className="font-medium line-clamp-2 max-w-[260px]">{p.title}</div>
                    </td>
                    <td className="p-3 align-top capitalize">{p.category}</td>
                    <td className="p-3 align-top">{new Intl.NumberFormat('en-NG',{ style:'currency', currency:'NGN'}).format(p.price)}</td>
                    <td className="p-3 align-top">{p.location}</td>
                    <td className="p-3 align-top">{p.bedrooms ?? '-'}</td>
                    <td className="p-3 align-top">{p.bathrooms ?? '-'}</td>
                    <td className="p-3 align-top">{p.square_meters ?? '-'}</td>
                    <td className="p-3 align-top">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Gallery & Features placeholders */}
        {editingId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">Gallery Images</h2>
                <Button size="sm" variant="outline" onClick={handleDummyAction}>+ Add Image</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gallery.length > 0 ? gallery.map(g => (
                  <div key={g.id} className="relative group border rounded overflow-hidden">
                    <img src={g.url} alt="Gallery" className="aspect-[4/3] w-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button size="sm" variant="destructive" className="opacity-0 group-hover:opacity-100" onClick={handleDummyAction}>Delete</Button>
                    </div>
                  </div>
                )) : <p className="text-sm text-gray-500 col-span-full">No gallery images yet.</p>}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <h2 className="font-medium mb-3">Features</h2>
              <div className="flex gap-2 mb-4">
                <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="e.g., Private swimming pool" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
                <Button onClick={handleDummyAction} className="bg-brand-red hover:bg-brand-red/90 text-white">Add</Button>
              </div>
              {features.length > 0 ? (
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f.id} className="flex items-center justify-between border rounded px-3 py-2 bg-gray-50">
                      <span>{f.feature}</span>
                      <Button size="sm" variant="ghost" onClick={handleDummyAction}>Remove</Button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500">No features have been added.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesAdmin;
