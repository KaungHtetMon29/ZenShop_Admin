'use client';

import { useState, useEffect } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import { toast } from 'sonner';
import {
  fetchShipping,
  addShipping,
  updateShipping,
  deleteShipping
} from './shippingAction';
import {
  ShippingFormDialog,
  ShippingRow,
  DeleteConfirmationDialog,
  Shipping,
  ShippingResponse
} from './shipping';
import { useSearchParams } from 'next/navigation';

export default function ShippingPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 5;

  const [shippings, setShippings] = useState<ShippingResponse>({
    data: [],
    count: 0,
    page: page,
    limit: ITEMS_PER_PAGE
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentShipping, setCurrentShipping] = useState<Shipping | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shippingToDelete, setShippingToDelete] = useState<Shipping | null>(
    null
  );

  // Initial data load
  useEffect(() => {
    loadShippings();
  }, [page]); // Reload when page changes

  const loadShippings = async () => {
    setLoading(true);
    try {
      const data = await fetchShipping(page, ITEMS_PER_PAGE);
      setShippings(data);
    } catch (error) {
      console.error('Error loading shipping records:', error);
      toast.error('Failed to load shipping records');
    } finally {
      setLoading(false);
    }
  };

  // Handler for form submission
  const handleAddShipping = async (formData: FormData) => {
    try {
      await addShipping(formData);
      toast.success('Shipping added successfully');
      setDialogOpen(false);
      loadShippings();
    } catch (error) {
      console.error('Error adding shipping:', error);
      toast.error('Failed to add shipping');
    }
  };

  // Handler for updating shipping
  const handleUpdateShipping = async (formData: FormData) => {
    try {
      await updateShipping(formData);
      toast.success('Shipping updated successfully');
      setDialogOpen(false);
      setCurrentShipping(null);
      setIsEditing(false);
      loadShippings();
    } catch (error) {
      console.error('Error updating shipping:', error);
      toast.error('Failed to update shipping');
    }
  };

  // Handler for deleting shipping
  const handleDeleteShipping = async () => {
    if (!shippingToDelete) return;

    try {
      await deleteShipping(shippingToDelete.ID);
      toast.success('Shipping deleted successfully');
      setDeleteDialogOpen(false);
      setShippingToDelete(null);
      loadShippings();
    } catch (error) {
      console.error('Error deleting shipping:', error);
      toast.error('Failed to delete shipping');
    }
  };

  // Open the dialog for adding new shipping
  const openAddDialog = () => {
    setCurrentShipping(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  // Open the dialog for editing shipping
  const openEditDialog = (shipping: Shipping) => {
    setCurrentShipping(shipping);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Open the dialog for deleting shipping
  const openDeleteDialog = (shipping: Shipping) => {
    setShippingToDelete(shipping);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Shipping</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1" onClick={openAddDialog}>
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Shipping
            </span>
          </Button>
        </div>
      </div>

      {/* Shipping Form Dialog */}
      <ShippingFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentShipping={currentShipping}
        isEditing={isEditing}
        onSubmit={isEditing ? handleUpdateShipping : handleAddShipping}
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : shippings && shippings.data ? (
        <DataTable
          description="Manage shipping information for orders"
          fields={[
            'ID',
            'Order ID',
            'Customer Name',
            'Address',
            'City/State/Zip',
            'Country',
            'Phone',
            'Email',
            'Created At',
            'Actions'
          ]}
          label="Shipping"
          offset={(page - 1) * ITEMS_PER_PAGE + shippings.data.length}
          totalProducts={shippings.count}
          limit={ITEMS_PER_PAGE}
        >
          {shippings.data.map((shipping: Shipping) => (
            <ShippingRow
              key={shipping.ID}
              shipping={shipping}
              onEdit={() => openEditDialog(shipping)}
              onDelete={() => openDeleteDialog(shipping)}
            />
          ))}
        </DataTable>
      ) : (
        <div className="py-10 text-center">
          <p>
            No shipping records found. Add your first shipping using the button
            above.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        shippingId={shippingToDelete?.ID}
        onConfirmDelete={handleDeleteShipping}
      />
    </div>
  );
}
