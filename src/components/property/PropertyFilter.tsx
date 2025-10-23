
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/utils/format';

interface PropertyFilterProps {
  onFilterChange: (filters: {
    category: string;
    minPrice: number;
    maxPrice: number;
  }) => void;
  activeCategory: string;
}

const PropertyFilter = ({ onFilterChange, activeCategory }: PropertyFilterProps) => {
  const [category, setCategory] = useState<string>(activeCategory || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000000]);
  
  // Max price in the system (500 million Naira)
  const MAX_PRICE = 500000000;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({
      category: value,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handlePriceChange = (value: number[]) => {
    const newPriceRange: [number, number] = [value[0], value[1]];
    setPriceRange(newPriceRange);
    onFilterChange({
      category,
      minPrice: newPriceRange[0],
      maxPrice: newPriceRange[1],
    });
  };

  const handleReset = () => {
    setCategory('all');
    setPriceRange([0, MAX_PRICE]);
    onFilterChange({
      category: 'all',
      minPrice: 0,
      maxPrice: MAX_PRICE,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 space-y-6 shadow-sm">
      <div>
        <h3 className="font-serif text-lg font-medium mb-4">Categories</h3>
        <RadioGroup
          value={category}
          onValueChange={handleCategoryChange}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All Properties</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="land" id="land" />
            <Label htmlFor="land" className="cursor-pointer">Land</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="carcass" id="carcass" />
            <Label htmlFor="carcass" className="cursor-pointer">Carcass (Uncompleted)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="finished" id="finished" />
            <Label htmlFor="finished" className="cursor-pointer">Finished Buildings</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-serif text-lg font-medium mb-4">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            min={0}
            max={MAX_PRICE}
            step={1000000}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilter;
