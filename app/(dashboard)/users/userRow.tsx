import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
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
import { banUser, deleteUser } from './userActions';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export function UserRow({ product }: { product: Prisma.userGetPayload<{}> }) {
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
      <TableCell>
        <Badge
          variant="outline"
          className={`capitalize ${product.status !== 'banned' ? 'bg-green-600' : 'bg-red-600'} text-white`}
        >
          {product.status}
        </Badge>
      </TableCell>
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
              <form action={banUser}>
                <input type="hidden" name="userId" value={product.id} />
                <input type="hidden" name="userStatus" value={product.status} />
                <button type="submit">
                  {product.status !== 'banned' ? 'Ban' : 'Allow'}
                </button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteUser}>
                <input type="hidden" name="userId" value={product.id} />
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
