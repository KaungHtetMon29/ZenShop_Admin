'use client';

import { useState, useEffect } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getRepairs, Repair, RepairResponse } from './repairAction';
import { RepairRow } from './repairRow';
import { RepairInputDialog } from './repairInputDialog';
import { useSearchParams } from 'next/navigation';

export default function RepairsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 5;

  const [repairsData, setRepairsData] = useState<RepairResponse>({
    data: [],
    count: 0,
    page: page,
    limit: ITEMS_PER_PAGE
  });
  const [loading, setLoading] = useState(true);

  async function loadRepairs() {
    setLoading(true);
    try {
      const data = await getRepairs(page, ITEMS_PER_PAGE);
      setRepairsData(data);
    } catch (error) {
      console.error('Error loading repairs:', error);
      toast.error('Failed to load repairs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepairs();
  }, [page]); // Reload when the page changes

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
          <RepairInputDialog onSuccess={loadRepairs} />
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <DataTable
            description="Manage and track product repairs"
            fields={[
              'ID',
              'Status',
              'Customer',
              'Product',
              'Category',
              'Created',
              'Updated',
              'Description',
              'Actions'
            ]}
            label="Repairs"
            offset={(page - 1) * ITEMS_PER_PAGE + repairsData.data.length}
            totalProducts={repairsData.count}
            limit={ITEMS_PER_PAGE}
          >
            {repairsData.data.length === 0 ? (
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
              repairsData.data.map((repair) => (
                <RepairRow 
                  key={repair.ID} 
                  repair={repair} 
                  onDataChange={loadRepairs}
                />
              ))
            )}
          </DataTable>
        </div>
      )}
    </div>
  );
}
