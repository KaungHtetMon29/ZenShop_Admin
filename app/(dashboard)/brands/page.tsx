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
import { addBrand, fetchBrands, updateBrand, deleteBrand } from './brandAction';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

export type Brand = {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
  Products: null;
};

export type BrandResponse = {
  data: Brand[];
  count: number;
  page: number;
  limit: number;
};

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 5;

  const [brands, setBrands] = useState<BrandResponse>({
    data: [],
    count: 0,
    page: page,
    limit: ITEMS_PER_PAGE
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  // Function to load brands data with pagination using server action
  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await fetchBrands(page, ITEMS_PER_PAGE);
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadBrands();
  }, [page]); // Reload when page changes

  // Handler for form submission
  const handleAddBrand = async (formData: FormData) => {
    try {
      await addBrand(formData);
      setDialogOpen(false);
      toast.success('Brand added successfully');
      loadBrands(); // Refresh data after adding
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
    }
  };

  // Handler for brand update
  const handleUpdateBrand = async (formData: FormData) => {
    try {
      if (!currentBrand) return;

      const brandId = currentBrand.ID;
      const brandName = formData.get('brandName') as string;

      const result = await updateBrand(brandId, brandName);

      if (result.success) {
        setDialogOpen(false);
        setCurrentBrand(null);
        setIsEditing(false);
        toast.success('Brand updated successfully');
        loadBrands(); // Refresh data after updating
      } else {
        toast.error('Failed to update brand');
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
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

      const formData = new FormData();
      formData.append('brandId', brandToDelete.ID.toString());

      const result = await deleteBrand(formData);

      if (result.success) {
        setDeleteDialogOpen(false);
        setBrandToDelete(null);
        toast.success('Brand deleted successfully');
        loadBrands(); // Refresh data after deleting
      } else {
        toast.error(
          'Failed to delete brand: ' +
            (result.error?.toString() || 'Unknown error')
        );
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
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
            <DialogContent
              className="sm:max-w-[500px]"
              onInteractOutside={(e) => {
                // This prevents the dialog from closing when clicking inside a nested element
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                // This ensures Escape key properly closes the dialog
                e.preventDefault();
                setDialogOpen(false);
              }}
            >
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
              <form
                action={isEditing ? handleUpdateBrand : handleAddBrand}
                className="grid gap-5 py-4"
              >
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="brandName">Brand Name</Label>
                  <Input
                    id="brandName"
                    name="brandName"
                    type="text"
                    placeholder="Brand Name"
                    required
                    defaultValue={currentBrand?.Name || ''}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {isEditing ? 'Update Brand' : 'Save Brand'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : brands && brands.data ? (
        <div className="border rounded-md">
          <DataTable
            description="List of Brands"
            fields={['ID', 'Brand Name', 'Created At', 'Updated At', 'Actions']}
            label="Brands"
            offset={page} // This was the issue - using incorrect offset calculation
            totalProducts={brands.count || 0}
            limit={ITEMS_PER_PAGE}
          >
            {brands.data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-muted-foreground"
                >
                  No brands found. Add your first brand using the button above.
                </td>
              </tr>
            ) : (
              brands.data.map((brand: Brand) => (
                <BrandRow
                  key={brand.ID}
                  product={brand}
                  onEdit={() => openEditDialog(brand)}
                  onDelete={() => openDeleteDialog(brand)}
                />
              ))
            )}
          </DataTable>
        </div>
      ) : (
        <div className="py-10 text-center">
          <p>No brands found. Add your first brand using the button above.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={(e) => {
            // Prevent accidental closing when clicking outside
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            // Enable Escape key to close the dialog
            e.preventDefault();
            setDeleteDialogOpen(false);
          }}
        >
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
    </div>
  );
}
