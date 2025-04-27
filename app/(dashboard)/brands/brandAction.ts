'use server';

import { revalidatePath } from 'next/cache';
import { BrandResponse } from './page';
import { getAuthToken } from '@/lib/auth';

// Function to fetch brands with pagination
export async function fetchBrands(
  page: number = 1,
  limit: number = 5
): Promise<BrandResponse> {
  try {
    // Get the JWT token for authorization
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Cache-Control': 'no-store'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/brands?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return { data: [], count: 0, page: page, limit: limit };
  }
}

export async function deleteBrand(formData: FormData) {
  const brandId = formData.get('brandId') as string;
  console.log('Deleting brand with ID:', brandId);
  if (!brandId) {
    throw new Error('Brand ID is required');
  }

  try {
    // Get the JWT token for authorization
    const token = await getAuthToken();
    console.log('Auth token available:', !!token);

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Added Authorization header with bearer token');
    } else {
      console.warn('No authentication token available for delete request');
    }

    console.log(
      'Making DELETE request to:',
      `http://localhost:8080/brands/${brandId}`
    );
    console.log('With headers:', JSON.stringify(headers));

    const response = await fetch(`http://localhost:8080/brands/${brandId}`, {
      method: 'DELETE',
      headers,
      credentials: 'include', // Include cookies if any
      cache: 'no-store' // Ensure fresh request
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Delete request failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Delete response:', data);

    // Specify the exact path to revalidate
    revalidatePath('/brands');
    return { success: true };
  } catch (error) {
    console.error('Delete brand error:', error);
    return { success: false, error };
  }

  revalidatePath('/');
}

export async function addBrand(formData: FormData) {
  const brandName = formData.get('brandName') as string;
  if (!brandName) {
    throw new Error('Brand name is required');
  }

  try {
    // Get the JWT token for authorization
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: brandName
      }),
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Specify the exact path to revalidate
    revalidatePath('/brands');
  } catch (error) {
    console.error(error);
  }
}

export async function updateBrand(brandId: number, brandName: string) {
  if (!brandName) {
    throw new Error('Brand name is required');
  }

  try {
    // Get the JWT token for authorization
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:8080/brands/${brandId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: brandName
      }),
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Specify the exact path to revalidate
    revalidatePath('/brands');
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}
