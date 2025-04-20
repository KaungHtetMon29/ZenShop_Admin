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

export default async function Page(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const offset = searchParams.offset ?? 0;
  // const { products, newOffset, totalProducts } = await getProducts(
  //   search,
  //   Number(offset)
  // );
  const product = [
    {
      invoice: 'INV001',
      paymentStatus: 'Paid',
      totalAmount: '$250.00',
      paymentMethod: 'Credit Card'
    },
    {
      invoice: 'INV002',
      paymentStatus: 'Pending',
      totalAmount: '$150.00',
      paymentMethod: 'PayPal'
    },
    {
      invoice: 'INV003',
      paymentStatus: 'Unpaid',
      totalAmount: '$350.00',
      paymentMethod: 'Bank Transfer'
    },
    {
      invoice: 'INV004',
      paymentStatus: 'Paid',
      totalAmount: '$450.00',
      paymentMethod: 'Credit Card'
    },
    {
      invoice: 'INV005',
      paymentStatus: 'Paid',
      totalAmount: '$550.00',
      paymentMethod: 'PayPal'
    },
    {
      invoice: 'INV006',
      paymentStatus: 'Pending',
      totalAmount: '$200.00',
      paymentMethod: 'Bank Transfer'
    },
    {
      invoice: 'INV007',
      paymentStatus: 'Unpaid',
      totalAmount: '$300.00',
      paymentMethod: 'Credit Card'
    }
  ];
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
            <RepairInputDialog />
          </div>
        </div>
        {/* <DataTable
        DataRow={}
          description="List of repairs"
          fields={[
            'Repair ID',
            'Repair Status ID',
            'Product',
            'Category',
            'Created At',
            'Updated At',
            'Description'
          ]}
          label="Repairs"
          offset={1}
          totalProducts={15}
        /> */}
      </Dialog>
    </>
  );
}

function RepairInputDialog() {
  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Add New Repair</DialogTitle>
        <DialogDescription>
          Fill in the product details. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-5 py-4">
        {/* Add your form fields here */}
        <Input type="email" placeholder="User Email" />
        <Input type="text" placeholder="Product" />
        <div className="flex gap-2">
          <Input type="text" placeholder="Repair Status" />
          <Input type="text" placeholder="Category" />
        </div>
        <Textarea placeholder="Description" />
      </div>
      <DialogFooter>
        <Button type="submit">Save Product</Button>
      </DialogFooter>
    </DialogContent>
  );
}
