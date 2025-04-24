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
import { MoreHorizontal, Edit, Delete, Trash2 } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Brand } from './page';
import { deleteBrand } from './brandAction';
import { DialogTrigger } from '@radix-ui/react-dialog';

interface BrandRowProps {
  product: Brand;
  onEdit: () => void;
  onDelete: () => void;
}

export function BrandRow({ product, onEdit, onDelete }: BrandRowProps) {
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
      <TableCell className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
