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
import { useSearchParams } from 'next/navigation';

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 5;

  const [orders, setOrders] = useState<OrderResponse>({
    data: [],
    count: 0,
    page: page,
    limit: ITEMS_PER_PAGE
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Initial data load
  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders(page, ITEMS_PER_PAGE);
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
    try {
      await addOrder(formData);
      toast.success('Order added successfully');
      setDialogOpen(false);
      loadOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  };

  // Handler for updating order
  const handleUpdateOrder = async (formData: FormData) => {
    try {
      await updateOrder(formData);
      toast.success('Order updated successfully');
      setDialogOpen(false);
      setCurrentOrder(null);
      setIsEditing(false);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  // Handler for deleting order
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete.ID);
      toast.success('Order deleted successfully');
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      loadOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  // Open the dialog for adding new order
  const openAddDialog = () => {
    setCurrentOrder(null);
    setIsEditing(false);
    setDialogOpen(true);
  };

  // Open the dialog for editing order
  const openEditDialog = (order: Order) => {
    setCurrentOrder(order);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Open the dialog for deleting order
  const openDeleteDialog = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
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
              Add Order
            </span>
          </Button>
        </div>
      </div>

      {/* Order Form Dialog */}
      <OrderFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
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
          offset={(page - 1) * ITEMS_PER_PAGE + orders.data.length}
          totalProducts={orders.count}
          limit={ITEMS_PER_PAGE}
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
        setOpen={setDeleteDialogOpen}
        onDelete={handleDeleteOrder}
        itemName={orderToDelete?.ID ? `Order #${orderToDelete.ID}` : ''}
        itemType="order"
      />
    </div>
  );
}
