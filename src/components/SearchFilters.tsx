import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'name' | 'price' | 'category';
  sortOrder: 'asc' | 'desc';
  categories: string[];
  onSearchTermChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onSortByChange: (sortBy: 'name' | 'price' | 'category') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  selectedCategory,
  sortBy,
  sortOrder,
  categories,
  onSearchTermChange,
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
}) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Search & Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Category Filter */}
        <Select value={selectedCategory || "all"} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Sort Order */}
        <Button
          variant="outline"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="justify-start"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </Button>
      </div>
    </div>
  );
};