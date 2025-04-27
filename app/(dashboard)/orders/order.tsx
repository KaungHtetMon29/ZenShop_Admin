import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Order } from '../order';
import { Textarea } from '@/components/ui/textarea';

interface OrderFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentOrder: Order | null;
  isEditing: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function OrderFormDialog({
  open,
  onOpenChange,
  currentOrder,
  isEditing,
  onSubmit
}: OrderFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => {
          // Allow closing with the X button but prevent accidental closing when clicking outside
          if (e.target.closest('button[aria-label="Close"]')) {
            return; // Don't prevent default for the close button
          }
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Enable Escape key to close the dialog
          e.preventDefault();
          onOpenChange(false);
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Order' : 'Add New Order'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the order details. Click save when you're done."
              : "Fill in the order details. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-5 py-4">
          {isEditing && (
            <>
              <input type="hidden" name="orderId" value={currentOrder?.ID} />
              <input
                type="hidden"
                name="userId"
                value={currentOrder?.UserId || ''}
              />
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="userIdDisplay">User ID</Label>
                <div className="p-2 bg-muted rounded-md">
                  {currentOrder?.UserId}
                </div>
              </div>
            </>
          )}

          {!isEditing && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                name="userId"
                type="text"
                placeholder="User ID"
                required
                defaultValue={currentOrder?.UserId || ''}
              />
            </div>
          )}

          <h3 className="text-lg font-semibold mt-4">Payment Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Amount"
                required
                defaultValue={currentOrder?.Payment?.Amount || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Input
                id="paymentType"
                name="paymentType"
                type="text"
                placeholder="Payment Type"
                required
                defaultValue={currentOrder?.Payment?.Type || ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                name="cardholderName"
                type="text"
                placeholder="Cardholder Name"
                required
                defaultValue={currentOrder?.Payment?.CardholderName || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="cardNumberLast4">Card Number (Last 4)</Label>
              <Input
                id="cardNumberLast4"
                name="cardNumberLast4"
                type="text"
                placeholder="Last 4 digits"
                required
                maxLength={4}
                defaultValue={currentOrder?.Payment?.CardNumberLast4 || ''}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="text"
              placeholder="MM/YY"
              required
              defaultValue={currentOrder?.Payment?.ExpiryDate || ''}
            />
          </div>

          <h3 className="text-lg font-semibold mt-4">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                required
                defaultValue={currentOrder?.Shipping?.FirstName || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                defaultValue={currentOrder?.Shipping?.LastName || ''}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Address"
              required
              defaultValue={currentOrder?.Shipping?.Address || ''}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="City"
                required
                defaultValue={currentOrder?.Shipping?.City || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                type="text"
                placeholder="State"
                required
                defaultValue={currentOrder?.Shipping?.State || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                type="text"
                placeholder="Zip Code"
                required
                defaultValue={currentOrder?.Shipping?.ZipCode || ''}
              />
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              type="text"
              placeholder="Country"
              required
              defaultValue={currentOrder?.Shipping?.Country || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                defaultValue={currentOrder?.Shipping?.Email || ''}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone"
                required
                defaultValue={currentOrder?.Shipping?.Phone || ''}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Update Order' : 'Save Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface OrderRowProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export function OrderRow({ order, onEdit, onDelete }: OrderRowProps) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">{order.ID}</td>
      <td className="p-4 align-middle">{order.UserId}</td>
      <td className="p-4 align-middle">${order.Payment?.Amount}</td>
      <td className="p-4 align-middle">{order.Payment?.Type}</td>
      <td className="p-4 align-middle">
        {order.Shipping?.FirstName} {order.Shipping?.LastName}
      </td>
      <td className="p-4 align-middle">
        {order.Shipping?.Address}, {order.Shipping?.City}
      </td>
      <td className="p-4 align-middle">{order.Shipping?.Phone}</td>
      <td className="p-4 align-middle">
        {order.CreatedAt
          ? new Date(order.CreatedAt).toLocaleDateString()
          : 'N/A'}
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(order)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(order)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-red-500"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface DeleteConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => Promise<void>;
  itemName: string;
  itemType: string;
}

export function DeleteConfirmationDialog({
  open,
  setOpen,
  onDelete,
  itemName,
  itemType
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {itemName}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
