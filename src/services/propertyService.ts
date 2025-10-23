
import { supabase } from '@/lib/supabase';
import { PropertyData } from '@/components/property/PropertyCard';

// Fetch featured properties (limited number for homepage)
export async function getFeaturedProperties(): Promise<PropertyData[]> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) throw error;
    
    return data as PropertyData[];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Fetch all properties with optional filtering
export async function getAllProperties(category?: string): Promise<PropertyData[]> {
  try {
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as PropertyData[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Get single property by ID
export async function getPropertyById(id: string): Promise<PropertyData | null> {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as PropertyData;
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}
