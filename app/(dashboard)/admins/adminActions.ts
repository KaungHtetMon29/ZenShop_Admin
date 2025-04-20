'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteAdmin(formData: FormData) {
  const adminId = formData.get('adminId') as string;
  console.log(adminId);
  if (!adminId) {
    throw new Error('User ID is required');
  }

  await prisma.admin.delete({
    where: {
      id: adminId
    }
  });

  revalidatePath('/');
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
