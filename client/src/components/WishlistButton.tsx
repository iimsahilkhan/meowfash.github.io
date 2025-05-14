import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: number;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function WishlistButton({
  productId,
  variant = "ghost",
  size = "icon",
  className
}: WishlistButtonProps) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isPending, setIsPending] = useState(false);
  
  const isInList = isInWishlist(productId);
  
  const handleToggleWishlist = async () => {
    if (isPending) return;
    
    setIsPending(true);
    try {
      if (isInList) {
        // Find the wishlist item ID to remove
        const wishlistItems = useWishlist().items;
        const wishlistItem = wishlistItems.find(
          (item: { productId: number }) => item.productId === productId
        );
        if (wishlistItem) {
          await removeItem(wishlistItem.id);
        }
      } else {
        await addItem(productId);
      }
    } finally {
      setIsPending(false);
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-colors duration-200",
        isInList ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-700",
        isPending && "opacity-70 cursor-not-allowed",
        className
      )}
      onClick={handleToggleWishlist}
      disabled={isPending}
      aria-label={isInList ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInList ? (
        <Heart className="h-5 w-5 fill-current" />
      ) : (
        <Heart className="h-5 w-5" />
      )}
    </Button>
  );
}