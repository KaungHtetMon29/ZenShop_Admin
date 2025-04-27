import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import prisma from '@/lib/prisma';
import { UserRow } from './userRow';

export type UserResponse = {
  data: any[];
  count: number;
  page: number;
  limit: number;
};

export default async function Page(props: {
  searchParams: Promise<{ q: string; page: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const page = Number(searchParams.page) || 1;
  const ITEMS_PER_PAGE = 5;

  const skip = (page - 1) * ITEMS_PER_PAGE;
  const users = await prisma.user.findMany({
    skip,
    take: ITEMS_PER_PAGE,
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
  });

  const totalUsers = await prisma.user.count({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
  });

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <DataTable
        description="List of Users"
        fields={['Image', 'User ID', 'Name', 'Email', 'Status']}
        label="Users"
        offset={(page - 1) * ITEMS_PER_PAGE + users.length}
        totalProducts={totalUsers}
        limit={ITEMS_PER_PAGE}
      >
        {users.map((user) => (
          <UserRow key={user.id} product={user} />
        ))}
      </DataTable>
    </>
  );
}
