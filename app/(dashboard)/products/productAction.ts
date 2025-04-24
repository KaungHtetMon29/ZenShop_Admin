'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Function to add a new product
export async function addProduct(formData: FormData) {
  try {
    // Get session data
    const session = await auth();

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

    const response = await fetch('http://localhost:8080/products', {
      method: 'POST',
      body: requestFormData
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
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

    const response = await fetch(
      `http://localhost:8080/products/${productId}`,
      {
        method: 'PUT',
        body: requestFormData
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
    const response = await fetch(
      `http://localhost:8080/products/${productId}`,
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

    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
}
