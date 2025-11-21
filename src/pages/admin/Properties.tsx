import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
};

const emptyForm: Omit<Property, 'id'> = {
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
  const [form, setForm] = useState<Omit<Property, 'id'>>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ id: number; url: string; sort_order: number }[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [features, setFeatures] = useState<{ id: number; feature: string; sort_order: number }[]>([]);

  const categories = useMemo(() => ['land','carcass','finished'] as Category[], []);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/admin');
        return;
      }
      setUserId(data.user.id);
      await refresh();
    };
    init();
  }, [navigate]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    setItems((data as Property[]) || []);
    setLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as any;
    if (['price','bedrooms','bathrooms','square_meters'].includes(name)) {
      setForm((prev) => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    } else if (name === 'category') {
      setForm((prev) => ({ ...prev, [name]: value as Category }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFile(null);
  };

  const uploadImageIfNeeded = async (): Promise<string | null> => {
    if (!file) return form.image_url || null;
    if (!userId) throw new Error('No user session. Please sign in again.');
    const fileExt = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}.${fileExt}`;
    const { error: upErr } = await supabase.storage
      .from('property-images')
      .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type });
    if (upErr) throw upErr;
    const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
    return pub?.publicUrl ?? null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const uploadedUrl = await uploadImageIfNeeded();
      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update({
            title: form.title,
            price: form.price,
            location: form.location,
            category: form.category,
            image_url: uploadedUrl,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            square_meters: form.square_meters,
          })
          .eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Saved', description: 'Property updated successfully' });
      } else {
        const { error } = await supabase
          .from('properties')
          .insert({
            title: form.title,
            price: form.price,
            location: form.location,
            category: form.category,
            image_url: uploadedUrl,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            square_meters: form.square_meters,
          });
        if (error) throw error;
        toast({ title: 'Created', description: 'Property added successfully' });
      }
      resetForm();
      await refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
      toast({ title: 'Error', description: err.message || 'Failed to save', variant: 'destructive' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // load gallery and features for this property
    loadRelated(p.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this property? This cannot be undone.')) return;
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      setError(error.message);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Property removed' });
      await refresh();
    }
  };

  const loadRelated = async (propId: string) => {
    const { data: imgs } = await supabase
      .from('property_images')
      .select('id, url, sort_order')
      .eq('property_id', propId)
      .order('sort_order', { ascending: true });
    setGallery((imgs as any[])?.map(r => ({ id: r.id, url: r.url, sort_order: r.sort_order })) || []);
    const { data: feats } = await supabase
      .from('property_features')
      .select('id, feature, sort_order')
      .eq('property_id', propId)
      .order('sort_order', { ascending: true });
    setFeatures((feats as any[])?.map(r => ({ id: r.id, feature: r.feature, sort_order: r.sort_order })) || []);
  };

  const addGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingId) return;
    const f = e.target.files?.[0];
    if (!f || !userId) return;
    try {
      const fileExt = f.name.split('.').pop();
      const path = `${userId}/${Date.now()}-gallery.${fileExt}`;
      const { error: upErr } = await supabase.storage
        .from('property-images')
        .upload(path, f, { upsert: true, cacheControl: '3600', contentType: f.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from('property-images').getPublicUrl(path);
      const url = pub?.publicUrl;
      if (!url) throw new Error('Failed to get public URL');
      // find next sort order
      const nextSort = (gallery[gallery.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase
        .from('property_images')
        .insert({ property_id: editingId, url, sort_order: nextSort });
      if (error) throw error;
      toast({ title: 'Image added' });
      await loadRelated(editingId);
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || 'Unable to upload', variant: 'destructive' });
    } finally {
      // reset input value so same file can be chosen again later
      e.target.value = '';
    }
  };

  const removeGalleryImage = async (imgId: number) => {
    if (!editingId) return;
    const { error } = await supabase.from('property_images').delete().eq('id', imgId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Image removed' });
      await loadRelated(editingId);
    }
  };

  const addFeature = async () => {
    if (!editingId || !newFeature.trim()) return;
    const nextSort = (features[features.length - 1]?.sort_order ?? -1) + 1;
    const { error } = await supabase
      .from('property_features')
      .insert({ property_id: editingId, feature: newFeature.trim(), sort_order: nextSort });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      return;
    }
    setNewFeature('');
    toast({ title: 'Feature added' });
    await loadRelated(editingId);
  };

  const removeFeature = async (featId: number) => {
    const { error } = await supabase.from('property_features').delete().eq('id', featId);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Feature removed' });
      if (editingId) await loadRelated(editingId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h1 className="text-2xl font-serif font-semibold">Manage Properties</h1>
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
        </div>

        <form onSubmit={handleSave} className="rounded-xl border bg-white p-5 sm:p-6 mb-6">
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
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-700">Primary Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
              {form.image_url && (
                <p className="text-xs text-gray-500 mt-1">Current image set. Uploading a new image will replace it.</p>
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
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={saving} className="bg-brand-red hover:bg-brand-red/90 text-white">
              {editingId ? 'Save Changes' : 'Add Property'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="rounded-xl border bg-white overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Location</th>
                <th className="p-3">Beds</th>
                <th className="p-3">Baths</th>
                <th className="p-3">m²</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4" colSpan={8}>Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-4" colSpan={8}>No properties yet.</td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium line-clamp-2 max-w-[260px]">{p.title}</div>
                    </td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3">{new Intl.NumberFormat('en-NG',{ style:'currency', currency:'NGN'}).format(p.price)}</td>
                    <td className="p-3">{p.location}</td>
                    <td className="p-3">{p.bedrooms ?? '-'}</td>
                    <td className="p-3">{p.bathrooms ?? '-'}</td>
                    <td className="p-3">{p.square_meters ?? '-'}</td>
                    <td className="p-3">
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

        {editingId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gallery Manager */}
            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-medium">Gallery Images</h2>
                <label className="text-sm text-brand-red cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={addGalleryImage} />
                  + Add Image
                </label>
              </div>
              {gallery.length === 0 ? (
                <p className="text-sm text-gray-600">No gallery images yet.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map(g => (
                    <div key={g.id} className="relative group border rounded overflow-hidden">
                      <img src={g.url} alt="Gallery" className="aspect-[4/3] w-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Button size="sm" variant="destructive" className="opacity-0 group-hover:opacity-100" onClick={() => removeGalleryImage(g.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features Manager */}
            <div className="rounded-xl border bg-white p-5 sm:p-6">
              <h2 className="font-medium mb-3">Features</h2>
              <div className="flex gap-2 mb-4">
                <input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="e.g., Private swimming pool" className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red" />
                <Button onClick={addFeature} className="bg-brand-red hover:bg-brand-red/90 text-white">Add</Button>
              </div>
              {features.length === 0 ? (
                <p className="text-sm text-gray-600">No features yet.</p>
              ) : (
                <ul className="space-y-2">
                  {features.map(f => (
                    <li key={f.id} className="flex items-center justify-between border rounded px-3 py-2">
                      <span>{f.feature}</span>
                      <Button size="sm" variant="outline" onClick={() => removeFeature(f.id)}>Remove</Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesAdmin;
