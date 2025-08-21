import React from 'react';
import { Product } from '../types/product';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Edit, Trash2, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
  const getStockStatus = (rating: { count: number }) => {
    if (rating.count > 100) return { label: 'In Stock', variant: 'default' as const };
    if (rating.count > 50) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'Out of Stock', variant: 'destructive' as const };
  };

  const stockStatus = getStockStatus(product.rating);

  return (
    <Card className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-card-foreground line-clamp-2 leading-tight">
              {product.title}
            </h3>
            <Badge variant={stockStatus.variant} className="text-xs font-medium">
              {stockStatus.label}
            </Badge>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating.rate}</span>
              <span className="text-xs">({product.rating.count})</span>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="flex-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(product.id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};