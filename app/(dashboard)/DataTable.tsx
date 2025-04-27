'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

export function DataTable({
  children,
  label,
  description,
  fields,
  offset = 0,
  totalProducts = 0,
  limit = 5
}: {
  children: React.ReactNode;
  label: string;
  description: string;
  fields: string[];
  offset?: number;
  totalProducts?: number;
  limit?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Current page calculation
  const currentPage = Math.ceil(offset / limit) || 1;
  const totalPages = Math.ceil(totalProducts / limit);

  function createQueryString(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  }

  function prevPage() {
    if (currentPage <= 1) return;
    const prevPageNumber = currentPage - 1;
    const page = prevPageNumber.toString();
    router.push(`${pathname}?${createQueryString('page', page)}`, {
      scroll: false
    });
  }

  function nextPage() {
    if (currentPage >= totalPages) return;
    const nextPageNumber = currentPage + 1;
    const page = nextPageNumber.toString();
    router.push(`${pathname}?${createQueryString('page', page)}`, {
      scroll: false
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {fields.map((field, index) => (
                <TableHead key={index}>{field}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <strong>
              {totalProducts === 0
                ? '0'
                : `${(currentPage - 1) * limit + 1}-${Math.min(
                    currentPage * limit,
                    totalProducts
                  )}`}
            </strong>{' '}
            of <strong>{totalProducts}</strong> items
          </div>
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
