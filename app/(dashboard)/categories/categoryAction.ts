'use server';

import { revalidatePath } from 'next/cache';

export async function deleteCategory(formData: FormData) {
  const categoryId = formData.get('categoryId') as string;
  console.log(categoryId);
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  try {
    const response = await fetch(
      `http://localhost:8080/categories/${categoryId}`,
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
    const response = await fetch('http://localhost:8080/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: categoryName
      }),
      headers: {
        'Content-Type': 'application/json'
      }
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
