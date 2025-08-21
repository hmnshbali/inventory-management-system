import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setSearchTerm,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  clearError
} from '../store/productsSlice';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { ProductForm } from './ProductForm';
import { SearchFilters } from './SearchFilters';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useToast } from '../hooks/use-toast';
import { Plus, Package, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  
  const {
    products,
    loading,
    error,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder
  } = useSelector((state: RootState) => state.products);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(product => product.category)));
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast({
          title: "Success",
          description: "Product deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };

  const handleFormSubmit = async (productData: Omit<Product, 'id'> | Product) => {
    try {
      if ('id' in productData) {
        await dispatch(updateProduct(productData)).unwrap();
        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        await dispatch(addProduct(productData)).unwrap();
        toast({
          title: "Success", 
          description: "Product added successfully"
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">Manage your product catalog</p>
            </div>
            <Button onClick={handleAddProduct} variant="gradient" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          sortOrder={sortOrder}
          categories={categories}
          onSearchTermChange={(term) => dispatch(setSearchTerm(term))}
          onCategoryChange={(category) => dispatch(setSelectedCategory(category === "all" ? "" : category))}
          onSortByChange={(sort) => dispatch(setSortBy(sort))}
          onSortOrderChange={(order) => dispatch(setSortOrder(order))}
        />

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Products ({filteredAndSortedProducts.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => handleEditProduct(product)}
                  onDelete={() => handleDeleteProduct(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
    </>
  );
};