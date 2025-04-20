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
import { Brand } from './page';
import { deleteBrand } from './brandAction';
import { DialogTrigger } from '@radix-ui/react-dialog';

export function BrandRow({ product }: { product: Brand }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{product.ID}</TableCell>
      <TableCell className="hidden md:table-cell">{`${product.Name}`}</TableCell>
      <TableCell className="hidden md:table-cell">
        {product.CreatedAt}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.UpdatedAt}
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
            <DialogTrigger asChild>
              <DropdownMenuItem>
                Update
                {/* <form action={() => {}}>
                <input type="hidden" name="userId" value={product.id} />
                <input type="hidden" name="userStatus" value={product.status} />
                <button type="submit">
                  {product.status !== 'banned' ? 'Ban' : 'Allow'}
                </button>
              </form> */}
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem>
              <form action={deleteBrand}>
                <input type="hidden" name="brandId" value={product.ID} />
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
