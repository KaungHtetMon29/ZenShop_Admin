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
import { Textarea } from '@/components/ui/textarea';

// Define the Shipping type based on the GORM model
export interface Shipping {
  ID: number;
  Address: string;
  FirstName: string;
  LastName: string;
  City: string;
  State: string;
  ZipCode: string;
  Country: string;
  Email: string;
  Phone: string;
  CreatedAt: string;
  OrderID: number;
}

export interface ShippingResponse {
  data: Shipping[];
  count: number;
  page: number;
  limit: number;
}

interface ShippingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentShipping: Shipping | null;
  isEditing: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ShippingFormDialog({
  open,
  onOpenChange,
  currentShipping,
  isEditing,
  onSubmit
}: ShippingFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Shipping Details' : 'Add New Shipping'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the shipping details. Click save when you're done."
              : "Fill in the shipping details. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="grid gap-5 py-4">
          {isEditing && (
            <input
              type="hidden"
              name="shippingId"
              value={currentShipping?.ID}
            />
          )}

          {isEditing && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                name="orderId"
                type="number"
                placeholder="Order ID"
                required
                defaultValue={currentShipping?.OrderID || ''}
                readOnly={isEditing}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                required
                defaultValue={currentShipping?.FirstName || ''}
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
                defaultValue={currentShipping?.LastName || ''}
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
              defaultValue={currentShipping?.Address || ''}
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
                defaultValue={currentShipping?.City || ''}
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
                defaultValue={currentShipping?.State || ''}
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
                defaultValue={currentShipping?.ZipCode || ''}
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
              defaultValue={currentShipping?.Country || ''}
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
                defaultValue={currentShipping?.Email || ''}
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
                defaultValue={currentShipping?.Phone || ''}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="orderId">Order ID</Label>
              <Input
                id="orderId"
                name="orderId"
                type="number"
                placeholder="Order ID"
                required
                defaultValue={currentShipping?.OrderID || ''}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="submit">
              {isEditing ? 'Update Shipping' : 'Save Shipping'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ShippingRowProps {
  shipping: Shipping;
  onEdit: (shipping: Shipping) => void;
  onDelete: (shipping: Shipping) => void;
}

export function ShippingRow({ shipping, onEdit, onDelete }: ShippingRowProps) {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle">{shipping.ID}</td>
      <td className="p-4 align-middle">{shipping.OrderID}</td>
      <td className="p-4 align-middle">
        {shipping.FirstName} {shipping.LastName}
      </td>
      <td className="p-4 align-middle">{shipping.Address}</td>
      <td className="p-4 align-middle">
        {shipping.City}, {shipping.State} {shipping.ZipCode}
      </td>
      <td className="p-4 align-middle">{shipping.Country}</td>
      <td className="p-4 align-middle">{shipping.Phone}</td>
      <td className="p-4 align-middle">{shipping.Email || 'N/A'}</td>
      <td className="p-4 align-middle">
        {shipping.CreatedAt
          ? new Date(shipping.CreatedAt).toLocaleDateString()
          : 'N/A'}
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(shipping)}>
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
          <Button variant="ghost" size="sm" onClick={() => onDelete(shipping)}>
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
  onOpenChange: (open: boolean) => void;
  shippingId?: number;
  onConfirmDelete: () => Promise<void>;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  shippingId,
  onConfirmDelete
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete Shipping #{shippingId}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
