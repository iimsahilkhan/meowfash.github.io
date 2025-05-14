import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

export default function Wishlist() {
  const { items, isLoading, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId, 1);
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async (id: number) => {
    try {
      await removeItem(id);
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      await clearWishlist();
      toast({
        title: "Wishlist Cleared",
        description: "Your wishlist has been cleared",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not clear wishlist",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Wishlist | MEOWTH FASHION</title>
        <meta name="description" content="View your saved items in your wishlist at MEOWTH FASHION. Save your favorite items for later." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-montserrat mb-8">My Wishlist</h1>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg">
                <Skeleton className="h-40 w-40 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Heart className="h-20 w-20 text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">
              Browse our collection and save your favorite items for later.
            </p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-neutral-dark">
                {items.length} {items.length === 1 ? "item" : "items"} in your wishlist
              </p>
              <Button 
                variant="outline" 
                className="text-red-500 flex items-center border-red-200"
                onClick={handleClearWishlist}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Wishlist
              </Button>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 border p-4 rounded-lg">
                  <Link href={`/product/${item.productId}`} className="block">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-40 w-40 object-cover rounded-md"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link href={`/product/${item.productId}`}>
                        <h2 className="text-xl font-semibold mb-2 hover:text-secondary transition-colors">
                          {item.product.name}
                        </h2>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-neutral-dark mb-4 line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        {item.product.salePrice ? (
                          <div className="flex items-center">
                            <span className="text-xl font-bold text-secondary mr-2">
                              ${item.product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-neutral-dark line-through">
                              ${item.product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-secondary">
                            ${item.product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <Button
                        className="bg-secondary hover:bg-secondary/90"
                        size="sm"
                        onClick={() => handleAddToCart(item.productId)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}