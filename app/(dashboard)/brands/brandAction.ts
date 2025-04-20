'use server';

import { revalidatePath } from 'next/cache';

export async function deleteBrand(formData: FormData) {
  const brandId = formData.get('brandId') as string;
  console.log(brandId);
  if (!brandId) {
    throw new Error('Brand ID is required');
  }

  try {
    const response = await fetch(`http://localhost:8080/brands/${brandId}`, {
      method: 'DELETE',
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
    revalidatePath('/brands');
  } catch (error) {
    console.error(error);
  }

  revalidatePath('/');
}

export async function addBrand(formData: FormData) {
  const brandName = formData.get('brandName') as string;
  if (!brandName) {
    throw new Error('Brand name is required');
  }

  try {
    const response = await fetch('http://localhost:8080/brands', {
      method: 'POST',
      body: JSON.stringify({
        name: brandName
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
    revalidatePath('/brands');
  } catch (error) {
    console.error(error);
  }
}

// export async function banAdmin(formData: FormData) {
//   const userId = formData.get('userId') as string;
//   const status = formData.get('userStatus') as string;
//   if (!userId) {
//     throw new Error('User ID is required');
//   }

//   await prisma.user.update({
//     where: {
//       id: userId
//     },
//     data: {
//       status: status === 'banned' ? 'allow' : 'banned'
//     }
//   });

//   revalidatePath('/');
// }
