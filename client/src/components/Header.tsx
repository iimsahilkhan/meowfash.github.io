import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/useCart";
import CartOverlay from "./CartOverlay";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X,
  Cat
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, setIsCartOpen } = useCart();
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-secondary text-white text-center py-2 text-sm">
        <p>Free shipping on all orders over $75 | Use code MEOW25 for 25% off your first order</p>
      </div>

      {/* Main header with logo and navigation */}
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Mobile menu button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link href="/" className="font-montserrat font-medium py-2 border-b border-gray-100">HOME</Link>
              <Link href="/shop?category=women" className="font-montserrat font-medium py-2 border-b border-gray-100">WOMEN</Link>
              <Link href="/shop?category=men" className="font-montserrat font-medium py-2 border-b border-gray-100">MEN</Link>
              <Link href="/shop?category=accessories" className="font-montserrat font-medium py-2 border-b border-gray-100">ACCESSORIES</Link>
              <Link href="/shop?sale=true" className="font-montserrat font-medium py-2">SALE</Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold font-montserrat tracking-tight">
            MEOWTH <span className="text-secondary">FASHION</span>
          </span>
          <Cat className="w-6 h-6 ml-2 text-accent" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8">
          <Link href="/" className="font-montserrat font-medium hover:text-secondary transition">HOME</Link>
          <Link href="/shop?category=women" className="font-montserrat font-medium hover:text-secondary transition">WOMEN</Link>
          <Link href="/shop?category=men" className="font-montserrat font-medium hover:text-secondary transition">MEN</Link>
          <Link href="/shop?category=accessories" className="font-montserrat font-medium hover:text-secondary transition">ACCESSORIES</Link>
          <Link href="/shop?sale=true" className="font-montserrat font-medium hover:text-secondary transition">SALE</Link>
        </nav>

        {/* Search, Account, Wishlist, Cart icons */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-primary hover:text-secondary transition"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Link href="/account" className="text-primary hover:text-secondary transition">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
          
          <Link href="/wishlist" className="text-primary hover:text-secondary transition">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="text-primary hover:text-secondary transition relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="bg-white w-full py-4 px-4 border-t border-gray-200">
          <div className="container mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 px-4 pr-10 border-gray-300 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-5 w-5 text-neutral-dark" />
                <span className="sr-only">Search</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-10 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5 text-neutral-dark" />
                <span className="sr-only">Close</span>
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      <CartOverlay />
    </header>
  );
}
