'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { createRepair } from './repairAction';
import { Label } from '@/components/ui/label';

interface RepairInputDialogProps {
  onSuccess?: () => void;
}

export function RepairInputDialog({ onSuccess }: RepairInputDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await createRepair(formData);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error('Failed to create repair:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DialogContent
      className="sm:max-w-[500px]"
      onInteractOutside={(e) => {
        // Prevent accidental closing when clicking outside
        e.preventDefault();
      }}
      onEscapeKeyDown={(e) => {
        // Enable Escape key to close the dialog
        e.preventDefault();
        // The Dialog root component in the parent will handle the actual closing
      }}
    >
      <DialogHeader>
        <DialogTitle>Add New Repair</DialogTitle>
        <DialogDescription>
          Enter repair details to create a new repair request.
        </DialogDescription>
      </DialogHeader>
      <form action={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">Customer Email</Label>
            <Input
              id="userEmail"
              name="userEmail"
              placeholder="Customer Email"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPhone">Customer Phone</Label>
            <Input
              id="userPhone"
              name="userPhone"
              placeholder="Customer Phone Number"
              type="tel"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Input
              id="product"
              name="product"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description of the repair issue"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Repair'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
