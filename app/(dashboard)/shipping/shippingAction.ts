'use server';

import { auth } from '@/lib/auth';
import { fetchWithAuth, fetchWithAuthJson } from '@/lib/fetchWithAuth';
import { revalidatePath } from 'next/cache';
import { ShippingResponse, Shipping } from './shipping';

// Function to fetch all shipping records with pagination
export async function fetchShipping(
  page: number = 1,
  limit: number = 5
): Promise<ShippingResponse> {
  // In a real app, you'd call your backend API with pagination params
  try {
    const data = await fetchWithAuthJson<ShippingResponse>(
      `http://localhost:8080/shipping?page=${page}&limit=${limit}`,
      {
        cache: 'no-store'
      }
    );

    return data;
  } catch (error) {
    console.error('Error fetching shipping records:', error);
    // Return empty data with pagination info on error
    return { data: [], count: 0, page: page, limit: limit };
  }
}

// Function to fetch a specific shipping record by ID
export async function fetchShippingById(shippingId: number): Promise<Shipping> {
  try {
    return await fetchWithAuthJson<Shipping>(
      `http://localhost:8080/shipping/${shippingId}`
    );
  } catch (error) {
    console.error(`Error fetching shipping with ID ${shippingId}:`, error);
    throw error;
  }
}

// Function to fetch shipping by Order ID
export async function fetchShippingByOrderId(
  orderId: number
): Promise<Shipping> {
  try {
    return await fetchWithAuthJson<Shipping>(
      `http://localhost:8080/shipping/order/${orderId}`
    );
  } catch (error) {
    console.error(`Error fetching shipping for order ${orderId}:`, error);
    throw error;
  }
}

// Function to add a new shipping record
export async function addShipping(formData: FormData) {
  try {
    // Get session data
    const session = await auth();

    const shippingData = {
      OrderID: Number(formData.get('orderId')),
      Address: formData.get('address'),
      FirstName: formData.get('firstName'),
      LastName: formData.get('lastName'),
      City: formData.get('city'),
      State: formData.get('state'),
      ZipCode: formData.get('zipCode'),
      Country: formData.get('country'),
      Email: formData.get('email') || '',
      Phone: formData.get('phone'),
      CreatedAt: new Date().toISOString().split('T')[0]
    };

    const response = await fetchWithAuth('http://localhost:8080/shipping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(shippingData)
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/shipping');
    return { success: true };
  } catch (error) {
    console.error('Error adding shipping:', error);
    return { success: false, error };
  }
}

// Function to update an existing shipping record
export async function updateShipping(formData: FormData) {
  try {
    const session = await auth();

    const shippingId = formData.get('shippingId');
    const shippingData = {
      OrderID: Number(formData.get('orderId')),
      Address: formData.get('address'),
      FirstName: formData.get('firstName'),
      LastName: formData.get('lastName'),
      City: formData.get('city'),
      State: formData.get('state'),
      ZipCode: formData.get('zipCode'),
      Country: formData.get('country'),
      Email: formData.get('email') || '',
      Phone: formData.get('phone')
    };

    const response = await fetchWithAuth(
      `http://localhost:8080/shipping/${shippingId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shippingData)
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/shipping');
    return { success: true };
  } catch (error) {
    console.error('Error updating shipping:', error);
    return { success: false, error };
  }
}

// Function to delete a shipping record
export async function deleteShipping(shippingId: number) {
  try {
    const response = await fetchWithAuth(
      `http://localhost:8080/shipping/${shippingId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/shipping');
    return { success: true };
  } catch (error) {
    console.error('Error deleting shipping:', error);
    return { success: false, error };
  }
}
