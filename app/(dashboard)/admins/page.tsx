import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import prisma from '@/lib/prisma';
import { AdminRow } from './adminRow';

export type AdminResponse = {
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
  const admins = await prisma.admin.findMany({
    skip,
    take: ITEMS_PER_PAGE,
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
  });

  const totalAdmins = await prisma.admin.count({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
  });

  return (
    <>
      <Dialog>
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Admin
                </span>
              </Button>
            </DialogTrigger>
            <AdminInputDialog />
          </div>
        </div>
        <DataTable
          description="List of Admins"
          fields={['Image', 'User ID', 'Name', 'Email', 'Role']}
          label="Admins"
          offset={(page - 1) * ITEMS_PER_PAGE + admins.length}
          totalProducts={totalAdmins}
          limit={ITEMS_PER_PAGE}
        >
          {admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-muted-foreground">
                No admins found. Add your first admin using the button above.
              </td>
            </tr>
          ) : (
            admins.map((admin) => <AdminRow key={admin.id} product={admin} />)
          )}
        </DataTable>
      </Dialog>
    </>
  );
}

function AdminInputDialog() {
  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogDescription>
          Fill in the admin data. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-5 py-4">
        <Input type="email" placeholder="User Email" />
        <Input type="text" placeholder="Name" />
      </div>
      <DialogFooter>
        <Button type="submit">Save Product</Button>
      </DialogFooter>
    </DialogContent>
  );
}
