'use server';

import { auth } from '@/lib/auth';
import { getAuthToken } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductResponse } from '../product';

// Function to fetch products with pagination
export async function fetchProducts(
  page: number = 1,
  limit: number = 5
): Promise<ProductResponse> {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Cache-Control': 'no-store'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/products?page=${page}&limit=${limit}`,
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
    console.error('Error fetching products:', error);
    return { data: [], count: 0, page: page, limit: limit };
  }
}

// Function to add a new product
export async function addProduct(formData: FormData) {
  try {
    // Get session data and JWT token
    const session = await auth();
    const token = await getAuthToken();

    // Extract form data values
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const brandId = formData.get('brandId') as string;
    const categoryId = formData.get('categoryId') as string;
    const updateBy = session?.user?.name || 'Unknown User';
    const imageFile = formData.get('image') as File;

    // Create new FormData for the request
    const requestFormData = new FormData();
    requestFormData.append('name', name);
    requestFormData.append('price', price);
    requestFormData.append('stock', stock);
    requestFormData.append('brandId', brandId);
    requestFormData.append('categoryId', categoryId);
    requestFormData.append('updateBy', updateBy);

    // Only append image if it's a valid file (not null or empty)
    if (imageFile && imageFile.size > 0 && imageFile.name !== '') {
      requestFormData.append('image', imageFile);
    }

    console.log('Adding product with data:', {
      name,
      price,
      stock,
      brandId,
      categoryId,
      updateBy,
      hasImage: imageFile && imageFile.size > 0
    });

    // Create headers with Authorization
    const headers: HeadersInit = {};

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/products', {
      method: 'POST',
      body: requestFormData,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Product creation failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error };
  }
}

// Function to update an existing product
export async function updateProduct(formData: FormData) {
  try {
    const session = await auth();
    // Get JWT token
    const token = await getAuthToken();

    const requestFormData = new FormData();

    requestFormData.append('name', formData.get('name') as string);
    requestFormData.append('price', formData.get('price') as string);
    requestFormData.append('stock', formData.get('stock') as string);
    requestFormData.append('brandId', formData.get('brandId') as string);
    requestFormData.append('categoryId', formData.get('categoryId') as string);
    requestFormData.append('updateBy', session?.user?.name as string);
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.name) {
      requestFormData.append('image', imageFile);
    }
    console.log(imageFile);
    const productId = formData.get('productId');

    // Create headers with Authorization
    const headers: HeadersInit = {};

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/products/${productId}`,
      {
        method: 'PUT',
        body: requestFormData,
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error };
  }
}

// Function to delete a product
export async function deleteProduct(productId: number) {
  try {
    // Get JWT token
    const token = await getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // Add Authorization header if token is available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/products/${productId}`,
      {
        method: 'DELETE',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
}
