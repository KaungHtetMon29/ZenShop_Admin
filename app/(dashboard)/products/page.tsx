'use client';

import { useState, useEffect } from 'react';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Product, ProductResponse } from '../product';
import { ProductRow } from './productRow';
import { toast } from 'sonner';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProducts
} from './productAction';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSearchParams } from 'next/navigation';

interface Category {
  ID: number;
  Name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const ITEMS_PER_PAGE = 5;

  const [products, setProducts] = useState<ProductResponse>({
    data: [],
    count: 0,
    page: page,
    limit: ITEMS_PER_PAGE
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ ID: number; Name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Function to fetch products data with pagination
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(page, ITEMS_PER_PAGE);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/categories');
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Function to fetch brands for dropdown
  const fetchBrands = async () => {
    try {
      const response = await fetch('http://localhost:8080/brands');
      if (!response.ok) {
        throw new Error(`Error fetching brands: ${response.status}`);
      }
      const data = await response.json();
      setBrands(data.data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  // Initial data load with dependency on page
  useEffect(() => {
    loadProducts();

    // Only fetch categories and brands once, not on every page change
    if (categories.length === 0) {
      fetchCategories();
    }
    if (brands.length === 0) {
      fetchBrands();
    }
  }, [page]);

  // Handler for form submission
  const handleAddProduct = async (formData: FormData) => {
    try {
      const result = await addProduct(formData);
      if (result.success) {
        setDialogOpen(false);
        toast.success('Product added successfully');
        loadProducts(); // Refresh data after adding
      } else {
        toast.error('Failed to add product: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  // Handler for product update
  const handleUpdateProduct = async (formData: FormData) => {
    try {
      const result = await updateProduct(formData);
      if (result.success) {
        setDialogOpen(false);
        setCurrentProduct(null);
        setIsEditing(false);
        toast.success('Product updated successfully');
        loadProducts(); // Refresh data after updating
      } else {
        toast.error('Failed to update product: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  // Function to open edit dialog
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Function to handle product deletion
  const handleDeleteProduct = async () => {
    try {
      if (!productToDelete) return;

      const result = await deleteProduct(productToDelete.ID);
      if (result.success) {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        toast.success('Product deleted successfully');
        loadProducts(); // Refresh data after deleting
      } else {
        toast.error('Failed to delete product: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Function to open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) {
                setCurrentProduct(null);
                setIsEditing(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Product
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the product details. Click save when you're done."
                    : "Fill in the product details. Click save when you're done."}
                </DialogDescription>
              </DialogHeader>
              <form
                action={isEditing ? handleUpdateProduct : handleAddProduct}
                className="grid gap-5 py-4"
              >
                {isEditing && (
                  <input
                    type="hidden"
                    name="productId"
                    value={currentProduct?.ID}
                  />
                )}

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="name">Product Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Product Name"
                    required
                    defaultValue={currentProduct?.Name || ''}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="price">Price*</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Price"
                      required
                      defaultValue={currentProduct?.Price || ''}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="stock">Stock*</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="Stock"
                      required
                      defaultValue={currentProduct?.Stock || ''}
                    />
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="image">
                      Image {isEditing ? '' : '(Optional)'}
                    </Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      placeholder="Image"
                    />
                    {currentProduct?.ImageURL && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Current image: {currentProduct.ImageURL}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="categoryId">Category*</Label>
                    <Select
                      name="categoryId"
                      defaultValue={
                        currentProduct?.CategoryID?.toString() || ''
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.ID}
                            value={category.ID.toString()}
                          >
                            {category.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="brandId">Brand*</Label>
                    <Select
                      name="brandId"
                      defaultValue={currentProduct?.BrandID?.toString() || ''}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem
                            key={brand.ID}
                            value={brand.ID.toString()}
                          >
                            {brand.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">
                    {isEditing ? 'Update Product' : 'Save Product'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <p>Loading...</p>
        </div>
      ) : products && products.data ? (
        <div className="border rounded-md">
          <DataTable
            description="Manage and organize your product inventory"
            fields={[
              'Image',
              'ID',
              'Name',
              'Brand',
              'Category',
              'Stock',
              'Price',
              'Created At',
              'Updated At',
              'Updated By',
              'Actions'
            ]}
            label="Products"
            offset={(page - 1) * ITEMS_PER_PAGE + products.data.length}
            totalProducts={products.count}
            limit={ITEMS_PER_PAGE}
          >
            {products.data.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="p-4 text-center text-muted-foreground"
                >
                  No products found. Add your first product using the button
                  above.
                </td>
              </tr>
            ) : (
              products.data.map((product: Product) => (
                <ProductRow
                  key={product.ID}
                  product={product}
                  onEdit={() => openEditDialog(product)}
                  onDelete={() => openDeleteDialog(product)}
                />
              ))
            )}
          </DataTable>
        </div>
      ) : (
        <div className="py-10 text-center">
          <p>
            No products found. Add your first product using the button above.
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the product "
              {productToDelete?.Name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
