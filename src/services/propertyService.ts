
import * as api from './api';
import { PropertyData } from '@/components/property/PropertyCard';

// Fetch featured properties (limited number for homepage)
export async function getFeaturedProperties(): Promise<PropertyData[]> {
  try {
    return await api.getFeaturedProperties();
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }
}

// Fetch all properties with optional filtering
export async function getAllProperties(category?: string): Promise<PropertyData[]> {
  try {
    return await api.getAllProperties(category);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Get single property by ID
export async function getPropertyById(id: string): Promise<PropertyData | null> {
  try {
    return await api.getPropertyById(id);
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}
