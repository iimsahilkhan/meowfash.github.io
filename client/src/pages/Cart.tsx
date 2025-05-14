import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cart() {
  const { items, itemCount, subtotal, clearCart, isLoading } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const { toast } = useToast();

  const shipping = subtotal >= 75 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (promoCode.trim().toUpperCase() === "MEOW25") {
      toast({
        title: "Promo code applied!",
        description: "25% discount has been applied to your first order.",
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please enter a valid promo code and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Your Cart | MEOWTH FASHION</title>
        <meta name="description" content="Review and manage your shopping cart at MEOWTH FASHION. Adjust quantities, apply promo codes, and checkout securely." />
      </Helmet>
      
      <div className="bg-neutral-light py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
            Your Shopping Cart
          </h1>
          <p className="text-neutral-dark">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow lg:w-2/3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex mb-8 pb-8 border-b">
                  <Skeleton className="w-24 h-32 rounded" />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="w-3/4 h-6" />
                      <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                    <Skeleton className="w-1/2 h-4 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="w-32 h-10 rounded" />
                      <Skeleton className="w-16 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:w-1/3">
              <Skeleton className="w-full h-64 rounded-lg" />
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-neutral-dark" />
            <h2 className="text-2xl font-montserrat font-bold mb-4">Your cart is empty</h2>
            <p className="text-neutral-dark mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="bg-secondary hover:bg-secondary/90">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-grow lg:w-2/3">
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-montserrat font-bold">Cart Items</h2>
                  <Button 
                    variant="ghost" 
                    className="text-neutral-dark hover:text-secondary"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
                
                <div>
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-montserrat font-bold mb-4">Promo Code</h2>
                <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter promo code"
                    className="flex-grow"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Apply
                  </Button>
                </form>
                <p className="text-sm text-neutral-dark mt-2">
                  Try using code <span className="font-semibold">MEOW25</span> for 25% off your first order
                </p>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="text-xl font-montserrat font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-dark">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-dark">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>${shipping.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {shipping > 0 && (
                    <div className="text-xs text-neutral-dark">
                      Add ${(75 - subtotal).toFixed(2)} more to qualify for free shipping
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90">
                  <Link href="/checkout" className="flex items-center justify-center">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="mt-4 text-center">
                  <Link href="/shop" className="text-sm text-primary hover:text-secondary">
                    Continue Shopping
                  </Link>
                </div>
                
                <div className="mt-6 pt-4 border-t text-xs text-neutral-dark space-y-2">
                  <p>We accept:</p>
                  <div className="flex space-x-2 justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                      alt="Visa" 
                      className="h-6 w-auto" 
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                      alt="Mastercard" 
                      className="h-6 w-auto" 
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                      alt="PayPal" 
                      className="h-6 w-auto" 
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/4/40/Apple_Pay_logo.svg" 
                      alt="Apple Pay" 
                      className="h-6 w-auto" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
