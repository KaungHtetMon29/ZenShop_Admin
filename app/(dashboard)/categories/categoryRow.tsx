import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from './page';

interface CategoryRowProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}

export function CategoryRow({ category, onEdit, onDelete }: CategoryRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{category.ID}</TableCell>
      <TableCell className="hidden md:table-cell">{category.Name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(category.CreatedAt).toLocaleDateString()}
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
