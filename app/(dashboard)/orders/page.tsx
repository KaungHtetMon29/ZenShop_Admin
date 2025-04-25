'use client';

import { useState, useEffect } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import { Dialog } from '@/components/ui/dialog';
import { Order, OrderResponse } from '../order';
import { toast } from 'sonner';
import {
  fetchOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  processCheckout
} from './orderAction';
import { OrderFormDialog, OrderRow, DeleteConfirmationDialog } from './order';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Initial data load
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Handler for form submission
  const handleAddOrder = async (formData: FormData) => {
    const result = await addOrder(formData);
    if (result.success) {
      setDialogOpen(false);
      loadOrders();
      toast.success('Order added successfully');
    } else {
      toast.error('Failed to add order');
    }
  };

  // Handler for order update
  const handleUpdateOrder = async (formData: FormData) => {
    const result = await updateOrder(formData);
    if (result.success) {
      setDialogOpen(false);
      setCurrentOrder(null);
      setIsEditing(false);
      loadOrders();
      toast.success('Order updated successfully');
    } else {
      toast.error('Failed to update order');
    }
  };

  // Function to open edit dialog
  const openEditDialog = (order: Order) => {
    setCurrentOrder(order);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Function to handle order deletion
  const handleDeleteOrder = async () => {
    try {
      if (!orderToDelete) return;

      const result = await deleteOrder(orderToDelete.ID);
      if (result.success) {
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
        loadOrders();
        toast.success('Order deleted successfully');
      } else {
        toast.error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-bold">Orders</h1>
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
              setCurrentOrder(null);
              setDialogOpen(true);
            }}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Order
            </span>
          </Button>
        </div>
      </div>

      {/* Order Form Dialog */}
      <OrderFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setCurrentOrder(null);
            setIsEditing(false);
          }
        }}
        currentOrder={currentOrder}
        isEditing={isEditing}
        onSubmit={isEditing ? handleUpdateOrder : handleAddOrder}
      />

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : orders && orders.data ? (
        <DataTable
          description="Manage and track customer orders"
          fields={[
            'ID',
            'User ID',
            'Payment Amount',
            'Payment Type',
            'Customer Name',
            'Shipping Address',
            'Contact',
            'Created At',
            'Actions'
          ]}
          label="Orders"
          offset={orders.data.length || 0}
          totalProducts={orders.count || 0}
        >
          {orders.data.map((order: Order) => (
            <OrderRow
              key={order.ID}
              order={order}
              onEdit={() => openEditDialog(order)}
              onDelete={() => openDeleteDialog(order)}
            />
          ))}
        </DataTable>
      ) : (
        <div className="py-10 text-center">
          <p>No orders found. Add your first order using the button above.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        orderId={orderToDelete?.ID}
        onConfirmDelete={handleDeleteOrder}
      />
    </>
  );
}
