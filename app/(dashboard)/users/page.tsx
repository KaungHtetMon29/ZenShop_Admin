import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import prisma from '@/lib/prisma';
import { UserRow } from './userRow';

export default async function Page(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const users = await prisma.user.findMany();
  return (
    // <Tabs defaultValue="all">
    // </Tabs>
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          {/* <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button> */}
        </div>
      </div>
      <DataTable
        description="List of Users"
        fields={['Image', 'User ID', 'Name', 'Email', 'Status']}
        label="Users"
        offset={1}
        totalProducts={15}
      >
        {users.map((user) => (
          <UserRow key={user.id} product={user} />
        ))}
      </DataTable>
    </>
  );
}
