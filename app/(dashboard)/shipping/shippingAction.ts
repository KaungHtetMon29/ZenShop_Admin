'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ShippingResponse, Shipping } from './shipping';

// Function to fetch all shipping records
export async function fetchShipping(): Promise<ShippingResponse> {
  try {
    const response = await fetch('http://localhost:8080/shipping');
    if (!response.ok) {
      throw new Error(`Error fetching shipping: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipping records:', error);
    throw error;
  }
}

// Function to fetch a specific shipping record by ID
export async function fetchShippingById(shippingId: number): Promise<Shipping> {
  try {
    const response = await fetch(
      `http://localhost:8080/shipping/${shippingId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching shipping: ${response.status}`);
    }
    const data = await response.json();
    return data;
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
    const response = await fetch(
      `http://localhost:8080/shipping/order/${orderId}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching shipping for order: ${response.status}`);
    }
    const data = await response.json();
    return data;
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

    const response = await fetch('http://localhost:8080/shipping', {
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

    const response = await fetch(
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
    const response = await fetch(
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
