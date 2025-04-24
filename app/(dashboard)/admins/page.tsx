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

export default async function Page(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  const admins = await prisma.admin.findMany();
  // const { products, newOffset, totalProducts } = await getProducts(
  //   search,
  //   Number(offset)
  // );
  return (
    // <Tabs defaultValue="all">
    // </Tabs>
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
                  Add Product
                </span>
              </Button>
            </DialogTrigger>
            <AdminInputDialog />
          </div>
        </div>
        <DataTable
          description="List of Users"
          fields={['Image', 'User ID', 'Name', 'Email', 'Role']}
          label="Users"
          offset={1}
          totalProducts={15}
        >
          {admins.map((admin) => (
            <AdminRow key={admin.id} product={admin} />
          ))}
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
