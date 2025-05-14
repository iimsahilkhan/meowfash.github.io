import { Product } from "@shared/schema";

// Get formatted price display with sale price if available
export function getFormattedPrice(product: Product): string {
  if (product.salePrice) {
    return `$${product.salePrice.toFixed(2)} <span class="text-neutral-dark line-through">$${product.price.toFixed(2)}</span>`;
  }
  return `$${product.price.toFixed(2)}`;
}

// Calculate discount percentage
export function getDiscountPercentage(product: Product): number | null {
  if (!product.salePrice) return null;
  
  const discount = product.price - product.salePrice;
  const percentage = (discount / product.price) * 100;
  return Math.round(percentage);
}

// Get product categories
export function getUniqueCategories(products: Product[]): string[] {
  const categoriesSet = new Set<string>();
  
  products.forEach(product => {
    if (product.category) {
      categoriesSet.add(product.category);
    }
  });
  
  return Array.from(categoriesSet);
}

// Get product subcategories
export function getUniqueSubcategories(products: Product[]): string[] {
  const subcategoriesSet = new Set<string>();
  
  products.forEach(product => {
    if (product.subcategory) {
      subcategoriesSet.add(product.subcategory);
    }
  });
  
  return Array.from(subcategoriesSet);
}

// Filter products by various criteria
export function filterProducts(
  products: Product[],
  filters: {
    category?: string;
    subcategory?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    onSale?: boolean;
    newArrivals?: boolean;
    bestSellers?: boolean;
  }
): Product[] {
  return products.filter(product => {
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Subcategory filter
    if (filters.subcategory && product.subcategory !== filters.subcategory) {
      return false;
    }
    
    // Price range filter
    const price = product.salePrice || product.price;
    if (filters.minPrice && price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && price > filters.maxPrice) {
      return false;
    }
    
    // Sale filter
    if (filters.onSale && !product.isOnSale) {
      return false;
    }
    
    // New arrivals filter
    if (filters.newArrivals && !product.isNewArrival) {
      return false;
    }
    
    // Best sellers filter
    if (filters.bestSellers && !product.isBestSeller) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
}

// Sort products by different criteria
export function sortProducts(
  products: Product[],
  sortBy: 'featured' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'newest'
): Product[] {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    
    case 'price-high':
      return sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'newest':
      return sortedProducts.filter(p => p.isNewArrival).concat(
        sortedProducts.filter(p => !p.isNewArrival)
      );
    
    // Featured - prioritize best sellers and new arrivals
    default:
      return sortedProducts.sort((a, b) => {
        if (a.isBestSeller && !b.isBestSeller) return -1;
        if (!a.isBestSeller && b.isBestSeller) return 1;
        if (a.isNewArrival && !b.isNewArrival) return -1;
        if (!a.isNewArrival && b.isNewArrival) return 1;
        return 0;
      });
  }
}

// Generate star ratings UI data
export function generateStarRating(rating: number): { type: 'full' | 'half' | 'empty' }[] {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push({ type: 'full' as const });
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push({ type: 'half' as const });
  }

  // Add empty stars
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push({ type: 'empty' as const });
  }

  return stars;
}

// Get related products recommendation
export function getRelatedProducts(
  product: Product,
  allProducts: Product[],
  count: number = 4
): Product[] {
  // Get products in the same category
  const categoryProducts = allProducts.filter(
    p => p.id !== product.id && p.category === product.category
  );
  
  // If we have enough products in the same category, return them
  if (categoryProducts.length >= count) {
    return categoryProducts.slice(0, count);
  }
  
  // Otherwise, add some products from other categories to reach the count
  const otherProducts = allProducts.filter(
    p => p.id !== product.id && p.category !== product.category
  );
  
  return [...categoryProducts, ...otherProducts].slice(0, count);
}
