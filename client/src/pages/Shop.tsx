import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Helmet } from "react-helmet";
import ProductCard from "@/components/ProductCard";
import { Product } from "@shared/schema";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Shop() {
  const [location] = useLocation();
  const params = useParams();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const categoryFromUrl = params.category || urlParams.get('category');
  const searchQuery = urlParams.get('search');
  const isNewArrival = urlParams.get('new') === 'true';
  const isBestSeller = urlParams.get('best') === 'true';
  const isOnSale = urlParams.get('sale') === 'true';

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [sort, setSort] = useState("featured");

  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  const filteredProducts = allProducts?.filter(product => {
    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }
    
    // Special filters (new arrivals, best sellers, sale)
    if (isNewArrival && !product.isNewArrival) return false;
    if (isBestSeller && !product.isBestSeller) return false;
    if (isOnSale && !product.isOnSale) return false;
    
    // Price range filter
    const price = product.salePrice || product.price;
    if (price < priceRange.min || price > priceRange.max) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = filteredProducts ? [...filteredProducts] : [];
  if (sort === "price-low") {
    sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  } else if (sort === "price-high") {
    sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  } else if (sort === "name-asc") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = parseFloat(value) || 0;
    setPriceRange(prev => ({ ...prev, [field]: numValue }));
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  const categories = ["women", "men", "accessories"];
  const pageTitle = searchQuery 
    ? `Search results for "${searchQuery}" | MEOWTH FASHION`
    : isNewArrival
      ? "New Arrivals | MEOWTH FASHION"
      : isBestSeller
        ? "Best Sellers | MEOWTH FASHION"
        : isOnSale
          ? "Sale | MEOWTH FASHION"
          : categoryFromUrl
            ? `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Collection | MEOWTH FASHION`
            : "Shop All | MEOWTH FASHION";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta 
          name="description" 
          content={`Shop ${searchQuery ? `for ${searchQuery}` : categoryFromUrl || 'all products'} at MEOWTH FASHION. Find the latest styles and trends for every occasion.`} 
        />
      </Helmet>
      
      <div className="bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            {searchQuery 
              ? `Search Results: "${searchQuery}"`
              : isNewArrival
                ? "New Arrivals"
                : isBestSeller
                  ? "Best Sellers"
                  : isOnSale
                    ? "Sale"
                    : categoryFromUrl
                      ? `${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Collection`
                      : "All Products"}
          </h1>
          <p className="text-neutral-dark">
            {filteredProducts 
              ? `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
              : 'Loading products...'}
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar (desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <h2 className="font-montserrat font-bold text-lg mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="font-montserrat font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="ml-2 capitalize"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-montserrat font-medium mb-3">Price Range</h3>
              <div className="flex space-x-2 items-center">
                <Input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-montserrat font-medium mb-3">Product Status</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox 
                    id="new-arrivals" 
                    checked={isNewArrival}
                    onCheckedChange={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('new', isNewArrival ? 'false' : 'true');
                      window.history.pushState({}, '', url.toString());
                      window.location.reload();
                    }}
                  />
                  <Label htmlFor="new-arrivals" className="ml-2">New Arrivals</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="best-sellers"
                    checked={isBestSeller}
                    onCheckedChange={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('best', isBestSeller ? 'false' : 'true');
                      window.history.pushState({}, '', url.toString());
                      window.location.reload();
                    }}
                  />
                  <Label htmlFor="best-sellers" className="ml-2">Best Sellers</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox 
                    id="on-sale"
                    checked={isOnSale}
                    onCheckedChange={() => {
                      const url = new URL(window.location.href);
                      url.searchParams.set('sale', isOnSale ? 'false' : 'true');
                      window.history.pushState({}, '', url.toString());
                      window.location.reload();
                    }}
                  />
                  <Label htmlFor="on-sale" className="ml-2">On Sale</Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile filters accordion */}
          <div className="md:hidden mb-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger className="font-montserrat font-bold">Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-6">
                    <h3 className="font-montserrat font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`mobile-category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <Label 
                            htmlFor={`mobile-category-${category}`}
                            className="ml-2 capitalize"
                          >
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-montserrat font-medium mb-3">Price Range</h3>
                    <div className="flex space-x-2 items-center">
                      <Input
                        type="number"
                        min={0}
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        className="w-24"
                      />
                      <span>to</span>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-montserrat font-medium mb-3">Product Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="mobile-new-arrivals" />
                        <Label htmlFor="mobile-new-arrivals" className="ml-2">New Arrivals</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="mobile-best-sellers" />
                        <Label htmlFor="mobile-best-sellers" className="ml-2">Best Sellers</Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="mobile-on-sale" />
                        <Label htmlFor="mobile-on-sale" className="ml-2">On Sale</Label>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Product grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-dark">
                {filteredProducts 
                  ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'product' : 'products'}`
                  : ''}
              </p>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-4">
                    <Skeleton className="w-full h-96 rounded-lg" />
                    <Skeleton className="w-3/4 h-5" />
                    <div className="flex justify-between">
                      <Skeleton className="w-1/4 h-5" />
                      <Skeleton className="w-1/4 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-montserrat font-medium mb-2">No products found</h3>
                <p className="text-neutral-dark mb-6">Try adjusting your filters or search criteria</p>
                <Button asChild variant="default" className="bg-secondary hover:bg-secondary/90">
                  <a href="/shop">View All Products</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
