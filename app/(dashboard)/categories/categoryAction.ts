'use server';

import { revalidatePath } from 'next/cache';
import { getAuthToken } from '@/lib/auth';

export async function deleteCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string;
  console.log(categoryId);
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

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
      `http://localhost:8080/categories/${categoryId}`,
      {
        method: 'DELETE',
        headers
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Specify the exact path to revalidate
    revalidatePath('/categories');
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/');
}

export async function addCategory(formData: FormData) {
  const categoryName = formData.get('categoryName') as string;
  if (!categoryName) {
    throw new Error('Category name is required');
  }

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

    const response = await fetch('http://localhost:8080/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName
      }),
      headers
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    // Specify the exact path to revalidate
    revalidatePath('/categories');
  } catch (error) {
    console.error(error);
  }
}

export async function updateCategory(categoryId: number, categoryName: string) {
  if (!categoryName) {
    throw new Error('Category name is required');
  }

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
      `http://localhost:8080/categories/${categoryId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: categoryName
        }),
        headers
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Update request failed with status ${response.status}: ${errorText}`
      );
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Update response:', data);

    // Specify the exact path to revalidate
    revalidatePath('/categories');
    return { success: true };
  } catch (error) {
    console.error('Update category error:', error);
    return { success: false, error };
  }
}
