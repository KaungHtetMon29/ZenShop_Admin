'use client';

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
import { useEffect, useState } from 'react';

export type Brand = {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
  Products: null;
};

export type BrandResponse = {
  count: number;
  data: Brand[];
  status: string;
};

export default function Page() {
  const [brands, setBrands] = useState<BrandResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Function to fetch brands data
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/brands');
      if (!response.ok) {
        throw new Error(`Error fetching brands: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched brands:', data);
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchBrands();
  }, []);

  // Handler for form submission
  const handleAddBrand = async (formData: FormData) => {
    await addBrand(formData);
    setDialogOpen(false);
    fetchBrands(); // Refresh data after adding
  };

  // Handler for brand update
  const handleUpdateBrand = async (formData: FormData) => {
    try {
      if (!currentBrand) return;

      const brandId = currentBrand.ID;
      const brandName = formData.get('brandName') as string;

      const response = await fetch(`http://localhost:8080/brands/${brandId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name: brandName })
      });

      if (!response.ok) {
        throw new Error(`Error updating brand: ${response.status}`);
      }

      setDialogOpen(false);
      setCurrentBrand(null);
      setIsEditing(false);
      fetchBrands(); // Refresh data after updating
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  // Function to open edit dialog
  const openEditDialog = (brand: Brand) => {
    setCurrentBrand(brand);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Function to handle brand deletion
  const handleDeleteBrand = async () => {
    try {
      if (!brandToDelete) return;

      const brandId = brandToDelete.ID;

      const response = await fetch(`http://localhost:8080/brands/${brandId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error deleting brand: ${response.status}`);
      }

      setDeleteDialogOpen(false);
      setBrandToDelete(null);
      fetchBrands(); // Refresh data after deleting
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setCurrentBrand(null);
                setIsEditing(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Brand
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Brand' : 'Add New Brand'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the brand details. Click save when you're done."
                    : "Fill in the brand details. Click save when you're done."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <form
                  action={isEditing ? handleUpdateBrand : handleAddBrand}
                  className="flex flex-col gap-4"
                >
                  <Input
                    name="brandName"
                    type="text"
                    placeholder="Brand Name"
                    required
                    defaultValue={currentBrand?.Name || ''}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {isEditing ? 'Update Brand' : 'Save Brand'}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : brands && brands.data ? (
        <DataTable
          description="List of Brands"
          fields={['Id', 'Brand Name', 'Created', 'Actions']}
          label="Brands"
          offset={5}
          totalProducts={brands.count || 0}
        >
          {brands.data.map((brand: Brand) => (
            <BrandRow
              key={brand.ID}
              product={brand}
              onEdit={() => openEditDialog(brand)}
              onDelete={() => openDeleteDialog(brand)}
            />
          ))}
        </DataTable>
      ) : (
        <div className="py-10 text-center">
          <p>No brands found. Add your first brand using the button above.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the brand "{brandToDelete?.Name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBrand}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
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
