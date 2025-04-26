'use client';

import { Suspense, useEffect, useState } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { getRepairs, Repair } from './repairAction';
import { RepairRow } from './repairRow';
import { RepairInputDialog } from './repairInputDialog';
import { toast } from 'sonner';

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRepairs() {
    setLoading(true);
    try {
      const data = await getRepairs();
      setRepairs(data);
    } catch (error) {
      console.error('Error loading repairs:', error);
      toast.error('Failed to load repairs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepairs();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Repairs</h1>
        <Dialog>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Repair
                </span>
              </Button>
            </DialogTrigger>
          </div>
          {/* Create Repair Dialog */}
          <RepairInputDialog />
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading repairs...</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Product
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Created
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Updated
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {repairs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No repairs found. Add your first repair using the button
                      above.
                    </td>
                  </tr>
                ) : (
                  repairs.map((repair) => (
                    <RepairRow key={repair.ID} repair={repair} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
