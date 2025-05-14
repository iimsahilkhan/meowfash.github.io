import { Link } from "wouter";
import { SheetContent, Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartOverlay() {
  const { 
    items, 
    itemCount, 
    subtotal, 
    isLoading, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const freeShipping = subtotal >= 75;

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
        <div className="p-6 flex justify-between items-center border-b">
          <h3 className="font-montserrat font-bold text-xl">Your Cart ({itemCount})</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="text-neutral-dark hover:text-secondary"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-grow p-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex mb-6 pb-6 border-b">
                <Skeleton className="w-20 h-24 rounded" />
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                  </div>
                  <Skeleton className="w-1/2 h-4 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-24 h-8" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                </div>
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-neutral-dark mb-4">Your cart is empty</p>
              <Button 
                asChild
                variant="default"
                className="bg-secondary text-white hover:bg-secondary/90"
              >
                <Link href="/shop">START SHOPPING</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={item.id} item={item} isOverlay={true} />
            ))
          )}
        </div>
        
        {items.length > 0 && (
          <div className="p-6 border-t">
            <div className="flex justify-between mb-2">
              <span className="font-montserrat">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-montserrat">Shipping</span>
              <span>
                {freeShipping ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  "Calculated at checkout"
                )}
              </span>
            </div>
            {!freeShipping && (
              <p className="text-xs text-neutral-dark mb-4">
                Add ${(75 - subtotal).toFixed(2)} more to qualify for free shipping
              </p>
            )}
            <Separator className="my-4" />
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
              <Button className="w-full bg-secondary text-white hover:bg-secondary/90 mb-3">
                CHECKOUT
              </Button>
            </Link>
            <Link href="/cart" onClick={() => setIsCartOpen(false)}>
              <Button variant="outline" className="w-full border-primary hover:bg-primary hover:text-white">
                VIEW CART
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
