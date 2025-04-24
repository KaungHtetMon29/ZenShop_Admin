import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { ProductRes as ProductType } from '../types';

interface ProductRowProps {
  product: any;
  onEdit: (product: ProductType) => void;
  onDelete: (product: ProductType) => void;
}

export const ProductRow = ({ product, onEdit, onDelete }: ProductRowProps) => {
  return (
    <TableRow>
      <TableCell>
        {product.ImageURL && (
          <div className="w-10 h-10 relative rounded-md overflow-hidden">
            <Image
              src={product.ImageURL}
              alt={product.Name}
              fill
              sizes="40px"
              className="object-cover"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
            />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{product.ID}</TableCell>
      <TableCell>{product.Name}</TableCell>
      <TableCell>{product.Brand.Name}</TableCell>
      <TableCell>{product.Category.Name}</TableCell>
      <TableCell>{product.Stock}</TableCell>
      <TableCell>${product.Price}</TableCell>
      <TableCell>
        {product.CreatedAt
          ? new Date(product.CreatedAt).toLocaleDateString()
          : 'N/A'}
      </TableCell>
      <TableCell>
        {product.UpdatedAt
          ? new Date(product.UpdatedAt).toLocaleDateString()
          : 'N/A'}
      </TableCell>
      <TableCell>{product.UpdateBy}</TableCell>
      <TableCell className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
