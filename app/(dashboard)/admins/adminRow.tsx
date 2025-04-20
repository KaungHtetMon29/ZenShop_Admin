import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { banUser } from '../users/userActions';
import { Prisma } from '@prisma/client';
import { deleteAdmin } from './adminActions';

export function AdminRow({ product }: { product: Prisma.adminGetPayload<{}> }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.image}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{product.id}</TableCell>
      <TableCell className="hidden md:table-cell">{`${product.name}`}</TableCell>
      <TableCell className="hidden md:table-cell">{product.email}</TableCell>
      <TableCell className="hidden md:table-cell">{product.role}</TableCell>
      {/* <TableCell>
        <Badge variant="outline" className="capitalize bg-green-600 text-white">
          {product}
        </Badge>
      </TableCell> */}
      {/* <TableCell className="hidden md:table-cell">
        {product.availableAt.toLocaleDateString('en-US')}
      </TableCell> */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <form action={deleteAdmin}>
                <input type="hidden" name="adminId" value={product.id} />
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
