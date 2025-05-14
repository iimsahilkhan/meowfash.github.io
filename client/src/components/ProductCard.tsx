import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Eye, ShoppingBag, Star, StarHalf } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product.id, 1);
  };

  const renderStars = (rating: number | null) => {
    // If rating is null or undefined, default to 0
    const ratingValue = rating === null || rating === undefined ? 0 : rating;
    
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="fill-accent text-accent w-4 h-4" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="fill-accent text-accent w-4 h-4" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-accent w-4 h-4" />);
    }

    return stars;
  };

  return (
    <Link href={`/product/${product.id}`} className="product-card group relative block">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover object-center transition duration-300"
        />
        <div className="quick-actions opacity-0 absolute inset-0 bg-primary/10 flex items-center justify-center space-x-2 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full hover:bg-secondary hover:text-white transition"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/product/${product.id}`;
            }}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <WishlistButton 
            productId={product.id}
            variant="ghost"
            size="icon"
            className="bg-white rounded-full hover:bg-secondary hover:text-white transition"
          />
          <Button
            variant="ghost"
            size="icon"
            className="bg-white rounded-full hover:bg-secondary hover:text-white transition"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
        </div>
        {product.isNewArrival && (
          <div className="absolute top-3 left-3">
            <Badge className="rounded-full bg-secondary text-white">NEW</Badge>
          </div>
        )}
        {product.isBestSeller && (
          <div className="absolute top-3 left-3">
            <Badge className="rounded-full bg-accent text-primary">BEST SELLER</Badge>
          </div>
        )}
        {product.isOnSale && (
          <div className="absolute top-3 left-3">
            <Badge className="rounded-full bg-primary text-white">SALE</Badge>
          </div>
        )}
      </div>
      <h3 className="font-montserrat font-medium text-lg mb-1">{product.name}</h3>
      <div className="flex justify-between items-center">
        <div>
          {product.salePrice ? (
            <>
              <p className="text-secondary font-bold">${product.salePrice.toFixed(2)}</p>
              <p className="text-neutral-dark line-through text-sm">${product.price.toFixed(2)}</p>
            </>
          ) : (
            <p className="text-secondary font-bold">${product.price.toFixed(2)}</p>
          )}
        </div>
        <div className="flex text-sm items-center">
          <div className="flex">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-neutral-dark ml-1">({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
