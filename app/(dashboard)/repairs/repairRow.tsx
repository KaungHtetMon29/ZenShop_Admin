'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Trash2, Edit, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  deleteRepair,
  updateRepair,
  createRepairStatus,
  Repair
} from './repairAction';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

interface RepairRowProps {
  repair: Repair;
  onDataChange?: () => void;
}

export function RepairRow({ repair, onDataChange }: RepairRowProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Get latest status
  const latestStatus =
    repair.RepairStatus?.length > 0
      ? repair.RepairStatus[repair.RepairStatus.length - 1].Status
      : 'analyzing';

  // Badge color based on status
  const getBadgeVariant = (
    status: string
  ): 'default' | 'destructive' | 'outline' | 'secondary' => {
    switch (status) {
      case 'analyzing':
        return 'default'; // blue
      case 'repairing':
        return 'secondary'; // purple
      case 'ready to pickup':
        return 'secondary'; // using secondary instead of success
      default:
        return 'outline'; // default
    }
  };

  const handleDelete = async () => {
    await deleteRepair(repair.ID);
    setShowDeleteDialog(false);
    if (onDataChange) onDataChange();
    router.refresh();
  };

  const handleUpdate = async (formData: FormData) => {
    formData.append('repairId', repair.ID.toString());
    await updateRepair(formData);
    setShowEditDialog(false);
    if (onDataChange) onDataChange();
    router.refresh();
  };

  const handleStatusUpdate = async (formData: FormData) => {
    formData.append('repairId', repair.ID.toString());
    await createRepairStatus(formData);
    setShowStatusDialog(false);
    if (onDataChange) onDataChange();
    router.refresh();
  };

  return (
    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <td className="p-4 align-middle font-medium">#{repair.ID}</td>
      <td className="p-4 align-middle">
        <Badge variant={getBadgeVariant(latestStatus)}>{latestStatus}</Badge>
      </td>
      <td className="p-4 align-middle">
        <div className="flex flex-col">
          <span>{repair.UserEmail}</span>
          <span className="text-xs text-muted-foreground">
            {repair.UserPhone}
          </span>
        </div>
      </td>
      <td className="p-4 align-middle">{repair.Product}</td>
      <td className="p-4 align-middle">{repair.Category}</td>
      <td className="p-4 align-middle">
        {new Date(repair.CreatedAt).toLocaleDateString()}
      </td>
      <td className="p-4 align-middle">
        {new Date(repair.UpdatedAt).toLocaleDateString()}
      </td>
      <td
        className="p-4 align-middle max-w-[200px] truncate"
        title={repair.Description}
      >
        {repair.Description}
      </td>
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Edit repair">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                // Prevent accidental closing when clicking outside
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                // Enable Escape key to close the dialog
                e.preventDefault();
                setShowEditDialog(false);
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Repair #{repair.ID}</DialogTitle>
              </DialogHeader>
              <form action={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userEmail">Customer Email</Label>
                  <Input
                    id="userEmail"
                    name="userEmail"
                    defaultValue={repair.UserEmail}
                    placeholder="Customer Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userPhone">Customer Phone</Label>
                  <Input
                    id="userPhone"
                    name="userPhone"
                    defaultValue={repair.UserPhone}
                    placeholder="Customer Phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Input
                    id="product"
                    name="product"
                    defaultValue={repair.Product}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={repair.Category}
                    placeholder="Category"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={repair.Description}
                    placeholder="Description"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Status Update Dialog */}
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Update status">
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                // Prevent accidental closing when clicking outside
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                // Enable Escape key to close the dialog
                e.preventDefault();
                setShowStatusDialog(false);
              }}
            >
              <DialogHeader>
                <DialogTitle>Update Repair Status</DialogTitle>
              </DialogHeader>
              <form action={handleStatusUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={latestStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyzing">Analyzing</SelectItem>
                      <SelectItem value="repairing">Repairing</SelectItem>
                      <SelectItem value="ready to pickup">
                        Ready to Pickup
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedBy">Updated By</Label>
                  <Input
                    id="updatedBy"
                    name="updatedBy"
                    defaultValue={repair.UserEmail}
                    placeholder="Updated by"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowStatusDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Status</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Delete repair">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              onInteractOutside={(e) => {
                // Prevent accidental closing when clicking outside
                e.preventDefault();
              }}
              onEscapeKeyDown={(e) => {
                // Enable Escape key to close the dialog
                e.preventDefault();
                setShowDeleteDialog(false);
              }}
            >
              <DialogHeader>
                <DialogTitle>Delete Repair</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete repair #{repair.ID}? This action
                cannot be undone.
              </p>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </td>
    </tr>
  );
}
