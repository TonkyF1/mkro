import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface RecipeFilterProps {
  categories: string[];
  dietaryTags: string[];
  selectedCategory: string;
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export const RecipeFilter = ({
  categories,
  dietaryTags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearFilters
}: RecipeFilterProps) => {
  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0;
  
  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">Filter Recipes</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="ml-auto text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Category Filter */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Category
        </label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Dietary Tags Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Dietary Preferences
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTags.includes(tag) 
                  ? "bg-primary text-primary-foreground" 
                  : "border-primary/30 text-primary hover:bg-primary/10"
              }`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};