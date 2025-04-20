'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteUser(formData: FormData) {
  const userId = formData.get('userId') as string;
  console.log(userId);
  if (!userId) {
    throw new Error('User ID is required');
  }

  await prisma.user.delete({
    where: {
      id: userId
    }
  });

  revalidatePath('/');
}

export async function banUser(formData: FormData) {
  const userId = formData.get('userId') as string;
  const status = formData.get('userStatus') as string;
  if (!userId) {
    throw new Error('User ID is required');
  }

  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: status === 'banned' ? 'allow' : 'banned'
    }
  });

  revalidatePath('/');
}
