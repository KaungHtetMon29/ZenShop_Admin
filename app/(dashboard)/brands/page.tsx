import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BrandRow } from './brandRow';
import { addBrand } from './brandAction';

export type Brand = {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default async function Page(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
  const searchParams = await props.searchParams;
  const response = await fetch('http://localhost:8080/brands');
  const data = await response.json();
  const brands: Brand[] = data.data;

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
  console.log(brands);
  return (
    <>
      <Dialog>
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </DialogTrigger>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Brand
                </span>
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Brand</DialogTitle>
            <DialogDescription>
              Fill in the brand details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            {/* Add your form fields here */}
            <form action={addBrand} className="flex flex-col gap-4">
              <Input name="brandName" type="text" placeholder="Brand Name" />
              <DialogFooter>
                <Button type="submit">Save Product</Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
        <DataTable
          description="List of Users"
          fields={['Id', 'Brand Name', 'Creaded ']}
          label="Users"
          offset={5}
          totalProducts={data.count}
        >
          {brands.map((brand: Brand) => (
            <BrandRow key={brand.ID} product={brand} />
          ))}
        </DataTable>
      </Dialog>
    </>
  );
}

function BrandInputDialog() {
  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Add New Brand</DialogTitle>
        <DialogDescription>
          Fill in the brand details. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-5 py-4">
        {/* Add your form fields here */}
        <form action={addBrand} className="flex flex-col gap-4">
          <Input name="brandName" type="text" placeholder="Brand Name" />
          <DialogFooter>
            <Button type="submit">Save Product</Button>
          </DialogFooter>
        </form>
      </div>
    </DialogContent>
  );
}
