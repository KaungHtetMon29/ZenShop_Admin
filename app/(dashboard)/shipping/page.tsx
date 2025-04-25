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

export default function ShippingPage() {
  const [shippings, setShippings] = useState<ShippingResponse | null>(null);
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
  }, []);

  const loadShippings = async () => {
    setLoading(true);
    try {
      const data = await fetchShipping();
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
    const result = await addShipping(formData);
    if (result.success) {
      setDialogOpen(false);
      loadShippings();
      toast.success('Shipping record added successfully');
    } else {
      toast.error('Failed to add shipping record');
    }
  };

  // Handler for shipping update
  const handleUpdateShipping = async (formData: FormData) => {
    const result = await updateShipping(formData);
    if (result.success) {
      setDialogOpen(false);
      setCurrentShipping(null);
      setIsEditing(false);
      loadShippings();
      toast.success('Shipping updated successfully');
    } else {
      toast.error('Failed to update shipping');
    }
  };

  // Function to open edit dialog
  const openEditDialog = (shipping: Shipping) => {
    setCurrentShipping(shipping);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Function to handle shipping deletion
  const handleDeleteShipping = async () => {
    try {
      if (!shippingToDelete) return;

      const result = await deleteShipping(shippingToDelete.ID);
      if (result.success) {
        setDeleteDialogOpen(false);
        setShippingToDelete(null);
        loadShippings();
        toast.success('Shipping deleted successfully');
      } else {
        toast.error('Failed to delete shipping');
      }
    } catch (error) {
      console.error('Error deleting shipping:', error);
      toast.error('Failed to delete shipping');
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (shipping: Shipping) => {
    setShippingToDelete(shipping);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-bold">Shipping</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => {
              setIsEditing(false);
              setCurrentShipping(null);
              setDialogOpen(true);
            }}
          >
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
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setCurrentShipping(null);
            setIsEditing(false);
          }
        }}
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
          offset={shippings.data.length || 0}
          totalProducts={shippings.count || 0}
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
            No shipping records found. Add your first shipping record using the
            button above.
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
    </>
  );
}
