'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { File, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CategoryRow } from './categoryRow';
import { addCategory } from './categoryAction';
import { DataTable } from '../DataTable';

export interface Category {
  ID: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt?: string;
}

export type CategoryResponse = {
  count: number;
  data: Category[];
  status: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Function to fetch categories data
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/categories');
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler for form submission
  const handleAddCategory = async (formData: FormData) => {
    await addCategory(formData);
    setDialogOpen(false);
    fetchCategories(); // Refresh data after adding
    toast.success('Category added successfully');
  };

  // Handler for category update
  const handleUpdateCategory = async (formData: FormData) => {
    try {
      if (!currentCategory) return;

      const categoryId = currentCategory.ID;
      const categoryName = formData.get('categoryName') as string;

      const response = await fetch(
        `http://localhost:8080/categories/${categoryId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Name: categoryName })
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating category: ${response.status}`);
      }

      setDialogOpen(false);
      setCurrentCategory(null);
      setIsEditing(false);
      fetchCategories(); // Refresh data after updating
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Function to open edit dialog
  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Function to handle category deletion
  const handleDeleteCategory = async () => {
    try {
      if (!categoryToDelete) return;

      const categoryId = categoryToDelete.ID;

      const response = await fetch(
        `http://localhost:8080/categories/${categoryId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting category: ${response.status}`);
      }

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories(); // Refresh data after deleting
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="flex items-center mb-4">
        <h1 className="text-3xl font-bold">Categories</h1>
        <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setCurrentCategory(null);
                setIsEditing(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Category
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Category' : 'Add New Category'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the category details. Click save when you're done."
                    : "Fill in the category details. Click save when you're done."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <form
                  action={isEditing ? handleUpdateCategory : handleAddCategory}
                  className="flex flex-col gap-4"
                >
                  <Input
                    name="categoryName"
                    type="text"
                    placeholder="Category Name"
                    required
                    defaultValue={currentCategory?.Name || ''}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {isEditing ? 'Update Category' : 'Save Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : categories && categories.data ? (
        <DataTable
          description="List of Categories"
          fields={['Id', 'Category Name', 'Created', 'Actions']}
          label="Categories"
          offset={5}
          totalProducts={categories.count || 0}
        >
          {categories.data.map((category: Category) => (
            <CategoryRow
              key={category.ID}
              category={category}
              onEdit={() => openEditDialog(category)}
              onDelete={() => openDeleteDialog(category)}
            />
          ))}
        </DataTable>
      ) : (
        <div className="py-10 text-center">
          <p>
            No categories found. Add your first category using the button above.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "
              {categoryToDelete?.Name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
