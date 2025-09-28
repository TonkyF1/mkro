import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X, User } from 'lucide-react';
import { loadUserProfile } from '@/lib/userProfile';

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
  const userProfile = loadUserProfile();
  
  // Get user's preferred dietary tags
  const userPreferences = userProfile?.dietaryPreferences || [];
  
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
      
      {/* User Profile Preferences */}
      {userProfile && userPreferences.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <label className="text-sm font-medium text-foreground">
              Your Preferences
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {userPreferences.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer transition-colors"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* All Dietary Tags Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          All Dietary Options
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedTags.includes(tag) 
                  ? "bg-primary text-primary-foreground" 
                  : userPreferences.includes(tag)
                    ? "border-primary text-primary hover:bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground hover:border-primary/30 hover:text-primary"
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